import request from '@/utils/request'

export default {
	// 获取表格数据
	updatepwd(data) {
		return request({
			url: '/user/updatepwd',
			method: 'post',
			data: JSON.stringify(data)
		})
	}
}