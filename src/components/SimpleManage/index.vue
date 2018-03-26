/**
* 创建于 2018/3/22
* 作者: Qianyu
* 功能: 机器人管理 - 机器人列表
*/


<template>
  <div class='robot-list'>
    <!-- 多项条件选择 -->
    <div class='multi-condition-wrapper'>
      <multi-condition :config='multiConditionConfig'
                       @upload-params='uploadParams'></multi-condition>
      <!--@config-update='updateConfig'-->
    </div>
    
    <!-- 信息列表 -->
    <div class='data-area'>
      
      <div class='data-btns'>
        <el-button @click='check' type='primary'>注册</el-button>
        <el-button @click='check' type='primary'>查询</el-button>
      </div>
      
      <div class='basic-table-wrapper'>
        <basic-table ref="table"
                     :api="tableApi"
                     :columns="basicTableConfig"></basic-table>
      </div>
    </div>
  
  </div>
</template>

<script type='text/javascript'>
  import * as Api from 'api'
  import MultiCondition from 'components/MultiCondition'
  import BasicTable from 'components/BasicTable/BasicTable'
  
  import { runningStatus, connectStatus } from 'utils/statusKeyValue'
  
  export default {
    name: 'RobotManage',
    components: { MultiCondition, BasicTable },
    data() {
      return {
        // 多项条件选择组件暴露出来的 选择结果
        conditionParams: null,
        // 多项条件选择组件配置
        multiConditionConfig: {
          updateTimestamp: 0,                 // 更新标志
          conditionTagsTitle: '查询条件',
          conditionSeries: [
            // series 1
            {
              seriesName: '机器人详细信息',
              seriesData: [
                {
                  type: 'select',
                  selectItems: null,
                  selectItemsApi: Api.getList1,
                  paramName: 'companyId',
                  placeholder: '名称',
                  dispValue: 'id',
                  dispLabel: 'name',
                  vmodel: null,
                  currPath: 'conditionSeries[0].seriesData[0]',
                  selectedLabel: null
                },
                {
                  type: 'select',
                  selectItems: null,
                  selectItemsApi: Api.getList3,
                  paramName: 'functionId',
                  placeholder: '功能',
                  dispValue: 'paramValue',
                  dispLabel: 'paramDesc',
                  vmodel: null,
                  currPath: 'conditionSeries[0].seriesData[1]',
                  selectedLabel: null
                },
                {
                  type: 'select',
                  selectItems: null,
                  selectItemsApi: Api.getList3,
                  paramName: 'modelId',
                  placeholder: '型号',
                  dispValue: 'paramValue',
                  dispLabel: 'paramDesc',
                  vmodel: null,
                  currPath: 'conditionSeries[0].seriesData[2]',
                  selectedLabel: null
                },
                {
                  type: 'select',
                  selectItems: null,
                  selectItemsApi: Api.getList1,
                  paramName: 'code',
                  placeholder: '编号',
                  dispValue: 'id',
                  dispLabel: 'name',
                  vmodel: null,
                  currPath: 'conditionSeries[0].seriesData[3]',
                  showDependOn: 'conditionSeries[0].seriesData[1].vmodel||conditionSeries[0].seriesData[2].vmodel',
                  filterBy: 'conditionSeries[0].seriesData[0].vmodel,conditionSeries[0].seriesData[1].vmodel,conditionSeries[0].seriesData[2].vmodel',
                  selectedLabel: null
                }
              ]
            },
            // series 2
            {
              seriesName: '机器人状态',
              seriesData: [{
                type: 'select',
                selectItems: connectStatus,
                paramName: 'connectStatus',
                placeholder: '状态',
                dispValue: 'value',
                dispLabel: 'label',
                vmodel: null,
                currPath: 'conditionSeries[1].seriesData[0]',
                selectedLabel: null
              }, {
                type: 'select',
                selectItems: runningStatus,
                paramName: 'runningStatus',
                placeholder: '等级',
                dispValue: 'value',
                dispLabel: 'label',
                vmodel: null,
                currPath: 'conditionSeries[1].seriesData[1]',
                selectedLabel: null
              }]
            }]
        },
        tableApi: Api.helloList,
        basicTableConfig: [
          {
            label: '机器编号',
            prop: 'code',
            func: this.check
          }, {
            label: '机器功能',
            prop: 'functionName'
          }, {
            label: '机器型号',
            prop: 'modelName'
          }, {
            label: '企业名称',
            prop: 'companyName'
          }, {
            label: '操作',
            operations: [{
              label: '编辑',
              func: this.check,
              icon: 'el-icon-document',
              disabledfunc: () => false
            }, {
              label: '启用',
              func: this.check,
              icon: 'el-icon-circle-check',
              disabledfunc: () => false
            }, {
              label: '停用',
              func: this.check,
              icon: 'el-icon-circle-close',
              disabledfunc: () => false
            }]
          }],
        selectRobot: {},
        checkRobotVisible: false,
        editRobotVisible: false
      }
    },
    methods: {
      check(idx, rows) {
        console.info('弹出弹框')
      },
      
      /**
       * 获取多项选择组件暴露的 选择结果
       * @param payload 多项选择组件暴露的 选择结果
       */
      uploadParams(payload) {
        this.conditionParams = { ...payload }
      }
      
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '~styles/mixin';
  
  .robot-list {
    @include moduleArea();
    
    /* 多项条件选择 */
    .multi-condition-wrapper {
      margin-bottom: 20px;
    }
    
    /* 内容区 */
    .data-area {
      .data-btns {
        display: flex;
        flex-flow: row;
        justify-content: center;
        
        .el-button {
          margin-right: 20px;
          margin-bottom: 20px;
        }
      }
      
    }
  }
</style>
