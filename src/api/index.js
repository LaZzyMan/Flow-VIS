import request from '../utils/request'

export function getRoad(params) {
  return request({
    url: '/api/road',
    method: 'get',
    params,
  })
}

export function getStation(params) {
  return request({
    url: '/api/station',
    method: 'get',
    params,
  })
}

export function getPolygon(params) {
  return request({
    url: '/api/voronoi',
    method: 'get',
    params,
  })
}
