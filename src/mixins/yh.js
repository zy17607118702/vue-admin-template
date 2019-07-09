import { resolve } from "url";

// 增删改查
export default {
    created() {
        this.init()
    },
    methods: {
        // 初始化操作
        init() {
            // 建立一份表单数据备份用于还原
            if (this.dialogTemp != undefined) {
                this.initDialogTemp = JSON.parse(JSON.stringify(this.dialogTemp))
            }
            if (this.dialogDetailTemp != undefined) {
                this.initDialogDetailTemp = JSON.parse(JSON.stringify(this.dialogDetailTemp))
            }
        },
        // 重置弹出框数据
        resetDialogTemp() {
            if (this.dialogTemp != undefined) {
                this.dialogTemp = JSON.parse(JSON.stringify(this.initDialogTemp))
                this.$nextTick(() => {
                    if (this.$refs['dataForm']) {
                        this.$refs['dataForm'].resetFields()
                    }
                })
            }
        },
        // 重置子表数据
        resetDialogDetailTemp() {
            if (this.dialogDetailTemp != undefined) {
                this.dialogDetailTemp = JSON.parse(JSON.stringify(this.initDialogDetailTemp))
                this.$nextTick(() => {
                    if (this.$refs['detailDataForm']) {
                        this.$refs['detailDataForm'].resetFields()
                    }
                })
            }
        },
        // 表格复选框点击操作
        handleSelection(val) {
            this.selection = val
        },
        // 创建操作
        handleCreate(data = null) {
            this.dialogStatus = 'create'
            this.dialogVisible = true
            this.formDisabled = false
            this.fieldDisabled = false
            this.resetDialogTemp()
            this.resetDialogDetailTemp()
            this.$nextTick(() => {
                if (this.isDoubleColumnPage) {
                    this.isRowEdit = false
                }
                if (this.isTreeTablePage) {
                    if (data.storageType == 0) {
                        this.$set(this.dialogTemp, 'tmBasPlantId', data.id)
                        this.dialogTemp.storageType = '1'
                    } else if (data.storageType == 1) {
                        this.$set(this.dialogTemp, 'tmBasPlantId', data.plantId)
                        this.$set(this.dialogTemp, 'parentStorageId', data.id)
                        this.dialogTemp.storageType = '2'
                    } else if (data.storageType == 2) {
                        this.$set(this.dialogTemp, 'tmBasPlantId', data.plantId)
                        this.$set(this.dialogTemp, 'parentId', data.parentId)
                        this.$set(this.dialogTemp, 'parentStorageId', data.id)
                        this.dialogTemp.storageType = '3'
                    }
                }
            })
        },
        // 查看详情操作
        handleView(row) {
            this.dialogLoading = true
            this.dialogStatus = 'view'
            this.dialogVisible = true
            this.formDisabled = true
            this.api
                .getDetailById(row.id)
                .then(res => {
                    this.dialogTemp = res
                    this.dialogLoading = false
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                })
                .catch(e => {
                    this.dialogLoading = false
                })
        },
        // 修改操作
        handleUpdate(row) {
            this.initWrapRight()
            this.dialogLoading = true
            this.dialogStatus = 'update'
            this.dialogVisible = true
            this.formDisabled = false
            this.fieldDisabled = true
            this.api
                .getDetailById(row.id)
                .then(res => {
                    this.dialogTemp = res
                    this.dialogLoading = false
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                })
                .catch(e => {
                    this.dialogLoading = false
                })
        },
        // 删除操作
        handleDelete() {
            if ((this.selection && this.selection.length) || this.isDoubleColumnPage || this.isTreeTablePage) {
                this.$confirm('是否删除所选数据?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        this.deleteData()
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            } else {
                this.$message({
                    message: '请勾选需要删除的数据',
                    type: 'warning'
                })
            }
        },
        // 弹出框关闭操作
        handleDialogClose() {
            this.dialogVisible = false
            this.formDisabled = false
            this.fieldDisabled = false
        },
        // 表格排序操作
        handleTableSortChange({
            prop,
            order
        }) {
            this.listQuery.sort = {
                prop,
                order
            }
            this.fetchData()
        },
        // 分页显示数量调整操作
        handleSizeChange(limit) {
            this.listQuery.limit = limit
            this.fetchData()
        },
        // 分页跳转操作
        handleCurrentChange(page) {
            this.listQuery.page = page
            this.fetchData()
        },
        // 获取表格数据
        fetchData() {
            // this.initWrapRight()
            this.tableParams.listLoading = true
            this.api
                .getList(this.listQuery)
                .then(response => {
                    this.tableParams.list = response.content
                    this.tableParams.listTotal = response.total
                    this.tableParams.listLoading = false
                })
                .catch(e => {
                    this.listLoading = false
                })
        },
        // 创建数据
        createData() {
            if (this.isDoubleColumnPage && this.isRowEdit) {
                return this.$message({
                    message: '有未完成的行编辑操作',
                    type: 'warning'
                })
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.api.createData(this.dialogTemp).then(res => {
                        this.$message({
                            message: '数据创建成功',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.fetchData()
                    })
                } else {
                    return false
                }
            })
        },
        // 更新数据
        updateData() {
            if (this.isDoubleColumnPage && this.isRowEdit) {
                return this.$message({
                    message: '有未完成的行编辑操作',
                    type: 'warning'
                })
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.api.updateData(this.dialogTemp).then(res => {
                        this.$message({
                            message: '数据更新成功',
                            type: 'success'
                        })
                        this.dialogVisible = false
                        this.fetchData()
                    })
                } else {
                    return false
                }
            })
        },
        // 删除数据
        deleteData() {
            let params
            if (this.isDoubleColumnPage || this.isTreeTablePage) {
                params = this.dialogTemp.id
            } else {
                params = this.selection[0].id
            }
            this.api.deleteById(params).then(res => {
                this.$message({
                    message: '数据删除成功',
                    type: 'success'
                })
                this.fetchData()
            })
        },
        // 子表增删改查
        handleRowCreate() {
            this.dialogDetailStatus = 'create'
            this.resetDialogDetailTemp()
        },
        handleRowUpdate(row) {
            this.rowIndex = this.dialogTemp[this.dialogDetailField].indexOf(row)
            this.dialogDetailStatus = 'update'
            this.dialogDetailTemp = JSON.parse(JSON.stringify(row))
        },
        handleRowDelete() {
            this.deleteRowData()
        },
        createRowData() {
            this.$refs['detailDataForm'].validate(valid => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.dialogDetailTemp))
                    this.dialogTemp[this.dialogDetailField].push(data)
                    this.resetDialogDetailTemp()
                    this.dialogDetailStatus = 'view'
                } else {
                    return false
                }
            })
        },
        updateRowData() {
            this.$refs['detailDataForm'].validate(valid => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.dialogDetailTemp))
                    this.dialogTemp[this.dialogDetailField].splice(this.rowIndex, 1, data)
                    this.resetDialogDetailTemp()
                    this.dialogDetailStatus = 'view'
                } else {
                    return false
                }
            })
        },
        deleteRowData() {
            this.dialogTemp[this.dialogDetailField].splice(this.rowIndex, 1)
            this.resetDialogDetailTemp()
            this.dialogDetailStatus = 'view'
        },
        // 重置右侧内容区域
        initWrapRight() {
            if (this.isDoubleColumnPage) {
                this.resetDialogTemp()
                this.resetDialogDetailTemp()
                this.dialogStatus = 'view'
                this.dialogDetailStatus = 'view'
                this.isShowCreateBtn = false
                this.formDisabled = true
            }
        },

        /*
         * 方法类
         */
        changeStatus(type) {
            if ('view' === type) {
                //改变为查看状态
            } else if ('update' === type) {
                //进入编辑状态
            } else if ('create' === type) {
                //进入创建状态
            } else {
                //进入初始化状态
                this.dialogStatus = 'view'
                this.dialogDetailStatus = 'view'
                this.isShowCreateBtn = false
                this.formDisabled = true

                this.formStatus = {
                    //form表单参数
                    loading: false,
                    formDisabled: true,
                    status: 'view',
                    dialogVisible: false,
                }
                this.detailFormStatus = {

                }
            }
        },
        delay(ms = 300) {
            //延迟操作, 用于表格单双击区分
            return new Promise(resolve => {
                this.clickTimer = setTimeout(resolve, ms)
            })
        },
        getOptions(methods, params, options) {
            // 获取下拉框数据
            this.api[methods](params)
                .then(res => {
                    this.queryData[options] = res
                })
                .catch(err => {
                    this.$message({
                        message: err.message || '获取数据失败',
                        type: 'warning'
                    })
                })
        },
    }
}