import axios, {AxiosRequestConfig, Method} from 'axios'
import {getCookie} from './cookies.js';

const http = axios.create({
  timeout: 30000,
  baseURL: import.meta.env.VITE_APP_WEB_URL
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if(!config.params) {
    config.params = {};
  }
  config.params.cookie = `MUSIC_U=${getCookie('MUSIC_U')};`;
  // POST 请求 url 必须添加时间戳,使每次请求 url 不一样,不然请求会被缓存
  /* 由于接口做了缓存处理 ( 缓存 2 分钟,不缓存数据极容易引起网易服务器高频 ip 错误 , 可在 app.js 设置 ,
   可能会导致登录后获取不到 cookie), 相同的 url 会在两分钟内只向网易服务器发一次请求 ,
   如果遇到不需要缓 存结果的接口 , 可在请求 url 后面加一个时间戳参数使 url 不同 */
  config.params.timestamp = Date.now()
  // token && (config.headers!.Authorization = token)
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((response) => {
  if(response.data.code !== 200) {
    return Promise.reject(response.data)
  }
  return response.data
}, (error) => {
  return Promise.reject(error.response.data)
})

type Request = {
  <R extends unknown, D>(config: AxiosRequestConfig & {data: R, params: R}): Promise<D>;
  <R extends unknown, D>(url: string, method?: Method, config?: AxiosRequestConfig & {data: R, params: R}): Promise<D>;
  <R extends unknown, D>(url: string, data: R, method?: Method): Promise<D>;
  <R extends unknown, D>(url: string, data: R, config?: AxiosRequestConfig): Promise<D>;
}

const request: Request = (url, method?: unknown | Method, config?) => {
  if(typeof url !== "string") {
    return http(url)
  }
  else if(method === undefined) {
    return request(url, 'post')
  }
  else if(typeof method === "string") {
    return http({
      ...<AxiosRequestConfig>config,
      url,
      method,
    })
  }
  else if(typeof method === 'object' && config === undefined) {
    return http.post(url, method)
  }
  else if(typeof config === 'string') {
    return http({
      ...<AxiosRequestConfig>config,
      url,
      [config.toLowerCase() !== 'get' ? 'data' : 'params']: method,
    })
  }
  return http(url)
}

export default request