import request from '../utils/request'

export default function getRoad(params) {
  return request({
    url: '/static/road_selected.geojson',
    method: 'get',
    params,
  })
}

export function getStation(params) {
  return request({
    url: '/static/site_point_selected.geojson',
    method: 'get',
    params,
  })
}

export function getPolygon(params) {
  return request({
    url: '/static/site_polygon_selected.geojson',
    method: 'get',
    params,
  })
}
