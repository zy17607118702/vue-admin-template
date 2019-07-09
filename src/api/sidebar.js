import request from '@/utils/request'

export default {
  // 获取用户权限
  getResources(params) {
    return request({
        url: '/resource/web/resources',
        method: 'get',
        params
    })
  },
}
