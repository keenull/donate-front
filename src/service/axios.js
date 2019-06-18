import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '../vuex/store'
import router from '../router/index'

axios.interceptors.request.use(config => {
  /* if (store.state.token) {
    config.headers.Authorization = `${store.state.token}`
  } */
  return config
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(re => {
  loading.close()
  if (re.status && re.status === 200 && re.data.code === 'ACK') {
    return re
  } else {
    Message.error(re.data.message)
  }
}, err => {
  loading.close()
  if (err.response) {
    switch (err.response.status) {
      case 401:
        Message.info({message: err.response.data.error_description})
        router.replace({
          path: '/login',
          // query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
        return
      case 403:
        Message.error({message: '权限不足,请联系管理员!'})
        router.replace({
          path: '/home',
        })
        return
      case 404:
        Message.error({message: '请求路径不存在!'})
        return
      case 405:
        Message.error({message: '请求方法类型错误!'})
        return
      case 415:
        Message.error({message: '请求参数格式错误!'})
        return
      case 500:
        return
      case 504:
        Message.error({message: '服务器被吃了⊙﹏⊙∥'})
        return
      default:
        Message.error({message: '系统错误!'})
        break
    }
    return Promise.resolve(err)
  } else {
    Message.error({message: '请求超时!'})
    return Promise.reject(err)
  }
})

let loading = ''

// 通用公用方法
const postParam = (url, params, flag) => {
  loading = Loading.service({
    lock: false,
    text: '正在请求中，请稍候…',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (flag && store.state.token) {
    headers['Authorization'] = 'Bearer ' + `${store.state.token}`
  }
  return axios({
    method: 'post',
    url: url,
    headers: headers,
    timeout: 30000,
    data: params,
    traditional: true,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) +
            '=' +
            encodeURIComponent(data[it]) +
            '&'
        }
        return ret
      }
    ]
  }).then(res => res.data.data)
}

const postBody = (url, body, flag) => {
  loading = Loading.service({
    lock: false,
    text: '正在请求中，请稍候…',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  let headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  if (flag && store.state.token) {
    headers['Authorization'] = 'Bearer ' + `${store.state.token}`
  }
  return axios({
    method: 'post',
    url: url,
    headers: headers,
    timeout: 30000,
    data: body,
    traditional: true
  }).then(res => res.data.data)
}

const postBody2 = (url, flag) => {
  let headers = {
    'Content-Type': 'application/json;charset=UTF-8'
  }
  if (flag && store.state.token) {
    headers['Authorization'] = 'Bearer ' + `${store.state.token}`
  }
  return axios({
    method: 'post',
    url: url,
    headers: headers,
    timeout: 30000,
    traditional: true
  }).then(res => res.data.data)
}

const getParam = (url, params, flag) => {
  loading = Loading.service({
    lock: false,
    text: '正在请求中，请稍候…',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (flag && store.state.token) {
    headers['Authorization'] = 'Bearer ' + `${store.state.token}`
  }
  return axios({
    method: 'get',
    url: url,
    headers: headers,
    timeout: 30000,
    data: params,
    traditional: true,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) +
            '=' +
            encodeURIComponent(data[it]) +
            '&'
        }
        return ret
      }
    ]
  }).then(res => res.data.data)
}

const getParam2 = (url, params, flag) => {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (flag && store.state.token) {
    headers['Authorization'] = 'Bearer ' + `${store.state.token}`
  }
  return axios({
    method: 'get',
    url: url,
    headers: headers,
    timeout: 30000,
    data: params,
    traditional: true,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) +
            '=' +
            encodeURIComponent(data[it]) +
            '&'
        }
        return ret
      }
    ]
  }).then(res => res.data.data)
}

export {
  postParam,
  postBody,
  getParam,
  getParam2
}
