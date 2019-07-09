<template>
	<!-- 用户信息 -->
	<div class="app-container">
		<div class="app-search-container" style="height:70px">
			<div class="action-title">查询</div>
			<div class="new-search-container">
				<div class="item-container">
					<div class="item">
						<span class="item-title">用户登录名</span>
						<div class="item-body">
							<el-input v-model="listQuery.username" size="mini" placeholder="请输入" />
						</div>
					</div>
					<div class="item">
						<span class="item-title">用户姓名</span>
						<div class="item-body">
							<el-input v-model="listQuery.realName" size="mini" placeholder="请输入" />
						</div>
					</div>
					<div class="item">
						<span class="item-title">状态</span>
						<div class="item-body">
							<el-select v-model="listQuery.state" clearable placeholder="请选择" size="mini">
								<el-option v-for="(option, index) in stateOptions" :key="index" :label="`${option.name}`" :value="option.code" />
							</el-select>
						</div>
					</div>
					<div class="item-button">
						<el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
						<el-button size="mini" icon="el-icon-circle-close" @click="handleReset">重置</el-button>
						<el-button id="high-search-button" size="mini">高级查询</el-button>
					</div>
				</div>
				<div id="high-search-container" class="high-search-container">
					<div class="item-container">
						<div class="item">
							<span class="item-title">移动电话</span>
							<div class="item-body">
								<el-input v-model="listQuery.mobilePhone" size="mini" placeholder="请输入" />
							</div>
						</div>
						<div class="item">
							<span class="item-title">邮箱地址</span>
							<div class="item-body">
								<el-input v-model="listQuery.email" size="mini" placeholder="请输入" />
							</div>
						</div>
						<div class="item">
							<span class="item-title">SAP对应用户名</span>
							<div class="item-body">
								<el-input v-model="listQuery.sapUsername" size="mini" placeholder="请输入" />
							</div>
						</div>
						<div class="item">
							<span class="item-title">办公号码</span>
							<div class="item-body">
								<el-input v-model="listQuery.telephone" size="mini" placeholder="请输入" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="divider" />
		</div>
		<div class="app-wrap-container" style="height:calc(100% - 70px)">
			<div class="wrap-left" :class="{ expandWrapLeft: isShrinkRight }">
				<div class="table-container">
					<el-table v-loading="listLoading" :data="list" height="auto" element-loading-text="正在加载中..." fix stripe border highlight-current-row @sort-change="handleTableSortChange" @row-click="handleView">
						<el-table-column label="用户登录名" prop="username" min-width="100" header-align="center" sortable="custom" />
						<el-table-column label="所属域" prop="domainName" min-width="150" header-align="center" sortable="custom" />
						<el-table-column label="用户类型" prop="userType" min-width="100" header-align="center" sortable="custom">
							<template slot-scope="scope">
								<span v-if="scope.row.userType==10000">本地用户</span>
								<span v-else-if="scope.row.userType==20000">域用户</span>
								<span v-else>{{scope.row.userType}}</span>
							</template>
						</el-table-column>
						<el-table-column label="用户姓名" prop="realName" min-width="100" header-align="center" sortable="custom" />
						<el-table-column label="办公号码" prop="telephone" min-width="120" header-align="center" sortable="custom" />
						<el-table-column label="邮箱地址" prop="email" min-width="120" header-align="center" sortable="custom" />
						<el-table-column label="移动号码" prop="mobilePhone" min-width="100" header-align="center" sortable="custom" />
						<el-table-column label="状态" prop="state" min-width="100" header-align="center" sortable="custom">
							<template slot-scope="scope">
								<span v-if="scope.row.state">{{getNameByCode(scope.row.state)}}</span>
							</template>
						</el-table-column>
						<el-table-column label="最近登录" prop="lastlogintime" min-width="100" header-align="center" sortable="custom" />
						<el-table-column label="客户端版本号" prop="clientversion" min-width="100" header-align="center" sortable="custom" />
					</el-table>
				</div>
				<div class="footer-container">
					<div class="pagination-center">
						<el-pagination :current-page="listQuery.page" :page-sizes="[20, 50, 100, 200]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :page-count="5" :total="listTotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
					</div>
				</div>
			</div>
			<div class="wrap-right" :class="{ shrinkWrapRight: isShrinkRight }">
				<div class="wrap-title" @click="isShrinkRight = true">
					<div class="left">详细信息</div>
					<div class="right"><i class="el-icon-arrow-right" /></div>
				</div>
				<div class="wrap-content">
					<el-collapse v-model="activeNames">
						<el-collapse-item title="基础信息" name="1">
							<el-form ref="dataForm" v-loading="dialogLoading" element-loading-text="数据加载中..." :model="dialogTemp" :disabled="formDisabled" :rules="rules" label-position="left" label-width="200px" size="mini">
								<el-form-item label="用户登录名" prop="username">
									<el-input v-model.trim="dialogTemp.username" />
								</el-form-item>
								<el-form-item label="用户姓名" prop="realName">
									<el-input v-model.trim="dialogTemp.realName" />
								</el-form-item>
								<el-form-item label="所属域" prop="domainName">
									<el-input v-model.trim="dialogTemp.domainName" />
								</el-form-item>
								<el-form-item label="用户类型" prop="userType">
									<el-select v-model="dialogTemp.userType" clearable placeholder="请选择" size="mini">
										<el-option v-for="(option, index) in userTypeOptions" :key="index" :label="`${option.name}`" :value="option.code" />
									</el-select>
								</el-form-item>
								<el-form-item label="办公号码" prop="telephone">
									<el-input v-model="dialogTemp.telephone" />
								</el-form-item>
								<el-form-item label="邮件地址" prop="email">
									<el-input v-model="dialogTemp.email" />
								</el-form-item>
								<el-form-item label="移动电话" prop="mobilePhone">
									<el-input v-model="dialogTemp.mobilePhone" />
								</el-form-item>
								<el-form-item label="用户描述" prop="description">
									<el-input v-model="dialogTemp.description" />
								</el-form-item>
								<el-form-item label="状态" prop="state">
									<el-select v-model="dialogTemp.state" clearable placeholder="请选择" size="mini">
										<el-option v-for="(option, index) in stateOptions" :key="index" :label="`${option.name}`" :value="option.code" />
									</el-select>
								</el-form-item>
							</el-form>
						</el-collapse-item>
						<el-collapse-item title="所属角色" name="2">
							<el-table v-loading="listLoading" :data="dialogTemp.sysRoles" height="500" element-loading-text="正在加载中..." fix stripe border highlight-current-row>
								<el-table-column label="角色名称" prop="name" min-width="100" align="center">
									<template slot-scope="{ row }">
										<span>{{ row.name }}</span>
									</template>
								</el-table-column>
								<el-table-column label="角色描述" prop="description" min-width="100" align="center">
									<template slot-scope="{ row }">
										<span>{{ row.description }}</span>
									</template>
								</el-table-column>
							</el-table>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
			<div v-show="isShrinkRight" class="expandWrapRight">
				<i class="el-icon-arrow-left" @click="isShrinkRight = false" />
			</div>
		</div>
	</div>
