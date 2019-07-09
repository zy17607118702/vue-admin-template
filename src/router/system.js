// 系统管理模块
export default [{
	path: '/system',
	component: () =>
		import('@/views/layout/Layout'),
	redirect: '/system/user',
	name: 'system',
	meta: {
		title: '系统管理',
		icon: 'xitong',
		isModule: true
	},
	children: [
		{
			// 角色管理
			path: 'role',
			name: 'role',
			component: () =>
				import('@/views/system/role'),
			meta: {
				title: '角色管理',
				dropMenu: 'permissionManage'
			}
		},
		{
			// 用户信息
			path: 'user',
			name: 'user',
			component: () =>
				import('@/views/system/user'),
			meta: {
				title: '用户信息',
				dropMenu: 'permissionManage'
			}
		}
		
	]
}]