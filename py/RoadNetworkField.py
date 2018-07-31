from shapely import geometry, ops
import geojson
import json
import numpy as np
import numba as nb


def road_gravity(road_network_filename, output_filename, width, height, bbox, r, f):
    '''
    :param road_network_filename: 路网文件
    :param output_filename: 输出文件位置
    :param width: 格网宽度
    :param height: 格网高度
    :param bbox: 地图范围
    :param r: 道路吸引作用范围
    :param f: 吸引力与距离的函数
    :return: void
    '''
    with open(road_network_filename, 'r') as fp:
        roads = geojson.load(fp)['features']
        fp.close()
    span_x = (bbox['max_lng'] - bbox['min_lng']) / (width - 1)
    span_y = (bbox['max_lat'] - bbox['min_lat']) / (height - 1)
    road_gravity_data = []
    grid_points = []
    for i in range(width):
        for j in range(height):
            grid_point = geometry.Point(bbox['min_lng'] + i * span_x, bbox['min_lat'] + j * span_y)
            grid_points.append(grid_point)
    grid_gravity = map(lambda x: calculate_grid_gravity(x, r, roads, normal_function), grid_points)
    count = 0
    for i in grid_gravity:
        count = count + 1
        print('Finish %d.' % count)
        road_gravity_data.append(i[0])
        road_gravity_data.append(i[1])
        road_gravity_data.append(i[2])
        road_gravity_data.append(i[3])
    with open(output_filename, 'w', newline='', encoding='utf-8') as fp:
        json.dump(road_gravity_data, fp)
        fp.close()


def calculate_grid_gravity(grid_point, r, roads, f):
    buffer = grid_point.buffer(r, cap_style=1, join_style=1)
    near_roads = list(filter(lambda x: geometry.MultiLineString(x.geometry.coordinates).intersects(buffer), roads))
    if len(near_roads) == 0:
        return np.array([0.0, 0.0, 0.0, 0.0])
    return np.array(list(map(lambda x: calculate_road_gravity(x, grid_point, f, r), near_roads))).sum(axis=0)


def calculate_road_gravity(road, grid_point, f, r):
    road_width = int(road.properties['Width'])
    road_direction = int(road.properties['Direction'])
    nearest_point = ops.nearest_points(grid_point, geometry.MultiLineString(road.geometry.coordinates))[1]
    adjustment = 1.0
    if road_width == 30:
        adjustment = 1.2
    elif road_width == 55:
        adjustment = 1.5
    elif adjustment == 130:
        adjustment = 1.8
    value = adjustment * f(nearest_point.distance(grid_point), (r / 3))
    gravity_direction = np.array([nearest_point.x - grid_point.x, nearest_point.y - grid_point.y])
    gravity_direction = gravity_direction / np.linalg.norm(gravity_direction)
    if road_direction == 1 or road_direction == 0:
        if gravity_direction[0] > 0:
            guide_direction = np.dot(gravity_direction, np.array([[0, -1], [1, 0]]))
        elif gravity_direction[0] < 0:
            guide_direction = np.dot(gravity_direction, np.array([[0, 1], [-1, 0]]))
        elif gravity_direction[1] <= 0:
            guide_direction = np.dot(gravity_direction, np.array([[0, 1], [-1, 0]]))
        else:
            guide_direction = np.dot(gravity_direction, np.array([[0, -1], [1, 0]]))
    elif road_direction == 2:
        guide_direction = np.dot(gravity_direction, np.array([[0, -1], [1, 0]]))
    else:
        guide_direction = np.dot(gravity_direction, np.array([[0, 1], [-1, 0]]))
    return np.array([gravity_direction[0],
                     gravity_direction[1],
                     guide_direction[0],
                     guide_direction[1]]) * value


@nb.vectorize("float64(float64, float64)", nopython=True)
def normal_function(d, theta):
    '''
    :param d: 网格点到道路的距离
    :param theta: 道路影响范围
    :return: 吸引力强度
    '''
    return np.exp(- d * d / (2 * theta * theta)) / (np.sqrt(2 * np.pi) * theta)


if __name__ == '__main__':
    bbox = {'min_lng': 120.636690154504251,
            'max_lng': 120.723288207926046,
            'min_lat': 27.982619974031067,
            'max_lat': 28.027239987997554}
    road_gravity(road_network_filename='json/road_selected.geojson',
                 output_filename='json/road_gravity.json',
                 width=800,
                 height=400,
                 bbox=bbox,
                 r=0.001,
                 f=normal_function)

