import Mock from 'mockjs'

const roadData = require('./data/road_selected.json')
const stationData = require('./data/site_point_selected.json')
const voronoiData = require('./data/site_polygon_selected.json')

// Mock.setup({
//     timeout: '10-300'
// })

Mock.mock(/\/api\/road/, 'get', () => roadData)
Mock.mock(/\/api\/station/, 'get', () => stationData)
Mock.mock(/\/api\/voronoi/, 'get', () => voronoiData)
