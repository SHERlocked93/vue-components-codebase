/**
 * 创建于 2018/3/26
 * 作者: SHERlocked93
 * 功能: 接口
 */

import fetch from 'utils/fetch'

export function getList1() {
  return fetch({ url: '/getList1' })
}

export function getList3() {
  return fetch({ url: '/getList3' })
}

/**
 * 分页显示列表
 * @param companyId 名称
 * @param functionId 功能ID
 * @param modelId 型号ID
 * @param code
 * @param page
 * @param rows
 * @param runningStatus 运行状态
 * @param connectStatus 连接状态
 */
export function helloList({ companyId, functionId, modelId, code, runningStatus, connectStatus, page = 1, rows = 10 }) {
  return fetch({
    url: '/helloList',
    method: 'get',
    params: { companyId, functionId, modelId, code, runningStatus, connectStatus, page, rows }
  })
}
