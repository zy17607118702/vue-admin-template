<template>
  <el-dialog title="导出数据" :visible.sync="dialogVisible" width="770px" :before-close="handleClose">
    <el-table class="export-table" v-loading="exportParams.listLoading" :data="exportParams.list" width="100%"
      height="60%" element-loading-text="正在加载中..." fix stripe border highlight-current-row>
      <template v-for="(item, index) in tableColumns">
        <el-table-column :key="index" v-if="item.tableShow" :label="item.label" :prop="item.prop" min-width="120"
          header-align="center">
          <template slot-scope="scope">
            <span v-if="item.columnType || item.columnCb">
              {{item.columnCb(scope.row)}}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="exportDataMethod">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    name: "exportPanel",
    props: {
      tableColumns: {
        //遍历生成表格列
        type: Array,
        default: []
      },
      exportData: {
        type: Array,
        dafault: []
      },
      fileName: {
        type: String,
        dafault: 'iMesExport'
      }
    },
    data() {
      return {
        dialogVisible: true,
        exportParams: {
          laoding: false,
          list: this.exportData
        }
      };
    },
    methods: {
      handleClose() {
        this.$emit("input", false);
      },
      exportDataMethod() {
        //导出
        let et = XLSX.utils.table_to_book(document.querySelector('.export-table'), {
          raw: true
        }); //此处传入table的DOM节点
        let etout = XLSX.write(et, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array',
          ignoreEC: false
        });
        try {
          FileSaver.saveAs(new Blob([etout], {
            type: 'application/octet-stream'
          }), this.fileName + '.xlsx'); //导出的文件名
        } catch (e) {
          console.log(e, etout);
        }
        this.handleClose()
        return etout;
      }
    },
    mounted() {

    }
  };

</script>

<style scoped>

</style>
