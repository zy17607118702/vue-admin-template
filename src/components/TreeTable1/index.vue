<template>
  <el-table
    ref="treeTable"
    :data="formatData"
    :row-style="showRow"
    v-bind="$attrs"
    height="300px"
    fit
    stripe
    border
    highlight-current-row
    v-on="$listeners"
  >
    <slot name="before" />
    <el-table-column type="selection" width="45"/>
    <el-table-column header-align="center" :label="expandProps.name" min-width="200">
      <template slot-scope="scope">
        <div style="cursor:pointer;" @click="toggleExpanded(scope.row, scope.$index)">
          <span v-for="(item, index) in scope.row.level" :key="index" class="ms-tree-space" />
          <span v-if="iconShow(scope.row)" class="tree-ctrl">
            <i v-if="scope.row.expanded" class="el-icon-caret-bottom" />
            <i v-else class="el-icon-caret-right" />
            <i class="el-icon-menu" />
          </span>
          <span v-else class="tree-ctrl"><i class="el-icon-document" /></span>
          {{ mapTypes[scope.row[expandProps.value]] }}
        </div>
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
export default {
  name: 'TreeTable',
  inject: ['app'],
  props: {
    // 从接口获取的list数据
    data: {
      type: [Array, Object],
      required: true
    },
    // 是否是底层叶子节点的属性名
    leafFlag: {
      type: String,
      default: 'leaf'
    },
    // 展开项的中文名称和字段名
    expandProps: {
      type: Object,
      required: true
    },
    // 根据展开项的字段名匹配中文名称
    mapTypes: {
      type: Object,
      default: null
    },
    // 是否展开时异步获取数据
    isAsyncExpand1: {
      type: Boolean,
      default: true
    },
    // 是否在初始化时已获取到所有数据
    isInitAll: {
      type: Boolean,
      default: false
    },
    // 是否展开所有项
    isExpandAll1: {
      type: Boolean,
      default: false
    }
  },
  mounted(){
    // setTimeout(()=>{
    //   //isNegative
    //   console.log(this.formatData)
    //   this.formatData.forEach((item, index) => {
    //     if(item.isNegative){
    //       this.$refs.treeTable.toggleRowSelection(this.formatData[index],true)
    //     }
    //   })
    // },500)
  },
  computed: {
    formatData() {
      this.addParent(this.data)
      let temp = []
      if (this.isExpandAll || this.isInitAll) {
        temp = this.flattenData(this.data)
        return temp
      } else {
        return Object.assign([], this.data)
      }
    }
  },
  methods: {
    flattenData(data) {
      console.log('1')
      let arr = []
      function Iterator(data) {
        data.forEach((item, index) => {
          arr.push(item)
          if (item.hasOwnProperty('resources') && Array.isArray(item.resources) && item.resources.length > 0) {
            Iterator(item.resources)
          }
        })
      }
      Iterator(data)
      setTimeout(()=>{
        //isNegative
        console.log(this.formatData)
        this.formatData.forEach((item, index) => {
          if(item.isNegative){
            this.$refs.treeTable.toggleRowSelection(this.formatData[index],true)
          }
        })
      },0)
      return arr
    },
    addParent(data, parent = null) {
      data.forEach((item, index) => {
        this.$set(item, 'expanded', this.isExpandAll)
        if (parent) {
          item.parent = parent
          item.level = parent.level + 1
        } else {
          item.level = 1
        }
        if (item.resources && item.resources.length) {
          this.addParent(item.resources, item)
        }
      })
    },
    showRow({ row }) {
      const show = row.parent ? row.parent.expanded && row.parent.show : true
      row.show = show
      return show ? '' : 'display:none;'
    },
    // 切换下级是否展开
    async toggleExpanded(row, index) {
      if (!row[this.leafFlag]) {
        row.expanded = !row.expanded
        if (row.resources && row.resources.length > 0) {
          return this.$nextTick(() => {
            this.$refs.treeTable.doLayout()
          })
        }
        let expandRowData = await this.app.handleExpandRow(row)
        this.addParent(expandRowData, row)
        row.resources = expandRowData
        this.formatData.splice(index + 1, 0, ...row.resources)
        this.$nextTick(() => {
          this.$refs.treeTable.doLayout()
        })
      }
    },
    // 图标显示
    iconShow(row) {
      return !row[this.leafFlag]
    }
  }
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: '';
  }
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
