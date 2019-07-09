<template>
	<div :class="classObj" class="app-wrapper">
		<!--头部 start-->
		<header>
			<div class="left-menu">
				<svg-icon icon-class="favicon.ico" />
				<!--<span class="title"><img src="../../../favicon.ico"  style="margin-top:10px"/></span> -->
			</div>
			<div class="right-menu">
				<span class="title">{{baseName}}</span>
				<div class="divider" />
				<div class="title drop-button">
					<svg-icon icon-class="user" /> {{userName}}
					<div class="drop-menu">
						<span><svg-icon class="svgActive" icon-class="icon-zhongyingwen" />切换英文</span>
						<span><svg-icon icon-class="icon-wodexiaoxi" />我的消息</span>
						<span @click="handlePassOpen"><svg-icon icon-class="icon-xiugaimima" />修改密码</span>
						<span @click="logOut"><svg-icon icon-class="icon-tuichudenglu" />退出登录</span>
					</div>
				</div>
			</div>
		</header>
		<!--头部 end-->

		<div class="layout">
			<sidebar class="sidebar-container" />
			<div id="main-container" class="main-container">
				<!--tab 右键点击出现小功能-->
				<tags-view />
				<app-main />
			</div>
		</div>

		<!--修改密码 start-->
		<el-dialog title="修改密码" :visible.sync="passwordParams.passWordStatusDialog" center width="500px" :before-close="handlePasslClose">
			<el-form class="password-panel" ref="pWdForm" :model="passwordForm" label-position="left" label-width="80px" size="mini">
				<el-form-item class="password-panel-item" label="原密码" :prop="passwordForm.oldPassword" :rules="rules.inputRules">
					<el-input type="password" v-model.trim="passwordForm.oldPassword" placeholder="请输入" size="mini"></el-input>
				</el-form-item>

				<el-form-item class="password-panel-item" label="新密码" :prop="passwordForm.newPassword" :rules="rules.inputRules">
					<el-input type="password" v-model.trim="passwordForm.newPassword" placeholder="请输入" size="mini"></el-input>
				</el-form-item>

				<el-form-item class="password-panel-item" label="重复密码" :prop="passwordForm.confirmPassword" :rules="rules.inputRules">
					<el-input type="password" v-model.trim="passwordForm.confirmPassword" placeholder="请输入" size="mini"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer" align="center">
				<el-button type="primary" @click="updatepwd">确定</el-button>
				<el-button @click="handlePasslClose">关闭</el-button>
			</div>
		</el-dialog>
		<!--修改密码 end-->

	</div>
</template>

