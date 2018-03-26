/**
* 创建于 2018/3/23
* 作者: SHERlocked93
* 功能: 多项条件选择组件
* TODO: 1. select还未设置500条限制
* TODO: 2. filterBy更新还未根据被依赖项更新而更新，目前是其他所有项更新就更新
*/


<template>
  <div class='multi-condition'>
    <!-- 查询条件的tags -->
    <div class='condition-tags'>
      <div class='condi-title'>{{config.conditionTagsTitle}}:</div>
      <el-tag v-for='tag in seriesDataCollection'
              v-if='tag.selectedLabel'
              :key='tag.selectedLabel+tag.placeholder'
              @close='closeTag(tag)'
              type="danger"
              closable
              class='condi-tag'>
        {{tag.placeholder}}: {{tag.selectedLabel}}
      </el-tag>
    </div>
    
    <!--查询条件 Select -->
    <div v-for='(serie, $index) in config.conditionSeries'
         :key='$index'
         class='condition-select'>
      <div class='condi-title'>{{serie.seriesName}}:</div>
      
      <!-- 普通选择框 select-->
      <el-select v-if='serieData.type==="select" && showDependOn(serieData)'
                 v-for='(serieData, $index) in serie.seriesData'
                 v-model="serieData.vmodel"
                 @change='changeConfig(serieData.currPath+".vmodel",$event)'
                 :key='$index'
                 :placeholder="serieData.placeholder"
                 :value='serieData.selectedLabel'
                 class='condi-select'
                 filterable clearable>
        <el-option v-for="item in serieData.selectItems" v-if='serieData.selectItems'
                   :value="item[serieData.dispValue]"
                   :label="item[serieData.dispLabel]"
                   :key="item[serieData.dispValue]+item[serieData.dispLabel]"></el-option>
      </el-select>
      
      <!--查询条件 时间 dateTimePicker -->
      <el-date-picker v-if='serieData.type==="dateTimePicker"'
                      v-for='(serieData, $index) in serie.seriesData'
                      v-model="serieData.vmodel"
                      @change='changeConfig(serieData.currPath+".vmodel",$event)'
                      :key='$index'
                      class='codition-datepicker'
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right">
      </el-date-picker>
    
    </div>
  
  </div>
</template>

<script type='text/javascript'>
  import _ from 'lodash'
  
  export default {
    name: 'MultiSelect',
    props: {
      config: { type: Object }           // 配置项
    },
    data() {
      return { seriesDataCollection: [] }
    },
    watch: {
      /**
       * 监听是否有数据更改
       */
      'config.updateTimestamp'() {
        this.$nextTick(() => {
          this.initSelectItems()
          this.getSelectLabel()
          this.$emit('upload-params', this.generateParams(this.config))
        })
      }
    },
    methods: {
      /**
       * 从selectItemsApi取数据到selectItems
       */
      initSelectItems() {
        this.config.conditionSeries
          .forEach(T1 => T1.seriesData
            .forEach(T2 => {
              if (T2.type === 'dateTimePicker') return
              if (T2.filterBy) {                            // 是依赖其他项更改而更改的项
                this.showDependOn(T2) && T2.selectItemsApi
                  .apply(null, T2.filterBy.split(',')
                    .map(path => _.get(this.config, path)))
                  .then(({ data: { dataList } }) => this.$set(T2, 'selectItems', dataList))
              } else {                                     // 不是依赖其他项更改而更改的项
                if (_.isArray(T2.selectItems)) return
                if (_.isFunction(T2.selectItems) || !T2.selectItems) {
                  T2.selectItemsApi()
                    .then(({ data: { dataList } }) => this.$set(T2, 'selectItems', dataList))
                } else console.error(T2.selectItems, '错误的 conditionSeries[].seriesData.selectItems 类型')
              }
            })
          )
      },
      
      /**
       * 获取选项的label，用来显示tag
       */
      getSelectLabel() {
        this.seriesDataCollection = []
        _.cloneDeep(this.config).conditionSeries
          .forEach(T1 => T1.seriesData
            .forEach(T2 => {
              if (T2.vmodel && T2.type === 'select') {                  // 下拉选择
                this.$set(T2, 'selectedLabel', T2.selectItems && T2.selectItems.find(T3 =>
                  T3[T2.dispValue] === T2.vmodel)[T2.dispLabel] || null)
              }
              if (T2.vmodel && T2.type === 'dateTimePicker') {          // 时间选择器
                const { vmodel } = T2
                this.$set(T2, 'selectedLabel', vmodel.length && `${vmodel[0].toLocaleString()} - ${vmodel[1].toLocaleString()}`)
              }
              this.seriesDataCollection.push(T2)
            })
          )
      },
      
      /**
       * 选项修改
       * @param path
       * @param value
       */
      changeConfig(path, value) {
        this.updateConfig(path, value)
        // this.$emit('config-update', path, value)
      },
      
      /**
       * 计算是否应该显示出来，目前只考虑了 或 的情况
       * @param serieData
       */
      showDependOn(serieData) {
        let show = true
        if (serieData.showDependOn && serieData.showDependOn.includes('||')) {
          serieData.showDependOn.split('||').forEach(T => {
            if (!_.get(this.config, T)) show = false
          })
        }
        return show
      },
      
      /**
       * 关闭tag
       * @param tag
       */
      closeTag(tag) {
        this.changeConfig(`${tag.currPath}.vmodel`, null)
      },
      
      /**
       * 更新配置数据
       * @param path 路径
       * @param value 值
       */
      updateConfig(path, value) {
        _.set(this.config, path, value)
        this.$set(this.config, 'updateTimestamp', +new Date())
      },
      
      /**
       * 生成暴露出去的选择结果
       * @param config
       */
      generateParams(config) {
        const result = {}
        this.config.conditionSeries
          .forEach(T1 => T1.seriesData
            .forEach(T2 => {
              if (T2.paramName) {
                if (T2.type === 'select') {
                  result[T2.paramName] = T2.vmodel
                } else if (T2.type === 'dateTimePicker') {
                  result[T2.paramName1] = +T2.vmodel[0]
                  result[T2.paramName2] = +T2.vmodel[1]
                }
              }
            })
          )
        return result
      }
    },
    mounted() {
      this.initSelectItems()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .multi-condition {
    /* tags */
    .condition-tags {
      .condi-tag {
        margin-right: 20px;
      }
    }
    
    /* 查询条件 */
    .condition-select {
      
      .condi-select {
        margin-right: 20px;
      }
    }
    
    .condition-tags, .condition-select {
      height: 38px;
      display: flex;
      flex-flow: row;
      align-items: center;
    }
    
    .condi-title {
      width: 140px;
    }
  }
</style>
