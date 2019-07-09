import request from '@/utils/request'

export default {
  // 获取表格数据
  getList(data) {
    return request({
      url: '/mdm/plant/listPage',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 根据id获取详情
  getDetailById(id) {
    return request({
      url: `/mdm/plant/id/${id}`,
      method: 'get'
    })
  },

  // 创建数据
  createData(data) {
    return request({
      url: '/mdm/plant/createPlant',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 更新数据
  updateData(data) {
    return request({
      url: '/mdm/plant/updatePlant',
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 删除数据
  deleteById(data) {
    return request({
      url: `/mdm/plant/del`,
      method: 'post',
      data: JSON.stringify(data)
    })
  },

  // 获取工厂下拉框数据
  getPlantOptions() {
    return request({
      url: '/mdm/ds/plants',
      method: 'get'
    })
  },

  // 获取追溯类型下拉框数据
  getTrackTypeOptions() {
    return request({
      url: '/ds/codelist/Key_TrackType',
      method: 'get'
    })
  }
}
