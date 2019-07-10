// 增删改查

export default {
	created() {
		// 初始化表单对象
		this.initFormObj();
		this.clickTimer = null; //定时器, 用于区分表格单击双击事件触发重叠
		this.init();
	},
	methods: {
		// 初始化操作
		init() {
			// 复制一份查询条件，用于控制查询状态
			this.filterTemp = this.getFilterTemp();

			// 建立一份表单数据备份用于还原
			if(this.dialogTemp != undefined) {
				this.initDialogTemp = JSON.parse(JSON.stringify(this.dialogTemp));
			}
			if(this.dialogDetailTemp != undefined) {
				this.initDialogDetailTemp = JSON.parse(JSON.stringify(this.dialogDetailTemp));
			}
		},
		initFormObj() {
			//初始化主表表单和字表表单对象
			if(this.dialogTemp) {
				let arr = Object.keys(this.dialogTemp);
				if(arr.length == 0) {
					// 初始化主表表单对象
					for(let item of this.tableColumns) {
						//方法修改 即时id不显示也会映射到dialogTemp中
						if(item.model == 'id') {
							this.$set(this.dialogTemp, item.model, '')
						} else if(item.formShow) {
							this.$set(this.dialogTemp, item.model, '')
						}
					}
				}
			}
			if(this.dialogDetailTemp) {
				let arrDetail = Object.keys(this.dialogDetailTemp);
				if(arrDetail.length == 0) {
					// 初始化子表表单对象
					for(let item of this.detailTableColumns) {
						if(item.formShow) {
							this.$set(this.dialogDetailTemp, item.model, '')
						}
					}
				}
			}
		},
		resetDialogTemp() {
			// 重置弹出框数据
			if(this.dialogTemp != undefined) {
				this.dialogTemp = JSON.parse(JSON.stringify(this.initDialogTemp));
				this.$nextTick(() => {
					if(this.$refs["dataForm"]) {
						this.$refs["dataForm"].clearValidate();
					}
				});
			}
		},
		resetDialogDetailTemp() {
			// 重置子表数据
			if(this.dialogDetailTemp != undefined) {
				this.dialogDetailTemp = JSON.parse(JSON.stringify(this.initDialogDetailTemp));
				this.$nextTick(() => {
					if(this.$refs["detailDataForm"]) {
						this.$refs["detailDataForm"].clearValidate();
					}
				});
			}
		},
		handleSelection(val) {
			// 表格复选框点击操作
			this.selection = val;
		},
		handleCreate() {
			// 创建操作
			this.changeStatus("create");
			this.overFormLoading();
		},
		async handleView(row) {
			// 查看详情操作
			clearTimeout(this.clickTimer);
			await this.delay();
			this.changeStatus("view");
			this.api
				.getDetailById(row.id)
				.then(res => {
					this.mergeTemp(res);
					this.overFormLoading();
				})
				.catch(err => {
					this.overFormLoading();
				});
		},
		handleUpdate(row) {
			// 修改操作
			clearTimeout(this.clickTimer);
			this.changeStatus("update");
			this.api
				.getDetailById(row.id)
				.then(res => {
					this.mergeTemp(res);
					this.overFormLoading();
					this.$nextTick(() => {
						if(this.$refs["dataForm"]) {
							this.$refs["dataForm"].clearValidate();
						}
					});
				})
				.catch(err => {
					this.overFormLoading();
				});
		},
		// 复选框点击操作
		handleSelectionChange(val) {
			this.selection = val;
		},
		handleExportTem(path) {
			//导出模板
			if(path) {
				//	      		window.location.href = 'http://10.91.241.138:5555/api' + path 
				window.location.href = process.env.BASE_API + path
			}
		},
		handleExportByQuery() {
			this.api.exportByQuery(this.listQuery).then(res => {
				console.log(res)
				var blob = new Blob([res], {
					type: "application/vnd.ms-excel"
				});

				if(window.navigator.msSaveOrOpenBlob) { //msSaveOrOpenBlob方法返回bool值
					navigator.msSaveBlob(blob, fileName); //本地保存
				} else {
					var link = document.createElement('a'); //a标签下载
					link.href = window.URL.createObjectURL(blob);
					link.download = 'shopCalendar.xlsx';
					link.click();
					window.URL.revokeObjectURL(link.href);
				}
			}).catch(err => {
				console.log(err)
			});
		},
		handleImport() {
			//导入操作
			if(this.dialogParams) {
				this.dialogParams.importStatus = true
			}
		},
		handleExport() {
			//导出操作
			if(this.dialogParams) {
				this.dialogParams.exportStatus = true
			}
		},
		handleDetailExport() {
			//导出子表操作
			if(this.dialogParams) {
				this.dialogParams.exportDetailStatus = true
			}
		},
		handlePrint() {
			//打印操作
		},
		handleDelete() {
			if(this.selection && this.selection.length > 0) {
				this.$confirm("是否删除所选数据?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.deleteData();
				}).catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
			} else {
				this.$message({
					message: "请勾选需要删除的数据",
					type: "warning"
				});
			}
		},
		// 弹出框关闭操作
		handleDialogClose() {
			this.changeStatus();
		},
		// 表格排序操作
		handleTableSortChange({
			prop,
			order
		}) {
			if(prop && order) {
				this.listQuery.sort = [{
					prop,
					order
				}];
			} else {
				this.listQuery.sort = null;
			}
			this.fetchData(false);
		},
		// 分页显示数量调整操作
		handleSizeChange(limit) {
			this.listQuery.limit = limit;
			this.fetchData(false);
		},
		// 分页跳转操作
		handleCurrentChange(page) {
			this.listQuery.page = page;
			this.fetchData(false);
		},
		// 获取表格数据
		fetchData(filterStatus = true) {
			this.tableParams.listLoading = true;
			// if (filterStatus) {
			//     //如果传值为true 则将记录当前搜索 filterTemp并且进行搜索
			//     this.filterTemp = this.getFilterTemp()
			// } else {
			//     //如果为false, 则返回到上次搜索数据并搜索
			//     let filterTemp = this.getFilterTemp()
			//     if (JSON.stringify(this.filterTemp) != JSON.stringify(filterTemp)) {
			//         Object.assign(this.listQuery, this.filterTemp)
			//     }
			// }
			this.api
				.getList(this.listQuery)
				.then(response => {
					this.tableParams.list = response.content;
					this.tableParams.listTotal = response.total;
					this.tableParams.listLoading = false;
				})
				.catch(e => {
					this.tableParams.listLoading = false;
				});
		},
		// 创建数据
		createData() {
			this.$refs["dataForm"].validate(valid => {
				if(valid) {
					let params = JSON.parse(JSON.stringify(this.dialogTemp));
					this.api.createData(params).then(res => {
						this.$message({
							message: "数据创建成功",
							type: "success"
						});
						this.handleFilter();
					});
				} else {
					return false;
				}
			});
		},
		updateData() {
			// 更新数据
			this.$refs["dataForm"].validate(valid => {
				if(valid) {
					let params = JSON.parse(JSON.stringify(this.dialogTemp));
					this.api.updateData(params).then(res => {
						this.$message({
							message: "数据更新成功",
							type: "success"
						});
						this.handleFilter();
					});
				} else {
					return false;
				}
			});
		},
		createDialogData() {
			//创建数据
			let params = JSON.parse(JSON.stringify(this.dialogTemp));
			this.api.createData(params).then(res => {
				this.$message({
					message: "数据创建成功",
					type: "success"
				})
				this.handleFilter();
				if(this.formParams) this.formParams.dialogVisible = false;
			});
		},
		updateDialogData() {
			//更新数据
			let params = JSON.parse(JSON.stringify(this.dialogTemp));
			this.api.updateData(params).then(res => {
				this.$message({
					message: "数据更新成功",
					type: "success"
				});
				this.handleFilter();
				if(this.formParams) this.formParams.dialogVisible = false;
			});
		},
		// 删除数据
		deleteData(key = 'id') {
			let params = [];
			this.selection.forEach(item => {
				params.push(item[key])
			})
			this.api.deleteById(params).then(res => {
				this.$message({
					message: "数据删除成功",
					type: "success"
				});
				this.fetchData(false);
			});
		},
		/*
		 *子表操作
		 */
		changeRowStatus(type) {
			//改编子表状态
			if("view" === type) {
				//改变为查看状态
				this.detailFormParams = {
					status: "view"
				};
			} else if("update" === type) {
				//进入编辑状态
				this.detailFormParams = {
					status: "update"
				};

			} else if("create" === type) {
				//进入创建状态
				this.detailFormParams = {
					status: "create"
				};
			} else {
				//进入初始化状态
				this.detailFormParams = {
					status: "view"
				};
			}
			this.resetDialogDetailTemp();
		},
		handleRowCreate() {
			//添加数据
			this.changeRowStatus("create");
		},
		async handleRowView(row) {
			//查看数据
			clearTimeout(this.clickTimer);
			await this.delay();
			this.$nextTick(() => {
				if(this.formParams.status == "update" || this.formParams.status == "create") {
					this.changeRowStatus("view");
				}
				this.detailFormParams.rowIndex = this.tableDetailParams.list.indexOf(row);
				this.mergeRowTemp(row)
			});
		},
		handleRowUpdate(row) {
			//更新数据
			clearTimeout(this.clickTimer);
			this.$nextTick(() => {
				if(this.formParams.status == "update" || this.formParams.status == "create") {
					this.changeRowStatus("update");
				}
				this.detailFormParams.rowIndex = this.tableDetailParams.list.indexOf(row);
				this.mergeRowTemp(row)
			});
		},
		handleRowDelete() {
			//删除数据
			this.deleteRowData();
		},
		createRowData() {
			this.$refs["detailDataForm"].validate(valid => {
				if(valid) {
					let data = JSON.parse(JSON.stringify(this.dialogDetailTemp));
					this.tableDetailParams.list.push(data);
					this.changeRowStatus();
				} else {
					return false;
				}
			});
		},
		updateRowData() {
			this.$refs["detailDataForm"].validate(valid => {
				if(valid) {
					let data = JSON.parse(JSON.stringify(this.dialogDetailTemp));
					this.tableDetailParams.list.splice(this.detailFormParams.rowIndex, 1, data);
					this.changeRowStatus();
				} else {
					return false;
				}
			});
		},
		deleteRowData() {
			this.tableDetailParams.list.splice(this.detailFormParams.rowIndex, 1);
			this.changeRowStatus();
		},

		/*
		 * 方法类
		 */
		changeStatus(type) {
			if("view" === type) {
				//改变为查看状态
				this.formParams = {
					//form表单参数
					loading: true,
					formDisabled: true,
					status: "view",
					dialogVisible: true
				};
			} else if("update" === type) {
				//进入编辑状态
				this.formParams = {
					//form表单参数
					loading: true,
					formDisabled: false,
					status: "update",
					dialogVisible: true
				};

			} else if("create" === type) {
				//进入创建状态
				this.formParams = {
					//form表单参数
					loading: true,
					formDisabled: false,
					status: "create",
					dialogVisible: true
				};
			} else {
				//进入初始化状态
				this.formParams = {
					//form表单参数
					loading: false,
					formDisabled: true,
					status: "view",
					dialogVisible: false
				};
			}

			this.resetDialogTemp();
			this.changeRowStatus();
			this.initDetailTable();
		},
		overFormLoading() {
			this.formParams.loading = false;
		},
		delay(ms = 300) {
			//延迟操作, 用于表格单双击区分
			return new Promise(resolve => {
				this.clickTimer = setTimeout(resolve, ms);
			});
		},
		initDetailTable() {
			//初始化详细表格
			if(this.tableDetailParams) {
				this.tableDetailParams = {
					list: [],
					listTotal: 0,
					listLoading: false
				};
			}
		},
		getOptions(methods, params, options, p1 = "queryData", p2, p3 = "false") {
			// 获取下拉框数据
			if(methods && this.api[methods]) {
				this.api[methods](params)
					.then(res => {
						if(p3 == "true") {
							let options = Array.from(res);
							let code = options.filter(item => item.markStatus == true)
							res = code;
						}
						if(p1 && (this[p1] && this[p1][options])) {
							this[p1][options] = res;
						}
						if(p2 && (this[p2] && this[p2][options])) {
							this[p2][options] = res;
						}
					})
					.catch(err => {
						this.$message({
							message: err.message || "获取数据失败",
							type: "warning"
						});
					});
			}
		},
		getManyOptions(methods, params, options = [], p1 = "queryData", p2, p3 = "false") {
			// 获取下拉框数据
			if(methods && this.api[methods]) {
				this.api[methods](params)
					.then(res => {
						if(p1 && this[p1]) {
							options.forEach(item => {
								this[p1][options] = res;
							})
						}
						if(p2 && this[p2]) {
							options.forEach(item => {
								this[p2][options] = res;
							})
						}
					})
					.catch(err => {
						this.$message({
							message: err.message || "获取数据失败",
							type: "warning"
						});
					});
			}
		},
		getFormParamas(queryString = "", type) {
			if(type == 'plant') {
				return {
					q: queryString,
					plantId: this.dialogTemp.tmBasPlantId
				}
			} else if(type == 'workshop') {
				return {
					q: queryString,
					workshopId: this.dialogTemp.tmBasWorkshopId
				}
			} else {
				return {
					q: queryString,
					plantId: this.dialogTemp.tmBasPlantId,
					workshopId: this.dialogTemp.tmBasWorkshopId
				}
			}
		},
		getFilterTemp() {
			// 获取查询条件
			let filterTemp = JSON.parse(JSON.stringify(this.listQuery));
			delete filterTemp.limit;
			delete filterTemp.page;
			delete filterTemp.sort;
			return filterTemp;
		}
	}
};