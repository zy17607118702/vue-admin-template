<template>
  <!--
      Author：zhangyang
      Time：2019-05-23
      Describe：工厂，组件化页面改造
    -->
  <div class="app-container">
    <div class="app-search-container">
      <div class="action-title">查询</div>
      <div class="new-search-container">
        <div class="item-container">
          <div class="item">
            <span class="item-title">工厂</span>
            <div class="item-body">
              <el-select v-model="listQuery.id" clearable filterable placeholder="请选择" size="mini">
                <el-option v-for="(option, index) in queryData.plantOptions" :key="index" :label="`${option.code}-${option.description}`"
                  :value="option.id" />
              </el-select>
            </div>
          </div>
          <div class="item-button">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="mini" icon="el-icon-circle-close" @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
      <div class="divider" />
      <div class="action-container">
        <div class="action-title">操作</div>
        <el-button size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </div>
    </div>
    <div class="app-wrap-container">
      <div class="table-container">
        <el-table v-loading="tableParams.listLoading" :data="tableParams.list" height="100%" element-loading-text="正在加载中..."
          fix stripe border highlight-current-row @selection-change="handleSelectionChange" @sort-change='handleTableSortChange'>
          <el-table-column type="selection" width="45" />
          <el-table-column v-for="(column, index) in tableColumns" v-if="column.tableShow" :sortable="true" :key="index"
            :label="column.label" :prop="column.prop" min-width="120" align="left">
            <template slot-scope="scope">
              <span v-if="column.columnCb">
                {{column.columnCb(scope.row)}}
              </span>
              <span v-else>
                {{ scope.row[column.prop] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer-container">
        <div class="pagination-center">
          <el-pagination :current-page="listQuery.page" :page-sizes="[20, 50, 100, 200]" :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper" :page-count="5" :total="tableParams.listTotal"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!--新建,查看与编辑 start-->
    <form-dialog v-if="formParams.dialogVisible" v-model="formParams.dialogVisible" :formParams="formParams"
      :addOrUrdate="addOrUrdate" :dialogTemp="dialogTemp" :tableColumns="tableColumns" :api="api" :formOptions="formOptions"
      @createDialogData="createDialogData" @updateDialogData="updateDialogData" />
    <!--新建,查看与编辑 end-->
  </div>
</template>

<script>
  import plantApi from '@/api/mainData/plant'
  import YH from '@/mixins/YH0'
  import FormDialog from "@/components/panel/formDialog"

  export default {
    name: 'plant',
    mixins: [YH],
    components: {
      FormDialog
    },
    data() {
      return {
        api: plantApi,
        listQuery: {
          limit: 20,
          page: 1,
          sort: null,
          id: ''
        },
        queryData: {
          plantOptions: []
        },
        formOptions: {
          trackTypeOptions: []
        },
        tableParams: {
          list: [],
          listTotal: 0,
          listLoading: false,
        },
        formParams: {
          //form表单参数
          loading: false,
          formDisabled: true,
          dialogVisible: false,
          status: 'view'
        },
        addOrUrdate: false,
        dialogTemp: {
          id: '',
          plantNo: '',
          sapPlantNo: '',
          plantNameC: '',
          plantNameE: '',
          plantNameCS: '',
          plantNameES: '',
          plantAddrC1: '',
          plantAddrC2: '',
          plantAddrC3: '',
          plantAddrE1: '',
          plantAddrE2: '',
          plantAddrE3: '',
          tracktype: '',
          markStatus: false
        },
        tableColumns: [{
            "label": "id",
            "prop": "id",
            "tableShow": false,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": false,
            "valueType": "id",
            "model": "id",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "工厂代码",
            "prop": "plantNo",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": true,
            "formShow": true,
            "valueType": "id",
            "model": "plantNo",
            "optionsData": "",
            "rules": "inputRules"
          }, {
            "label": "对应SAP代码",
            "prop": "sapPlantNo",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "sapPlantNo",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "工厂中文名称",
            "prop": "plantNameC",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantNameC",
            "optionsData": "",
            "rules": "inputRules"
          }, {
            "label": "工厂英文名称",
            "prop": "plantNameE",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantNameE",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "工厂中文简称",
            "prop": "plantNameCS",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantNameCS",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "工厂英文简称",
            "prop": "plantNameES",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantNameES",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "中文地址1",
            "prop": "plantAddrC1",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrC1",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "中文地址2",
            "prop": "plantAddrC2",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrC2",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "中文地址3",
            "prop": "plantAddrC3",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrC3",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "英文地址1",
            "prop": "plantAddrE1",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrE1",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "英文地址2",
            "prop": "plantAddrE2",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrE2",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "英文地址3",
            "prop": "plantAddrE3",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": "",
            "editType": "input",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "plantAddrE3",
            "optionsData": "",
            "rules": ""
          }, {
            "label": "关键件类型",
            "prop": "tracktype",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": '',
            "editType": "select",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": false,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "code",
            "model": "tracktype",
            "optionsData": "trackTypeOptions",
            "rules": ""
          },
          {
            "label": "是否激活",
            "prop": "markStatus",
            "tableShow": true,
            "width": 100,
            "sort": false,
            "columnCb": (row) => row.markStatus ? '是' : '否',
            "editType": "checkbox",
            "remoteCb": "",
            "selectCb": "",
            "optionsFormat": true,
            "ifDisabled": false,
            "formShow": true,
            "valueType": "id",
            "model": "markStatus",
            "optionsData": "",
            "rules": ""
          }
        ]
      }
    },
    created() {
      this.initOptions()
    },
    computed: {
      formStatus() {
        return this.formParams.status
      }
    },
    watch: {
      formStatus(val) {
        //判断创建还是更新来决定是否禁用
        if ('update' === val) {
          this.addOrUrdate = true
        } else if ('create' === val) {
          this.addOrUrdate = false
        } else {
          this.addOrUrdate = false
        }
      }
    },
    methods: {
      // 查询操作
      handleFilter() {
        this.listQuery.page = 1
        this.fetchData()
      },
      // 重置操作
      handleReset() {
        this.listQuery = {
          limit: 20,
          page: 1,
          sort: null,
          id: ''
        }
      },
      initOptions() {
        this.getOptions('getPlantOptions', {}, 'plantOptions', 'queryData')
        this.getOptions('getTrackTypeOptions', {}, 'trackTypeOptions', 'formOptions')
      },
      mergeTemp(res) {
        if (res) {
          for (let key in this.dialogTemp) {
            if (res.hasOwnProperty(key)) {
              this.dialogTemp[key] = res[key]
            }
          }
        }
      }
    }
  }

</script>
