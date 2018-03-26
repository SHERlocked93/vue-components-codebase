/**
 * 创建于 2018/1/15
 * 功能: axios封装
 */

import axios from 'axios'

let baseURL = ''

// 创建axios实例
const service = axios.create({
  baseURL: baseURL || process.env.BASE_API,               // api的base_url
  timeout: 5000                                           // 请求超时时间改成了5s
})

// request拦截器
service.interceptors.request.use(config => {
  config.baseURL = baseURL || process.env.BASE_API
  if (config.method.toLowerCase() === 'get') {                // 解决IE下ajax请求发送不出去的问题
    config.params = config.params || {}
    config.params.forStupidIE = +new Date()
  }
  return config
}, error => {
  console.err(error, ' in fetch.js') // for debug
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // code为非20000是抛错 可结合自己业务进行修改
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        console.info('你已被登出，可以取消继续留在该页面，或者重新登录')
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // 因为后台没有作OPTIONS请求判断，导致这边的error.response为空，无法判断具体http的status来决定message的报错信息
    // 此时的error.message都是'net error'
    error.message = '网络通讯异常，请检查！'
    console.error(error)
    return Promise.reject(error)
  }
)


const changeBaseURL = function(value) {
  baseURL = value
}

export default service
export { changeBaseURL }
