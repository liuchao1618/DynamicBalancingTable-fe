import axios from 'axios'

const request = axios.create({
  baseURL: '/' // 统一设置接口地址
  // timeout: 1000 // 超时时间 超过1秒就不要返回
})
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if(config.url == 'http://www.xnnre.com/api/login'){
    // if(config.url == '/api/login'){
    config.headers.AppletSource =  'APP'
  }else{
    config.headers.Authorization = window.localStorage.getItem('AuthorizationStr')
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {

  // 对响应数据做点什么
  if(response.config.url== 'http://www.xnnre.com/api/login'){
    // if(response.config.url== '/api/login'){
    window.localStorage.setItem('AuthorizationStr',response.headers.setauthorization)
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
