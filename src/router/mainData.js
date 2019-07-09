// 业务主数据模块
export default [{
    path: '/mainData',
    component: () =>
        import ('@/views/layout/Layout'),
    redirect: '/index',
    name: 'mainData',
    meta: { 
        title: '业务主数据', 
        icon: 'yewu', 
        isModule: true 
    },
    children: [{
            // 零件数据
            path: 'part',
            name: 'part',
            component: () =>
                import ('@/views/mainData/part'),
            meta: { title: '工厂', secondRouter: '业务主数据' }
        }
    ]
}]
