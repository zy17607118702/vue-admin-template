import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

import { LocalStorage } from "@/utils/mohist"

import sidebarApi from '@/api/sidebar'

let getRouter = null; //用来获取后台拿到的路由
const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
	NProgress.start(); //开始加载进度条

	if(getToken()) {
		if(to.path === '/login') {
			next({
				path: '/'
			});
			NProgress.done();
		} else {
			if(!getRouter) {
				sidebarApi.getResources().then(res => {
					if(res.length > 0 && res[0]) {
						debugger
						getRouter = res[0].resources; //后台拿到路由
						promissionRouter.routerGo(to, next); //执行路由跳转方法
					} else {
						this.$message({
							type: 'warning',
							message: '该用户没有配置权限,请联系管理员配置权限'
						})
						next();
					}

				}).catch(err => {
					debugger
					Message({
						type: 'warning',
						message: '获取用户权限失败.'
					});
					next();
				});
			} else {
				next();
			}

		}
	} else {
		if(whiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
			NProgress.done()
		}
	}
})

let promissionRouter = {
	routerGo(to, next) {
		getRouter = this.filterAsyncRouter(getRouter); //过滤路由
		router.addRoutes(getRouter); //动态添加路由 
		let errRouter = [{
			path: '*',
			redirect: '/404',
			hidden: true
		}]
		router.addRoutes(errRouter); //动态添加路由 
		next({ ...to,
			replace: true
		});
	},
	filterThrRouter(router, parentPath) {
		let routerArr = [];
		router.forEach(item => {
			routerArr.push({
				path: item.resPath,
				component: () =>
					import(`@/views${item.resPath}`),
				//				redirect: '/index',
				name: item.resNameC,
				meta: {
					title: item.resNameC,
					secondRouter: item.resNameC
				},
			})
		})
		return routerArr;
	},
	filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
		let accessedRouters = [];

		asyncRouterMap.forEach(item => {

			let obj = {
				path: item.resPath,
				component: () =>
					import('@/views/layout/Layout'),
				redirect: '/index',
				name: item.resNameC,
				meta: {
					title: item.resNameC,
					icon: 'yewu'
				},
				children: []
			}

			if(item.resources && item.resources.length) {
				let subRouter = [];
				item.resources.forEach(resources => {
					if(resources.resources && resources.resources.length) {
						let theRouter = promissionRouter.filterThrRouter(resources.resources, item.resPath);
						subRouter = [...subRouter, ...theRouter]
					}
				})
				obj.children = subRouter;
			}
			accessedRouters.push(obj);
});
		return accessedRouters;
	}
}

router.afterEach(() => {
	NProgress.done() // 结束Progress
})

/*
 * 连接进度条以及重定向
 */
//const whiteList = ['/login'] // 不重定向白名单
//router.beforeEach((to, from, next) => {
//	NProgress.start()
//	if(getToken()) {
//		if(to.path === '/login') {
//			next({
//				path: '/'
//			})
//			NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
//		} else {
//			if(store.getters.roles.length === 0) {
//				store
//					.dispatch('GetInfo')
//					.then(res => {
//						// 拉取用户信息
//						next()
//					})
//					.catch(err => {
//						store.dispatch('FedLogOut').then(() => {
//							Message.error(err || 'Verification failed, please login again')
//							next({
//								path: '/'
//							})
//						})
//					})
//			} else {
//				next()
//			}
//		}
//	} else {
//		if(whiteList.indexOf(to.path) !== -1) {
//			next()
//		} else {
//			next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//			NProgress.done()
//		}
//	}
//})
//