<script>
	import { Sidebar, AppMain, TagsView } from './components'
	import layoutApi from '@/api/layout'

	export default {
		name: 'Layout',
		data() {
			return {
				userName: '',
				passwordParams: {
					passWordStatusDialog: false,
					loading: false,
					formDisabled: false
				},
				passwordForm: {
					oldPassword: "",
					newPassword: "",
					confirmPassword: "",
				},
				rules: {
					inputRules: [{
						//输入必填校验
						required: true,
						message: "",
						trigger: "submit"
					}],
				},

			}
		},
		components: {
			Sidebar,
			AppMain,
			TagsView
		},
		computed: {
			baseName() {
				return this.$store.state.baseName
			},
			sidebar() {
				return this.$store.state.app.sidebar
			},
			device() {
				return this.$store.state.app.device
			},
			classObj() {
				return {
					hideSidebar: !this.sidebar.opened,
					openSidebar: this.sidebar.opened,
					withoutAnimation: this.sidebar.withoutAnimation,
					mobile: this.device === 'mobile'
				}
			}
		},
		created() {
			this.userName = localStorage.getItem("userName")
		},
		methods: {
			logOut() {
				// global.userName = ''
				this.$store.dispatch('FedLogOut').then(() => {
					this.$router.push({
						path: '/login'
					})
					// 为了重新实例化vue-router对象 避免bug
					location.reload()
				})
			},
			updatepwd() {
				if(this.passwordForm.oldPassword && this.passwordForm.newPassword && this.passwordForm.confirmPassword) {
					if(this.passwordForm.newPassword == this.passwordForm.confirmPassword) {
						layoutApi.updatepwd(this.passwordForm).then(res => {
							if(res.error == 1) {
								return this.$message.error(res.message ? res.message : '修改失败');
							}
							
							this.$message({
								message: res.message || '修改成功',
								type: 'success'
							});
							this.logOut();
						}).catch(err => {
							this.$message({
								message: err || '修改失败',
								type: 'warning'
							});
						})
					} else {
						this.$message({
							message: '请保持两次输入密码一致',
							type: 'warning'
						});
					}
				} else {
					if(!this.passwordForm.oldPassword) {
						this.$message({
							message: '请输入原密码',
							type: 'warning'
						});
					} else if(!this.passwordForm.newPassword) {
						this.$message({
							message: '请输入新密码',
							type: 'warning'
						});
					} else if(!this.passwordForm.confirmPassword) {
						this.$message({
							message: '请输入重复密码',
							type: 'warning'
						});
					} else {
						this.$message({
							message: '请输入',
							type: 'warning'
						});
					}
				}
			},
			handlePasslClose() {
				this.passwordParams.passWordStatusDialog = false;
			},
			handlePassOpen() {
				this.passwordParams.passWordStatusDialog = true;
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import 'src/styles/mixin.scss';
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;
		&.mobile.openSidebar {
			position: fixed;
			top: 0;
		}
	}
	
	.drawer-bg {
		background: #000;
		opacity: 0.3;
		width: 100%;
		top: 0;
		height: 100%;
		position: absolute;
		z-index: 999;
	}
	
	header {
		position: relative;
		width: 100%;
		height: 50px;
		// background: #282a3b;//4.30上线颜色变更
		background: #8e9290;
		.left-menu {
			display: flex;
			align-items: center;
			height: 100%;
			line-height: 50px;
			color: #fff;
			padding-left: 35px; //zjl
			svg {
				width: 110px;
				height: 50px;
				margin-right: 35px; //zjl  10px
			}
			.title {
				margin-left: 5px;
				height: 100%;
				font-size: 18px; //zjl 20px 16px
			}
		}
		.right-menu {
			position: absolute;
			top: 0;
			right: 0;
			height: 100%;
			display: flex;
			align-items: center;
			height: 100%;
			line-height: 50px;
			.divider {
				height: 20px;
				width: 1px;
				background: #e6e6e6;
				margin: 0px; //zjl 10px
			}
			.title {
				height: 100%;
				color: #fff;
				padding: 0 20px; //zjl 0 10px;
				font-size: 14px;
				svg {
					width: 18px;
					margin-right: 5px;
					height: 18px;
				}
			}
			.drop-button {
				font-size: 13px; //zjl add
				position: relative;
				display: flex;
				align-items: center;
				.drop-menu {
					position: absolute;
					top: 50px;
					right: 0;
					left: 0;
					// background: #191d21;//4.30上线颜色变更
					background: #373d47; //4.30上线颜色变更
					z-index: 9999;
					display: none;
					span {
						svg {
							//zjl add
							width: 20px;
							margin-right: 5px;
							height: 20px;
						}
						display: block;
						height: 40px;
						line-height: 40px;
						text-align: center;
						align-items: center; //zjl add
						cursor: pointer;
					}
					span:hover {
						color: #40ffcf;
					}
					span:last-child {
						border-top: 1px solid #696767;
					}
				}
			}
			.drop-button:hover {
				background: #191d21; //4.30上线颜色变更
			}
			.drop-button:hover .drop-menu {
				display: block;
			}
		}
	}
	
	.layout {
		position: absolute;
		width: 100%;
		left: 0;
		top: 50px;
		bottom: 0px;
		.line {
			width: 5px;
			position: absolute;
			top: 0px;
			bottom: 0px;
			background-color: #ced5dc;
			cursor: col-resize;
			z-index: 10;
		}
		.main-container {
			height: 100%;
			transition: margin-left 0.28s;
			margin-left: 50px;
			position: relative;
		}
	}
</style>
<style lang="scss">
	.el-pagination__editor {
		.el-input__inner {
			line-height: 28px; //zjl add
		}
	}
	
	header {
		.right-menu {
			.el-input {
				margin-right: 50px; // zjl 10px
				width: 130px; //zjl 180px
			}
			.el-input__inner {
				color: #fff;
				// border:1px solid #b4b6b9 !important;//zjl change
				background-color: #35383b !important; //zjl change # 252a3f
				height: 26px; //zjl
				line-height: 26px; //zjl
				font-size: 12px; //zjl
				border-radius: 0px; //zjl
				transition: width 0.15s ease-in;
			}
			.el-input__inner:hover {
				//zjl add
				border-color: #409eff;
				width: 180px;
				transition: width 0.15s ease-in;
			}
			.el-input__inner:focus {
				//zjl add
				border-color: #409eff;
				width: 180px;
				background-color: #252a3f;
			}
		}
	}
	/*子表样式*/
	
	.dateil-data-form {
		.dateil-data-form-item {
			margin-bottom: 9px;
		}
	}
	
	.el-collapse-item__header {
		background-color: #E9E9E9;
		color: #333;
		font-weight: 900;
	}
	
	.password-panel {
		padding: 20px 50px;
		display: flex;
		flex-wrap: wrap;
		.password-panel-item {
			width: 100%;
		}
	}
</style>