
// 增删改查
export default {
    created() {
        this.clickTimer = null
        this.init()
    },
    methods: {
        // 初始化操作
        init() {
            // 复制一份查询条件，用于控制查询状态
            this.filterTemp = this.getFilterTemp()
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
        // 重置字表数据
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
        // 复选框点击操作
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
            })
        },
        // 查看详情操作
        async handleView(row) {
            if (this.isDoubleColumnPage) {
                clearTimeout(this.clickTimer)
                await this.delay()
            }
            this.initWrapRight()
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
                        if (this.$refs['dataForm']) {
                            this.$refs['dataForm'].clearValidate()
                        }
                    })
                })
                .catch(e => {
                    this.dialogLoading = false
                })
        },
        // 修改操作
        handleUpdate(row) {
            clearTimeout(this.clickTimer)
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
                        if (this.$refs['dataForm']) {
                            this.$refs['dataForm'].clearValidate()
                        }
                    })
                })
                .catch(e => {
                    this.dialogLoading = false
                })
        },
        // 删除操作
        async handleDelete() {
            await new Promise((resolve, reject) => {
                if ((this.selection && this.selection.length) || this.isDoubleColumnPage) {
                    this.$confirm('是否删除所选数据?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        .then(async() => {
                            await this.deleteData()
                            resolve()
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
            })
        },
        // 弹出框关闭操作
        handleDialogClose() {
            this.dialogVisible = false
            this.formDisabled = false
            this.fieldDisabled = false
        },
        // 表格排序操作
        handleTableSortChange({ prop, order }) {
            if (prop && order) {
                this.listQuery.sort = [{
                    prop,
                    order
                }]
            } else {
                this.listQuery.sort = null
            }
            this.fetchData(false)
        },
        // 分页显示数量调整操作
        handleSizeChange(limit) {
            this.listQuery.limit = limit
            this.fetchData(false)
        },
        // 分页跳转操作
        handleCurrentChange(page) {
            this.listQuery.page = page
            this.fetchData(false)
        },
        // 获取表格数据
        fetchData(filterStatus = true) {
            this.initWrapRight()
            this.listLoading = true
                // 判断当前查询条件是否改变
            let filterTemp = this.getFilterTemp()
            if (filterStatus) {
                if (JSON.stringify(this.filterTemp) != JSON.stringify(filterTemp)) {
                    this.filterTemp = JSON.parse(JSON.stringify(filterTemp))
                    this.listQuery.page = 1
                }
            } else {
                if (JSON.stringify(this.filterTemp) != JSON.stringify(filterTemp)) {
                    this.listQuery = {...this.listQuery, ...this.filterTemp }
                }
            }
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
        // 创建数据
        async createData() {
            if (this.isDoubleColumnPage && this.isRowEdit) {
                return this.$message({
                    message: '有未完成的行编辑操作',
                    type: 'warning'
                })
            }
            await new Promise((resolve, reject) => {
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        this.api
                            .createData(this.dialogTemp)
                            .then(res => {
                                this.$message({
                                    message: '数据创建成功',
                                    type: 'success'
                                })
                                this.dialogVisible = false
                                this.fetchData()
                                resolve('数据创建成功')
                            })
                            .catch(e => {
                                console.log(e.message)
                            })
                    } else {
                        console.log('表单校验未通过')
                    }
                })
            })
        },
        // 更新数据
        async updateData() {
            if (this.isDoubleColumnPage && this.isRowEdit) {
                return this.$message({
                    message: '有未完成的行编辑操作',
                    type: 'warning'
                })
            }
            await new Promise((resolve, reject) => {
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        this.api
                            .updateData(this.dialogTemp)
                            .then(res => {
                                this.$message({
                                    message: '数据更新成功',
                                    type: 'success'
                                })
                                this.dialogVisible = false
                                this.fetchData()
                                resolve('数据更新成功')
                            })
                            .catch(e => {
                                console.log(e.message)
                            })
                    } else {
                        console.log('表单校验未通过')
                    }
                })
            })
        },
        // 删除数据
        async deleteData() {
            let params
            if (this.isMultiDelete) {
                params = []
                this.selection.forEach(item => params.push(item.id))
            } else {
                params = this.isDoubleColumnPage ? this.dialogTemp.id : this.selection[0].id
            }
            await this.api
                .deleteById(params)
                .then(res => {
                    this.$message({
                        message: '数据删除成功',
                        type: 'success'
                    })
                    this.fetchData()
                })
                .catch(e => {
                    console.log(e.message)
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
        // 延时执行
        delay(interval = 250) {
            return new Promise(resolve => (this.clickTimer = setTimeout(resolve, interval)))
        },
        // 获取查询条件
        getFilterTemp() {
            let filterTemp = JSON.parse(JSON.stringify(this.listQuery))
            delete filterTemp.limit
            delete filterTemp.page
            delete filterTemp.sort
            return filterTemp
        },
        //导出
        export (tableName) {
            let et = this.$XLSX.utils.table_to_book(document.querySelector(tableName),{raw:true}); //此处传入table的DOM节点
            console.log(et)
            let etout = this.$XLSX.write(et, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            });
            try {
              this.$FileSaver.saveAs(new Blob([etout], {
                    type: 'application/octet-stream'
                }), 'trade-publish.xlsx'); //trade-publish.xlsx 为导出的文件名
            } catch (e) {
                console.log(e, etout);
            }
            return etout;
        }
    }
}
