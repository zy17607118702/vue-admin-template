<template>
	<div>
		<el-dialog title="导入数据" v-loading="loading" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
			<el-upload drag :action="action" :headers="importHeaders" :on-success="importSuccess" :on-error="importError" :beforeUpload="beforeAvatarUpload" :data="importData" ref="upload" multiple accept=".xlsx,.xls,.doc,.docx" :auto-upload="false" style="text-align:center">
				<i class="el-icon-upload" />
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div slot="tip" class="el-upload__tip">
					<p>只能上传xls/doc文件</p>
					<div>
						<el-checkbox v-model="importParams.chkUpdate">重复时是否导入</el-checkbox>
						<el-checkbox v-for="(item, index) in params" :key="index" v-model="importParams[item.keyName]">{{item.label}}</el-checkbox>
					</div>
				</div>
			</el-upload>
			<span slot="footer" class="dialog-footer">
		        <el-button @click="handleClose">取 消</el-button>
		        <el-button type="primary" @click="importMethod">确 定</el-button>
	      </span>
		</el-dialog>

		<!--成功统计 start-->
		<el-dialog title="提示" :visible.sync="importInfoVisible" width="30%" :before-close="handlePanelClose">
			<div v-for="(item, index) in importMessageData" :key="index">
				<div v-for="(column, ind) in item.content" :key="ind">
					{{column}}
				</div>
				<div><span>成功：{{item.succeedTotal}}</span></div>
				<div><span>失败：{{item.failTotal}}</span></div>
				<div style="margin-bottom: 20px;"><span>总计：{{item.total}}</span></div>
			</div>
			<span slot="footer" class="dialog-footer">
		          <el-button type="primary" @click="handlePanelClose">确 定</el-button>
		      </span>
		</el-dialog>
		<!--成功统计 end-->

	</div>
</template>

<script>
	import { getToken } from '@/utils/auth'
	export default {
		name: "importPanel",
		props: {
			path: {
				//必传
				type: String,
				default: ''
			},
			params: {
				//支持多参数 格式 [{name: xxx, key: xxx}]
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				dialogVisible: true,
				action: '',
				importHeaders: {},
				importData: {},
				importMessage: {},
				importInfoVisible: false,
				loading: false,
				importParams: {
					chkUpdate: false,
				}
			}
		},
		computed: {
			importMessageData() {
				if(!Array.isArray(this.importMessage)) {
					let obj = [this.importMessage]
					return obj
				} else {
					return this.importMessage
				}

			}
		},
		methods: {
			handleClose() {
				this.$emit("input", false);
			},
			importMethod() {
				if(this.$refs.upload.uploadFiles.length > 0) {
					for(let key in this.importParams) {
						if(this.importParams[key]) {
							this.importData[key] = "1"
						} else {
							this.importData[key] = "0"
						}
					}
					this.loading = true
					this.$refs.upload.submit()
				}else{
					this.$message({
						message: '请先上传文件',
						type: 'warning'
					});
				}
			},
			importSuccess(response, file, fileList) {
				//上传成功
				this.loading = false
				this.importMessage = response
				this.dialogVisible = false
				this.importInfoVisible = true
			},
			importError(err) {
				//上传失败
				this.loading = false;
				let msg = "上传失败!请重新检查";
				if(err && err.message) msg = JSON.parse(err.message) ? JSON.parse(err.message)['message'] : "上传失败!请重新检查";
				this.$message({
					message: msg || "上传失败",
					type: "warning"
				});
			},
			beforeAvatarUpload(file) {
				//限制上传文件格式和大小
				//				var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
				//				const extension = testmsg === 'xls'
				//				const extension2 = testmsg === 'xlsx'
				//				const isLt2M = file.size / 1024 / 1024 < 5
				//				if(!extension && !extension2) {
				//					this.$message({
				//						message: '上传文件只能是 xls、xlsx格式!',
				//						type: 'warning'
				//					});
				//				}
				//				if(!isLt2M) {
				//					this.$message({
				//						message: '上传文件大小不能超过 10MB!',
				//						type: 'warning'
				//					});
				//				}
				//				return extension || extension2 && isLt2M
			},
			handlePanelClose() {
				this.importInfoVisible = false
				this.handleClose()
			}
		},
		mounted() {
//									this.action = 'http://10.91.241.232:5555/api/' + this.path
			this.action = process.env.BASE_API + this.path
			this.importHeaders = {
				Authorization: getToken()
			}
		},
		created() {
			if(this.params) {
				this.params.forEach(item => {
					this.$set(this.importParams, item.keyName, false)
				})
			}
		}
	}
</script>

<style>

</style>