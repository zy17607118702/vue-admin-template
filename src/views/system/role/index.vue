<template>
  <!-- 角色管理 -->
  <div class="app-container">
    <div class="app-search-container" style="height:70px">
      <div class="action-title">查询</div>
      <div class="new-search-container">
        <div class="item-container">
          <div class="item">
            <span class="item-title">角色代码</span>
            <div class="item-body"><el-input v-model="listQuery.roleCode" size="mini" placeholder="请输入" /></div>
          </div>
          <div class="item">
            <span class="item-title">角色名称</span>
            <div class="item-body"><el-input v-model="listQuery.name" size="mini" placeholder="请输入" /></div>
          </div>
          <div class="item">
            <span class="item-title">角色描述</span>
            <div class="item-body"><el-input v-model="listQuery.description" size="mini" placeholder="请输入" /></div>
          </div>
          <div class="item-button">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="mini" icon="el-icon-circle-close" @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
      <div class="divider" />
    </div>
    <div class="app-wrap-container" style="height:calc(100% - 70px)">
      <Multipane
        class="custom-resizer"
        :class="{ hideCustomResizer: isShrinkRightPane }"
        layout="vertical"
        style="height:100%"
      >
        <div :style="{ width: '50%', minWidth: '200px' }" :class="{ expandLeftPane: isShrinkRightPane }">
          <div class="table-container">
            <el-table
              v-loading="listLoading"
              :data="list"
              height="auto"
              element-loading-text="正在加载中..."
              fix
              stripe
              border
              highlight-current-row
              @sort-change="handleTableSortChange"
              @row-click="handleUpdate1"
            >
              <el-table-column
                v-for="(column, index) in tableColumns"
                :key="index"
                :label="column.name"
                :prop="column.prop"
                :width="column.width"
                min-width="120"
                align="left"
                sortable="custom"
              />
            </el-table>
          </div>
          <div class="footer-container">
            <div class="pagination-center">
              <el-pagination
                :current-page="listQuery.page"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :page-count="5"
                :total="listTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
        <MultipaneResizer />
        <div :style="{ flexGrow: 1, minWidth: '500px' }" :class="{ shrinkRightPane: isShrinkRightPane }">
          <div class="split-right-container">
            <div class="wrap-title" @click="isShrinkRightPane = true">
              <div class="left">详细信息</div>
              <div class="right"><i class="el-icon-arrow-right" /></div>
            </div>
            <div class="wrap-content">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基础信息" name="1">
                  <el-form
                    ref="dataForm"
                    v-loading="dialogLoading"
                    element-loading-text="数据加载中..."
                    :model="dialogTemp"
                    label-position="left"
                    label-width="300px"
                    size="mini"
                  >
                    <el-form-item
                      v-for="(item, index) in tableColumns"
                      :key="index"
                      :label="item.name"
                      :prop="item.prop"
                    >
                      <el-select v-if="item.type && item.type == 'select'" v-model="dialogTemp[item.prop]" clearable>
                        <el-option
                          v-for="(option, optionIndex) in $data[item.options]"
                          :key="optionIndex"
                          :label="option.label"
                          :value="option.code"
                        />
                      </el-select>
                      <el-input v-else v-model="dialogTemp[item.prop]" clearable :disabled="formDisabled1"/>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="成员用户列表" name="2">
                  <el-row type="flex">
                    <el-col>
                      <el-table
                        ref="detailTable"
                        v-loading="listLoading"
                        :data="userList"
                        element-loading-text="正在加载中..."
                        height="auto"
                        fix
                        stripe
                        border
                        highlight-current-row
                      >
                        <el-table-column
                          v-for="(column, index) in detailTableColumns"
                          :key="index"
                          :label="column.name"
                          :prop="column.prop"
                          :width="column.width"
                          min-width="120"
                          align="center"
                        />
                      </el-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="已授权资源列表" name="3">
                  <div class="action-container">
                    <el-button size="mini" type="primary" icon="el-icon-circle-plus" @click="authorization" :disabled="addButton">授权资源访问权限</el-button>
                    <el-button size="mini" icon="el-icon-delete" @click="del" :disabled="delButton">删除资源访问权限</el-button>
                    <el-button size="mini" icon="el-icon-edit" @click="configuration" :disabled="addButton">按钮权限配置</el-button>
                    <el-button size="mini" @click="expand" icon="el-icon-circle-plus-outline" :disabled="addButton"></el-button>
                    <el-button size="mini" @click="collapse" icon="el-icon-remove-outline" :disabled="addButton"></el-button>
                  </div>
                  <el-row type="flex">
                    <el-col>
                      <tree-table
                        v-loading="listLoading"
                        :data="resourcelist"
                        leaf-flag="isLeaf"
                        :expand-props="{ name: '类型', value: 'resourceType' }"
                        :map-types="mapTypes"
                        :is-async-expand="isAsyncExpand"
                        :is-expand-all="isExpandAll"
                        :is-init-all="true"
                        element-loading-text="正在加载中..."
                        @row-click="getDelCode"
                      >
                        <el-table-column header-align="center" label="资源名称" prop="resName" min-width="100" />
                        <el-table-column header-align="center" label="资源描述" prop="resDesc" min-width="100" />
                      </tree-table>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </Multipane>
      <div v-show="isShrinkRightPane" class="expandWrapRight">
        <i class="el-icon-arrow-left" @click="isShrinkRightPane = false" />
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="770px"
      title="选择资源进行授权"
      @close="handleDialogClose"
    >
      <div style="padding-bottom:10px;">配置资源权限</div>
      <div>选择允许当前角色可以访问的资源进行授权</div>
      <tree-table1
        v-loading="listLoading"
        :data="unselectresourceList"
        leaf-flag="isLeaf"
        :expand-props="{ name: '类型', value: 'resourceType' }"
        :map-types="mapTypes"
        :is-async-expand="isAsyncExpand"
        :is-expand-all="isExpandAll"
        :is-init-all="true"
        element-loading-text="正在加载中..."
        @selection-change="resouceChoose"
        @row-click="resouceClick"
        ref="resourceTable"
        v-if="false"
      >
        <el-table-column header-align="center" label="资源名称" prop="resName" min-width="100" />
        <el-table-column header-align="center" label="资源描述" prop="resDesc" min-width="100" />
      </tree-table1>
      <el-tree
        :data="unselectresourceList"
        show-checkbox
        :props="props"
        @check-change="handleCheckResourceChange"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="resouceSure">确认</el-button>
        <el-button type="primary" @click="resouceCancel">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible1"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="770px"
      title="选择资源进行授权"
      @close="handleDialogClose"
    >
      <div style="padding-bottom:10px;">配置按钮权限</div>
      <div>选择需要禁止当前角色可使用的按钮</div>
      <tree-table1
        v-loading="listLoading"
        :data="unselectactresourceList"
        leaf-flag="isLeaf"
        :expand-props="{ name: '类型', value: 'resourceType' }"
        :map-types="mapTypes"
        :is-async-expand="isAsyncExpand"
        :is-expand-all="isExpandAll"
        :is-init-all="true"
        element-loading-text="正在加载中..."
        @selection-change="buttonChoose"
        @row-click="buttonClick"
        v-if="false"
      >
        <el-table-column header-align="center" label="资源名称" prop="resName" min-width="100" />
        <el-table-column header-align="center" label="资源描述" prop="resDesc" min-width="100" />
      </tree-table1>
      <el-tree
        :data="unselectactresourceList"
        show-checkbox
        :props="props"
        @check-change="handleCheckButtonChange"
        node-key="isNegative"
        :default-expand-keys="[false]"
        :default-checked-keys="[false]"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="buttonSure">确认</el-button>
        <el-button type="primary" @click="buttonCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/user'
