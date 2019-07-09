import request from '@/utils/request'

export default {
  // 获取表格数据
  getList(data) {
    return request({
      url: '/user/userlist',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 根据id获取详情
  getDetailById(id) {
    return request({
      url: `/user/queryroles/${id}`,
      method: 'get'
    })
  },
  // 获得状态下拉框数据
  getStateOptions() {
    return request({
      url: '/ds/codelist/key_SysUser_state',
      method: 'get'
    })
  }

}
