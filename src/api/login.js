import request from '@/utils/request'

export function login(username, password) {
	return request({
		url: '/login',
		method: 'post',
		data: {
			username,
			password
		}
	})
}

export function getInfo() {
	return request({
		url: '/user/info',
		method: 'get'
	})
}

export function logout() {
	return request({
		url: '/user/logout',
		method: 'post'
	})
}

export function updatepwdByUsername(data) {
	return request({
		url: '/user/updatepwdByUsername',
		method: 'post',
		data: JSON.stringify(data)
	})
}