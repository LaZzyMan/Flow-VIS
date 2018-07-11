import Mock from 'mockjs'
import roadData from './data/road_selected'
import stationData from './data/site_point_selected'
import voronoiData from './data/site_polygon_selected'

// Mock.setup({
//     timeout: '10-300'
// })

Mock.mock(/\/api\/road/, 'get', () => roadData)
Mock.mock(/\/api\/station/, 'get', () => stationData)
Mock.mock(/\/api\/voronoi/, 'get', () => voronoiData)
