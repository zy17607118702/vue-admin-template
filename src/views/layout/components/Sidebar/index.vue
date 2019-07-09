<template>
	<!-- 导航菜单组件 By NJZY -->
	<div v-clickOutside="handleSidebarDropMenuClose">
		<el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
			<ul id="new-side-menu" class="new-side-menu" @mouseover="handleMouseOver" @mouseout="handleMouseOut">
				<li v-for="(item, index) in menuList" :key="index">
					<div class="item" :class="{ menuActive: item.name == activeMenu }" @click="handleMenuClick(item, index)">
						<svg-icon :icon-class="item.icon" />
						<span>{{ item.name }}</span>
						<i class="el-icon-arrow-right" />
					</div>
				</li>
			</ul>
		</el-scrollbar>
		<div id="sidebar-drop-menu" class="sidebar-drop-menu fadeInLeft animated" :style="{ width: dropMenuWidth }">
			<div class="icon-close" @click="handleSidebarDropMenuClose"><i class="el-icon-close" /></div>
			<div class="menu-container">
				<masonry cols="4" :gutter="gutter">
					<div v-for="(cItem, index) in dropMenuList" :key="index" class="item">
						<h5 class="item-title">{{ cItem.name }}</h5>
						<ul class="item-body">
							<li v-for="(subItem, subIndex) in cItem.subList" :key="subIndex" @click="handleJump(subItem.path)">
								<div>
									<span>{{ subItem.name }}</span>
								</div>
							</li>
						</ul>
					</div>
				</masonry>
			</div>
		</div>
	</div>
</template>

