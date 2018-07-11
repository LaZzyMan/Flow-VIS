import axios from 'axios'
import { notification } from 'antd'

// create an axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:2018',
  timeout: 20000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json;charset=utf-8',
  },
  withCredentials: true,
})

// request interceptor
service.interceptors.request.use(config => config,
  error => {
  // Do something with request error
    Promise.reject(error)
  })

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    notification.error({
      message: error.message,
      // description: error.message,
    })
    return Promise.reject(error)
  },
)

export default service