</template>

<script>
	import userApi from '@/api/system/user'
	import highSearchButton from '@/mixins/highSearchButton'
	import curd from '@/mixins/curd'

	export default {
		name: 'user',
		mixins: [curd, highSearchButton],
		data() {
			return {
				api: userApi,
				isShrinkRight: false,
				activeNames: ['1', '2'],
				isDoubleColumnPage: true,
				listQuery: {
					limit: 20,
					page: 1,
					sort: null,
					username: '',
					realName: '',
					state: '',
					mobilePhone: '',
					email: '',
					sapUsername: '',
					telephone: ''
				},
				rowSelection: [],
				list: [],
				listTotal: 0,
				isHighSearch: false,
				listLoading: false,
				formDisabled: true,
				fieldDisabled: false,
				stateOptions: [],
				userTypeOptions: [{
						code: "20000",
						name: '域用户'
					},
					{
						code: "10000",
						name: '本地用户'
					}
				],
				textMap: {
					view: '查看详情',
					create: '创建',
					update: '更新'
				},
				dialogVisible: false,
				dialogStatus: 'view',
				dialogLoading: false,
				formDisabled: false,
				dialogTemp: {
					username: '',
					realName: '',
					domainName: '',
					userType: '',
					state: '',
					telephone: '',
					email: '',
					mobilePhone: '',
					description: '',
					sysRoles: []
				},
				rules: {
					tmBasPlantId: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					rackType: [{
						required: true,
						message: '请输入',
						trigger: 'change'
					}],
					rackTypeDescC: [{
						required: true,
						message: '请输入',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			this.getStateOptions()
		},
		computed: {
			// 设置高级查询按钮图标
			highSearchIcon() {
				let icon = this.isHighSearch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
				return icon
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
					username: '',
					realName: '',
					state: '',
					mobilePhone: '',
					email: '',
					sapUsername: '',
					telephone: ''
				}
			},
			getStateOptions() {
				userApi.getStateOptions().then(res => {
					this.stateOptions = res
				})
			},
			getNameByCode(val) {
				let item = this.stateOptions.filter(item => item.code == val)
				if(item.length > 0) {
					return item[0].name
				}
				return val
			}
		}
	}
</script>