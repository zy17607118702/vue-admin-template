import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '../views/layout/Layout'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// 自定义模块
//引入系统管理模块
import systemManage from './system'
//引入主数据模块
import mainData from './mainData'

Vue.use(Router)

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/404'),
		hidden: true
	},
	 {
	 	path: '/',
	 	component: Layout,
	 	redirect: '/index',
	 	name: 'index',
		children: [{
	 		path: 'index',
	 		name: 'index',
	 		meta: {
	 			title: '首页',
	 			icon: 'table'
	 		},
	 		component: () =>
	 			import('@/views/index')
	 	}]
	 },
	// {
	// 	path: '/jump',
	// 	component: Layout,
	// 	redirect: '/mainData/plant',
	// 	name: 'jump',
	// 	meta: {
	// 		title: 'jump',
	// 		icon: 'example'
	// 	},
	// 	children: [{
	// 			path: 'supplierDataSAP',
	// 			name: 'supplierDataSAP',
	// 			component: () =>
	// 				import('@/views/mainData/supplierDataSAP'),
	// 			meta: {
	// 				title: 'SAP下载信息',
	// 				icon: 'table'
	// 			}
	// 		},
	// 		{
	// 			path: 'componentsDataSAP',
	// 			name: 'componentsDataSAP',
	// 			component: () =>
	// 				import('@/views/mainData/componentsDataSAP'),
	// 			meta: {
	// 				title: 'SAP下载信息',
	// 				icon: 'table'
	// 			}
	// 		},
	// 		{
	// 			path: 'reportConfiguration',
	// 			name: 'reportConfiguration',
	// 			component: () =>
	// 				import('@/views/mainData/reportConfiguration'),
	// 			meta: {
	// 				title: '报送配置',
	// 				icon: 'table'
	// 			}
	// 		},
	// 		{
	// 			// 替换件配额处理记录
	// 			path: 'tiReplaceQuota',
	// 			name: 'tiReplaceQuota',
	// 			component: () =>
	// 				import('@/views/mainData/tiReplaceQuota'),
	// 			meta: {
	// 				title: 'tiReplaceQuota',
	// 				dropMenu: 'partData'
	// 			}
	// 		},
	// 		{
	// 			// 可替换件关系处理
	// 			path: 'sapmesreplace',
	// 			name: 'sapmesreplace',
	// 			component: () =>
	// 				import('@/views/mainData/sapmesreplace'),
	// 			meta: {
	// 				title: 'sapmesreplace',
	// 				dropMenu: 'partData'
	// 			}
	// 		},
	// 	]
	// },
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const router = new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: [
		...constantRouterMap,
//		...systemManage,
//		...mainData,
//		...orderPlant,
//		...productExec,
//		...onlineQty,
//		...materialPull,
//		...monitorWarn,
//		...staffPerformance
	]
})

export default router