<script>
	import sidebarApi from '@/api/sidebar'
	export default {
		data() {
			return {
				api: sidebarApi,
				menuList: [], // 菜单列表
				dropMenuList: [], // 展开菜单列表
				activeMenu: 'mainData', // 默认激活选项
				cols: 0,
				gutter: 10
			}
		},
		computed: {
			dropMenuWidth() {
				return this.cols * 180 + 'px'
			}
		},
		created() {
			//权限设置打开
			this.api.getResources().then(res => {
					if(res.length > 0 && res[0]) {
						this.initMenu(res[0].resources)
					} else {
						this.$message({
							type: 'warning',
							message: '该用户没有配置权限,请联系管理员配置权限'
						})
					}
				})
				.catch(e => {
					console.log(e)
				})
		},

		directives: {
			clickOutside: {
				bind(el, binding, vnode) {
					/** el可以获取当前dom节点，并且进行编译，也可以操作事件 **/
					/** binding指的是一个对象，一般不用 **/
					/** vnode 是 Vue 编译生成的虚拟节点 **/
					function documentHandler(e) {
						if(el.contains(e.target)) {
							return false;
						}

						if(binding.expression) {
							binding.value(e);
						}
					}
					el._vueClickOutside_ = documentHandler;
					document.addEventListener('click', documentHandler);
				},
				unbind(el, binding) {
					document.removeEventListener('click', el._vueClickOutside_);
					delete el._vueClickOutside_;
				}
			}
		},
		methods: {
			initMenu(res) {
				//初始化菜单
				res.forEach(item => {
					//遍历一级菜单
					let obj = {
						name: item.resName,
						icon: this.matchIcon(item.resName),
						sequenceNum: item.sequenceNum,
						subList: []
					}

					if(item.resources && item.resources.length > 0) {
						//如果二级菜单有值,则遍历二级菜单
						obj.subList = this.menuIterator(item.resources);
					}
					this.menuList.push(obj);
				});
				this.menuList = this.sortInt(this.menuList, "sequenceNum");
				this.dropMenuList = this.menuList[0].subList;
			},
			menuIterator(menu) {
				let arr = [];
				menu.forEach(item => {
					let obj = {
						name: item.resName,
						sequenceNum: item.sequenceNum,
						path: item.resourcePath,
						subList: []
					}
					if(item.resources && item.resources.length > 0) {
						obj.subList = this.sortInt(this.menuIterator(item.resources), "sequenceNum");
					}
					arr.push(obj);
				});
				arr = this.sortInt(arr, "sequenceNum");
				return arr;
			},
			sortInt(data, key) {
				data.sort(function(a, b) {
					return parseInt(a[key]) - parseInt(b[key]);
				});
				return data;
			},
			matchIcon(name) {
				switch(name) {
					case "业务主数据":
						return "yewu";
					case "订单计划":
						return "dingdan";
					case "生产执行":
						return "light";
					case "在线质量":
						return "zhiliang";
					case "物料拉动":
						return "wuliao";
					case "监控预警":
						return "jiankong";
					case "系统管理":
						return "xitong";
					case "人员管理":
						return "renyuan";
					default:
						return "yewu";
				}
			},

			handleMenuClick(menu, index) {
				if(this.activeMenu == menu.name) {
					this.cols = this.dropMenuWidth == '0px' ? 4 : 0
				} else {
					this.activeMenu = menu.name
					this.cols = 4
				}
				this.dropMenuList = this.menuList[index].subList
			},
			handleMouseOver() {
				this.$nextTick(() => {
					let sidebarNode = document.getElementById('new-side-menu')
					if(this.dropMenuWidth == '0px') {
						sidebarNode.style.width = '180px'
					}
				})
			},
			handleMouseOut() {
				this.$nextTick(() => {
					let sidebarNode = document.getElementById('new-side-menu')
					if(this.dropMenuWidth == '0px') {
						sidebarNode.style.width = '50px'
					}
				})
			},
			handleJump(path) {
				if(path) {
					this.$router.push(path)
					this.handleSidebarDropMenuClose()
				}
			},
			handleSidebarDropMenuClose() {
				this.$nextTick(() => {
					let sidebarNode = document.getElementById('new-side-menu')
					this.cols = 0
					setTimeout(() => {
						sidebarNode.style.width = '50px'
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss">
	.new-side-menu {
		transition: all 0.28s cubic-bezier(0, 0, 0.2, 1);
		// background: #282a3b;//4.30上线颜色变更
		background: #373d47;
		border: none;
		list-style: none;
		position: relative;
		margin: 0;
		padding-left: 0;
		width: 50px;
		height: 100%;
		&> :first-child {
			border-top: 1px solid hsla(0, 0%, 100%, 0.1);
			// border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
		}
		.item {
			overflow: hidden;
			position: relative;
			padding-left: 15px;
			font-size: 14px; //zjl 16px
			line-height: 50px;
			height: 50px;
			color: #fff;
			i {
				position: absolute;
				right: 10px;
				line-height: 50px;
			}
			svg {
				width: 16px;
				fill: #bebebe;
			}
		}
		.item:hover {
			background: #4a555c;
		}
		.menuActive {
			color: #3f98f6;
			svg {
				fill: #3f98f6;
			}
		}
	}
	
	.sidebar-drop-menu {
		transition: all 0.28s cubic-bezier(0, 0, 0.2, 1);
		position: absolute;
		overflow: hidden;
		top: 0px;
		left: 180px;
		z-index: 5000;
		height: 100%;
		width: 0px;
		background: #ffffff;
		box-shadow: 4px 0 8px 0 rgba(0, 0, 0, 0.2);
		.icon-close {
			position: absolute;
			right: 17px;
			top: 10px;
			cursor: pointer;
			z-index: 1;
		}
		.menu-container {
			height: 100%;
			width: 100%;
			padding: 20px;
			overflow: auto;
			position: relative;
			.item {
				overflow: hidden;
				white-space: nowrap;
				.item-title {
					margin: 0;
					padding: 0 10px;
					line-height: 40px;
					height: 40px;
					color: #000;
					font-size: 14px;
					font-weight: 600;
				}
				.item-body {
					border: none;
					list-style: none;
					position: relative;
					margin: 0;
					padding-left: 0;
					li {
						font-size: 12px; //zjl add
						cursor: pointer;
						position: relative;
						height: 30px; //zjl 40px
						line-height: 30px; //zjl 30px
						padding: 0 10px;
						.el-icon-star-on,
						.el-icon-star-off {
							top: 50%;
							transform: translateY(-50%);
							position: absolute;
							right: 10px;
							cursor: pointer;
						}
						.el-icon-star-off {
							display: none;
						}
					}
					li:hover {
						color: #409eff;
						background: #e7e7e7;
						.el-icon-star-off {
							display: inline;
						}
					}
				}
			}
		}
	}
</style>