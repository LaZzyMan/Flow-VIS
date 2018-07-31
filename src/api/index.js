import request from '../utils/request'

export function getRoad(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/road',
      method: 'get',
      params,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
        reject()
      })
  })
}

export function getStation(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/station',
      method: 'get',
      params,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
        reject()
      })
  })
}

export function getPolygon(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/voronoi',
      method: 'get',
      params,
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch(() => {
        reject()
      })
  })
}

export function getTexture(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/texture',
      method: 'get',
      params,
    })
      .then((response) => {
        resolve([new Float32Array(response.data[0]), new Float32Array(response.data[1])])
      })
      .catch(() => {
        reject()
      })
  })
}

export function getGravity(params) {
  return new Promise((resolve, reject) => {
    request({
      url: '/gravity',
      method: 'get',
      params,
    })
      .then((response) => {
        resolve(new Float32Array(response.data))
      })
      .catch(() => {
        reject()
      })
  })
}
