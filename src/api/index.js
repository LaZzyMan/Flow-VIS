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
