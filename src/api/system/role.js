import request from '@/utils/request'

export default {
  // 获取表格数据
  getList(data) {
    return request({
      url: '/role/list',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 根据id获取详情
  getDetailById(id) {
    return request({
      url: `/role/userlist/${id}`,
      method: 'get'
    })
  },

  // 根据id获取详情
  getResourceDetailById(id) {
    return request({
      url: `/role/resourcelist/${id}`,
      method: 'get'
    })
  },

  // 创建数据
  createData(data) {
    return request({
      url: '/mdm/certificate/createCertificate',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 更新数据
  updateData(data) {
    return request({
      url: '/mdm/certificate/updateCertificate',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 删除数据
  delresource(data) {
    return request({
      url: '/role/delresources',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 获取模板类型下拉框数据
  getTemplateTypeOptions() {
    return request({
      url: '/mdm/certificate/getTemplateCombo',
      method: 'get'
    })
  },

  // 获取展开行数据
  getExpandRowData(params) {
    return request({
      url: '/mdm/storage/getDate',
      method: 'get',
      params
    })
  },

  //该角色未授权的资源接口
  getunselectresourceById(id) {
    return request({
      url: `/role/unselectresource/${id}`,
      method: 'get'
    })
  },

  //查询未授权的按钮的接口
  getunselectactresourceById(id) {
    return request({
      url: `/role/unselectactresource/${id}`,
      method: 'get'
    })
  },

  //添加权限接口
  eaddresources(data) {
    return request({
      url: '/role/addresources',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  //限制按钮接口
  deniedactionsources(data) {
    return request({
      url: '/role/deniedaction',
      method: 'post',
      data: JSON.stringify(data)
    })
  },
}