import roleMaintainApi from '@/api/system/role'
import curd from '@/mixins/curd'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import treeTable from '@/components/TreeTable'
import treeTable1 from '@/components/TreeTable1'

export default {
  name: 'roleMaintain',
  components: {
    Multipane,
    MultipaneResizer,
    treeTable,
    treeTable1
  },
  mixins: [curd],
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
      props:{
        label:'resName',
        children:'resources'
      },
      mapTypes: {
        'RC':'富客户端',
        'CAT':'资源分类',
        'PER':'透视图',
        'VIW':'视图',
        'ACT':'Action',
        'WEB':'Web',
        'WEB-CAT':'Web资源分类',
        'FUNC':'Web功能模块',
        'URL':'Web URL资源',
        'DEVICE':'移动终端',
        'DEVICE-CAT':'Device资源分类',
        'DEVICE-VIW':'Device视图',
        'SCREEN':'大屏终端',
        'SCREEN-CAT':'Screen资源分类',
        'SCREEN-VIW':'Screen视图'
      },
      trans:false,
      rowId:'',
      delId:'',
      api: roleMaintainApi,
      isTreeTablePage: true,
      isAsyncExpand: false,
      isExpandAll: false,
      isShrinkRightPane: false,
      activeNames: ['1', '2' ,'3'],
      isDoubleColumnPage: true,
      listQuery: {
        limit: 20,
        page: 1,
        sort: null,
        roleCode:'',
        name:'',
        description:''
      },
      list: [],
      list1:[],
      userList:[],
      resourcelist:[],
      unselectresourceList:[],
      unselectactresourceList:[],
      resouceIdList:[],
      buttonIdList:[],
      listTotal: 0,
      listLoading: false,
      templateTypeOptions: [],
      textMap: {
        view: '查看详情',
        create: '创建',
        update: '更新'
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogStatus: 'view',
      dialogLoading: false,
      delButton:true,
      addButton:true,
      formDisabled: true,
      formDisabled1: true,
      dialogTemp: {
      },
      dialogDetailTemp: {},
      dialogDetailStatus: 'view',
      tableColumns: [
        {
          name: '角色代码',
          prop: 'roleCode',
        },
        {
          name: '角色名称',
          prop: 'name',
        },
        {
          name: '角色描述',
          prop: 'description',
        }
      ],
      detailTableColumns: [
        {
          name: '用户登录名',
          prop: 'username'
        },
        {
          name: '用户描述',
          prop: 'description'
        },
        {
          name: '真实姓名',
          prop: 'realName'
        }
      ],
      detailTableColumns1: [
        {
          name: '类型',
          prop: 'resourceType'
        },
        {
          name: '资源名称',
          prop: 'resName'
        },
        {
          name: '资源描述',
          prop: 'resDesc'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    handleCheckResourceChange(data,checked,indeterminate){
      if(checked==true&&indeterminate==false){
        console.log('加入')
        this.resouceIdList.push(data.id)
      }else{
        console.log('去除')
        var index = this.resouceIdList.indexOf(data.id)
        if(index>-1){
          this.resouceIdList.splice(index,1)
        }
      }
      console.log(this.resouceIdList)
    },
    handleCheckButtonChange(data,checked,indeterminate){
      console.log(data,checked,indeterminate)
      if(checked==true&&indeterminate==false){
        console.log('加入')
        this.buttonIdList.push(data.id)
      }else{
        console.log('去除')
        var index = this.buttonIdList.indexOf(data.id)
        if(index>-1){
          this.buttonIdList.splice(index,1)
        }
      }
      console.log(this.buttonIdList)
    },
    // 查询操作
    handleFilter() {
      this.listQuery.page = 1
      this.delButton = true
      this.addButton = true
      this.fetchData1()
    },
    // 获取表格数据
    fetchData1() {
      this.initWrapRight1()
      this.listLoading = true
      this.api
        .getList(this.listQuery)
        .then(response => {
          this.list = response.content
          this.listTotal = response.total
          this.listLoading = false
        })
        .catch(e => {
          this.listLoading = false
        })
    },
    // 重置右侧内容区域
    initWrapRight1() {
      if (this.isDoubleColumnPage) {
        this.dialogStatus = 'view'
        this.dialogDetailStatus = 'view'
      }
    },
    // 修改操作
    handleUpdate1(row) {
      this.delButton = true
      this.rowId = row.id;
      this.dialogTemp = row;
      this.initWrapRight1()
      this.dialogLoading = true
      this.dialogStatus = 'update'
      this.fieldDisabled = true
      this.api
        .getDetailById(row.id)
        .then(res => {
          this.userList = res
          this.dialogLoading = false
          this.addButton = false
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
        .catch(e => {
          this.dialogLoading = false
        })
      this.api
        .getResourceDetailById(row.id)
        .then(res => {
          this.resourcelist = res
          this.dialogLoading = false
          this.$nextTick(() => {
            // this.$refs['detailTable'].clearValidate()
          })
        })
        .catch(e => {
          this.dialogLoading = false
        })
    },
    // 重置操作
    handleReset() {
      this.listQuery = {
        limit: 20,
        page: 1,
        sort: null,
        roleCode:'',
        name:'',
        description:''
      }
    },
    //授权资源访问权限
    authorization(){
      this.resouceIdList = []
      if(this.rowId!=''){
        this.dialogVisible = true
        this.dialogLoading = true
        this.isAsyncExpand1 = true
        this.isExpandAll1 = false
        this.api
          .getunselectresourceById(this.rowId)
          .then(res => {
            this.unselectresourceList = res
            this.dialogLoading = false
            this.$nextTick(() => {
            })
          })
          .catch(e => {
            this.dialogLoading = false
          })
      }
      // this.isAsyncExpand = true
      // this.isExpandAll = false
      // this.api
      //   .getResourceDetailById(this.rowId)
      //   .then(res => {
      //     this.resourcelist = res
      //     this.dialogLoading = false
      //   })
      //   .catch(e => {
      //     this.dialogLoading = false
      //   })
    },
    //删除资源访问权限
    del(){
      // console.log(this.rowId)
      // console.log(this.delId)
      console.log('删除')
      this.api.delresource({roleId:this.rowId,resourceId:this.delId}).then(res => {
        this.$message({
          message: '数据删除成功',
          type: 'success'
        })
        this.api
        .getResourceDetailById(this.rowId)
        .then(res => {
          this.resourcelist = res
          this.dialogLoading = false
        })
        .catch(e => {
          this.dialogLoading = false
        })
      })
    },
    //按钮权限配置
    configuration(){
      this.buttonIdList = []
      this.unselectactresourceList = []
      this.dialogVisible1 = true
      this.dialogLoading = true
      this.api
        .getunselectactresourceById(this.rowId)
        .then(res => {
          console.log(res)
          this.unselectactresourceList = res
          this.dialogLoading = false
          this.$nextTick(() => {
          })
        })
        .catch(e => {
          this.dialogLoading = false
        })
    },
    //展开
    expand(){
      this.listLoading = true
      this.isAsyncExpand = false
      this.isExpandAll = true
      this.api.getResourceDetailById(this.rowId).then(res => {
        this.resourcelist = res
        this.listLoading = false
      })
    },
    //收缩
    collapse(){
      this.isAsyncExpand = true
      this.isExpandAll = false
      this.api
        .getResourceDetailById(this.rowId)
        .then(res => {
          this.resourcelist = res
          this.dialogLoading = false
        })
        .catch(e => {
          this.dialogLoading = false
        })
    },
    getDelCode(row) {
      this.delId = row.id
      this.delButton = false
    },
    //资源权限选择
    resouceChoose(val) {
      var a = [];
      val.forEach((item, index) => {
        a.push(item.id)
        if(item.resources!=[]&&item.resources!=null){
          item.resources.forEach((item, index) => {
            a.push(item.id)
            if(item.resources!=[]&&item.resources!=null){
              item.resources.forEach((item, index) => {
                a.push(item.id)
                if(item.resources!=[]&&item.resources!=null){
                  item.resources.forEach((item, index) => {
                    a.push(item.id)
                    if(item.resources!=[]&&item.resources!=null){
                      item.resources.forEach((item, index) => {
                        a.push(item.id)
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.resouceIdList = a;
    },
    //权限展开
    resouceClick(val){

    },
    //按钮展开
    buttonClick(row){

    },
    //资源权限确认
    resouceSure(){
      console.log(this.resouceIdList)
      let resouceIdList = (this.resouceIdList).toString()
      this.api.eaddresources({roleId:this.rowId,ids:resouceIdList}).then(res => {
        this.$message({
          message: '数据创建成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.formDisabled = true
        this.api.getResourceDetailById(this.rowId).then(res => {
          this.resourcelist = res
          this.dialogLoading = false
        })
        .catch(e => {
          this.dialogLoading = false
        })
      })
    },
    //资源权限取消
    resouceCancel(){
      this.dialogVisible = false
    },
    //按钮权限选择
    buttonChoose(val) {
      // console.log(val)
      var a = [];
      val.forEach((item, index) => {
        a.push(item.id)
        if(item.resources!=[]&&item.resources!=null){
          item.resources.forEach((item, index) => {
            a.push(item.id)
            if(item.resources!=[]&&item.resources!=null){
              item.resources.forEach((item, index) => {
                a.push(item.id)
                if(item.resources!=[]&&item.resources!=null){
                  item.resources.forEach((item, index) => {
                    a.push(item.id)
                    if(item.resources!=[]&&item.resources!=null){
                      item.resources.forEach((item, index) => {
                        a.push(item.id)
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.buttonIdList = a;
    },
    //按钮权限确认
    buttonSure(){
      console.log(this.buttonIdList)
      let buttonIdList = (this.buttonIdList).toString()
      this.api.deniedactionsources({roleId:this.rowId,ids:buttonIdList}).then(res => {
        this.$message({
          message: '数据创建成功',
          type: 'success'
        })
        this.dialogVisible1 = false
        this.api.getResourceDetailById(this.rowId).then(res => {
          this.resourcelist = res
          this.dialogLoading = false
        })
        .catch(e => {
          this.dialogLoading = false
        })
      })
    },
    //按钮权限删除
    buttonCancel(){
      this.dialogVisible1 = false
    }
  }
}
</script>
<style <style lang="scss">
  .el-dialog__body{
    padding: 10px 20px;
    max-height: auto;
  }
  .el-collapse-item__wrap .el-table{
    height:200px !important;
  }
  .el-table__body-wrapper{
    height:auto
  }
  // .el-table__body-wrapper{
  //   height:400px !important;
  // }
</style>


