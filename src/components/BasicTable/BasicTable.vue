/**
* 创建于 2018/1/23
* 功能: 基础表格组件
*/

<template>
  <div class='basic-table'>
    <!--列表-->
    <el-table :data="dataList" border stripe @sort-change="sortChange">
      <template v-for="(column, $index) in columns"
                :key='$index'>
        
        <!--按钮操作列-->
        <el-table-column v-if="column.operations" align="center"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width||(column.operations.length*30+100)"
                         :formatter="column.formatter"
                         fixed="right"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-tooltip v-for="(operate,index) in column.operations" placement="top"
                        :content="operate.label"
                        :key="index">
              <el-button type="text" class="form-icon"
                         v-show="operate.show?operate.show(scope.$index, scope.row):true"
                         :key="index"
                         :icon="operate.icon"
                         :style="operate.disabledfunc?!operate.disabledfunc(scope.$index,scope.row)?'color:'+(operate.color||'#5576ed'):'':''"
                         @click="operate.func(scope.$index, scope.row)"
                         :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <!--点击内容弹出的列-->
        <el-table-column v-else-if="column.func || column.href" align="center"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <a @click="column.func(scope.$index, scope.row)"
               v-if='scope.row[column.prop]'
               class='clickable-link'>
              {{scope.row[column.prop]}}
            </a>
            <span v-else-if='column.formatBeside'>{{column.formatBeside(scope.$index, scope.row)}}</span>
          </template>
        </el-table-column>
        
        <!--角色管理使用，无需使用可以删除-->
        <el-table-column v-else-if="column.list" align="center"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-tag v-for='item in scope.row[column.prop]' :key='item.id'>
              {{item.roleName}}
            </el-tag>
          </template>
        </el-table-column>
        
        <!--排序列，无需使用可以删除-->
        <el-table-column v-else-if="column.sortable"
                         sortable="custom"
                         align="center"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
        </el-table-column>
        
        <!--普通展示列-->
        <el-table-column v-else align="center"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
        </el-table-column>
      </template>
    </el-table>
    
    <!--分页  -->
    <el-row>
      <el-col :span="24">
        <el-pagination layout="total, sizes, prev, pager, next" background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="page"
                       :page-size="rows"
                       :page-sizes="[10, 20, 30, 50, 80, 100]"
                       :total="total"
                       class="table-pag"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const sortMap = { descending: 'desc', ascending: 'ASC' }
  export default {
    props: {
      api: { type: Function },    // 下个项目换名字
      columns: { type: Array },
      initCondition: { type: Object }
      /*
          api: Robot.robotList,
          columns: [
            {
              label: '机器编号',
              prop: 'code',
              func: this.checkDialogShow
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
              label: '使用状态',
              prop: 'disableFlag',
              formatter: (row, column, cellValue) => Filters.disableFlagFilter(cellValue)
            }, {
              label: '连接状态',
              prop: 'connectStatus',
              formatter: (row, column, cellValue) => Filters.connectStatusFilter(cellValue)
            }, {
              label: '是否故障',
              prop: 'runningStatus',
              formatter: (row, column, cellValue) => Filters.runningStatusFilter(cellValue)
            }, {
              label: '操作',
              operations: [{
                label: '编辑',
                func: this.editDialogShow,
                icon: 'el-icon-my-xiugai',
                disabledfunc: () => !this.modify.show
              }, {
                label: '启用',
                func: this.enableRobot,
                icon: 'el-icon-my-renwukaishi',
                show: (idx, rows) => rows.disableFlag === 1,
                disabledfunc: () => !this.enable.show
              }, {
                label: '停用',
                func: this.disableRobot,
                icon: 'el-icon-my-renwuweikaishi',
                show: (idx, rows) => rows.disableFlag === 0,
                disabledfunc: () => !this.enable.show
              }]
            }]
      */
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        storeParams: {},
        listLoading: false,
        dataList: [],
        sortParams: {
          orderColumn: '',
          orderBy: ''
        }
      }
    },
    methods: {
      /**
       * 获得表格内容
       */
      getlist(param) {
        this.api(param).then(res => {
          this.listLoading = false
          const { total, dataList } = res.data
          this.dataList = dataList
          this.total = total
          this.listLoading = false
        }).catch((err) => {
          console.error(err)
          this.listLoading = false
        })
      },
      
      /**
       * 不含查询条件的查询
       */
      reSearch() {
        this.listLoading = true
        if (this.page !== 1) {
          this.page = 1
        } else {
          const param = Object.assign({}, this.storeParams, this.sortParams)
          param.rows = this.rows
          param.page = 1
          this.getlist(param)
        }
      },
      
      /**
       * 查询按钮查询
       */
      search(params) {
        this.storeParams = Object.assign({}, params)
        this.reSearch()
      },
      
      /**
       * 处理页数变化
       */
      handleSizeChange(val) {
        this.listLoading = true
        this.rows = val
        if (this.page !== 1) {
          this.page = 1
        } else {
          const param = Object.assign({}, this.storeParams, this.sortParams)
          param.rows = val
          param.page = 1
          setTimeout(() => this.getlist(param), 100)
        }
      },
      
      /**
       * 处理当前页改变
       */
      handleCurrentChange(val) {
        this.listLoading = true
        this.page = val
        const param = Object.assign({}, this.storeParams, this.sortParams)
        param.rows = this.rows
        param.page = val
        setTimeout(() => this.getlist(param), 100)
      },
      /**
       * 处理排序
       */
      sortChange({ column, prop, order }) {
        this.sortParams.orderColumn = prop || ''
        this.sortParams.orderBy = order ? sortMap[order] : ''
        this.reSearch()
      }
    },
    mounted() {
      this.search(this.initCondition)
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .basic-table {
    .clickable-link {
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      color: #3277fe;
      text-decoration: underline;
      cursor: hand;
    }
    .el-tag {
      margin: 3px 10px;
    }
  }
</style>
