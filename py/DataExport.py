from shapely import geometry
import pymysql
import geojson
import geojsonio
import json
import numpy as np
from copy import deepcopy


def export_site(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT id, vertice, longitude, latitude FROM site;')
    result = cursor.fetchall()
    points = []
    polygons = []
    for site in result:
        vertices = []
        for vertice in site[1].split(';'):
            vertices.append((float(vertice.split(',')[0]), float(vertice.split(',')[1])))
        polygons.append(geojson.Feature(geometry=geometry.Polygon(vertices), properties={'site_id': site[0]}))
        points.append(geojson.Feature(geometry=geometry.Point(site[2], site[3]), properties={'site_id': site[0]}))
        print(site[0])
    with open('site_point.json', 'w', encoding='utf-8', newline='') as f:
        geojson.dump(geojson.FeatureCollection(points), f, sort_keys=True)
        print('Save site_point.geojson.')
        f.close()
    with open('site_polygon.json', 'w', encoding='utf-8', newline='') as f:
        geojson.dump(geojson.FeatureCollection(polygons), f, sort_keys=True)
        print('Save site_polygon.geojson.')
        f.close()


def export_traj(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT id from traj_new GROUP BY id;')
    result = cursor.fetchall()
    trajectories = []
    people_ids = [i[0] for i in result]
    for people_id in people_ids:
        cursor.execute('SELECT * FROM traj_new WHERE id=%s ORDER BY time;', (people_id))
        result = cursor.fetchall()
        trajectory = []
        properties = {'people_id': people_id}
        for point in result:
            trajectory.append((point[3], point[4]))
        trajectories.append(geojson.Feature(geometry=geometry.LineString(trajectory), properties=properties))
        print(people_id)
    with open('trajectory.geojson', 'w', encoding='utf-8', newline='') as f:
        geojson.dump(geojson.FeatureCollection(trajectories), f, sort_keys=True)
        f.close()


def display(filename):
    with open(filename) as f:
        geojsonio.display(f.read())
        f.close()


def export_vector(conn):
    cursor = conn.cursor()
    cursor.execute('SELECT id from traj_new GROUP BY id;')
    result = cursor.fetchall()
    sites = {}
    people_ids = [i[0] for i in result]
    for people_id in people_ids:
        cursor.execute('SELECT * FROM traj_new WHERE id=%s ORDER BY time;', (people_id))
        result = cursor.fetchall()
        for i in range(1, len(result) - 1):
            in_point = result[i - 1]
            out_point = result[i + 1]
            current_point = result[i]
            if current_point[2] not in sites:
                sites[current_point[2]] = {'in': {in_point[2]: {'loc': (in_point[3], in_point[4]), 'value': 1}},
                                           'out': {out_point[2]: {'loc': (out_point[3], out_point[4]), 'value': 1}},
                                           'loc': (current_point[3], current_point[4])}
            else:
                if in_point[2] not in sites[current_point[2]]['in']:
                    sites[current_point[2]]['in'][in_point[2]] = {'loc': (in_point[3], in_point[4]), 'value': 1}
                else:
                    sites[current_point[2]]['in'][in_point[2]]['value'] += 1
                if out_point[2] not in sites[current_point[2]]['out']:
                    sites[current_point[2]]['out'][out_point[2]] = {'loc': (out_point[3], out_point[4]), 'value': 1}
                else:
                    sites[current_point[2]]['out'][out_point[2]]['value'] += 1
        print(people_id)
    with open('site_raw_vector.json', 'w', encoding='utf-8', newline='') as f:
        json.dump(sites, f)
        f.close()
    lines = []
    for site in sites.values():
        for in_site in site['in'].values():
            lines.append(geojson.Feature(geometry=geometry.LineString([in_site['loc'], site['loc']]),
                                         properties={'direction': 0, 'value': in_site['value']}))
        for out_site in site['out'].values():
            lines.append(geojson.Feature(geometry=geometry.LineString([out_site['loc'], site['loc']]),
                                         properties={'direction': 0, 'value': out_site['value']}))
    with open('site_raw_vector.geojson', 'w', encoding='utf-8', newline='') as f:
        geojson.dump(geojson.FeatureCollection(lines), f, sort_keys=True)
        f.close()


def db_export():
    connect = pymysql.connect(host='10.76.0.180', port=3306, user='root', password='aptx4869', db='citydata')
    # connect = pymysql.connect(host='10.76.0.184', port=3306, user='root', password='123456', db='mobiledata')
    # export_site(connect)
    # export_traj(connect)
    export_vector(connect)
    # display('site_point.json')
    # display('site_polygon.json')
    connect.close()


def sites2vector(filename):
    '''
    将site文件转为向量数据
    :param filename: 文件名
    :return: 向量集合
    '''
    with open(filename, 'r', encoding='utf-8') as f:
        sites = json.load(f)
        f.close()
    vectors = {}
    for index, site in sites.items():
        vectors[index] = {'in': [], 'out': [], 'loc': site['loc']}
        for p_id, point in site['in'].items():
            if p_id is not index:
                theta = get_vector_direction(point['loc'], site['loc'])
                vectors[index]['in'].append([theta, point['value']])
            else:
                continue
        for p_id, point in site['out'].items():
            if p_id is not index:
                theta = get_vector_direction(site['loc'], point['loc'])
                vectors[index]['out'].append([theta, point['value']])
            else:
                continue
    return vectors


def get_vector_direction(p1, p2):
    '''
    求两点间向量方向
    :param p1: 出发点
    :param p2: 到达点
    :return: 向量方向
    '''
    x = p2[0] - p1[0]
    y = p2[1] - p1[1]
    # 夹角为pi/2和3pi/2的情况
    if x == 0:
        if y > 0:
            return np.pi / 2
        else:
            return 3 * np.pi / 2
    else:
        theta = np.arctan(y / x)
    # 四个象限角的不同情况
    if x > 0:
        if y >= 0:
            return theta
        else:
            return theta + 2 * np.pi
    else:
        return theta + np.pi


def k_means(vectors, k=4, max_iteration=200):
    '''
    对向量按照方向聚类并以强度加权的K-means
    :param vectors: 向量集合
    :param k: 中心数
    :param max_iteration: 最大迭代数
    :return: 主向量列表
    '''
    # 数量过少返回按强度排序的原向量
    if len(vectors) <= k:
        return sorted(vectors, key=lambda x: x[1])
    center_points = [{'center': vectors[i], 'children': []} for i in range(k)]
    for iteration in range(max_iteration):
        # 按方向进行聚类
        for vector in vectors:
            distances = [np.abs(p['center'][0] - vector[0]) for p in center_points]
            center_points[distances.index(min(distances))]['children'].append(deepcopy(vector))
        new_centers = deepcopy(center_points)
        for center_point in new_centers:
            # 使用强度作为权值求中心点
            center_point['center'][0] = np.sum([i[0]*i[1] for i in center_point['children']]) / np.sum([i[1] for i in center_point['children']])
        # 如果收敛，则使用投影计算强度值
        if center_points == new_centers:
            for center_point in center_points:
                center_point['center'][1] = np.sum([i[1] * np.cos(i[0]-center_point['center'][0]) for i in center_point['children']])
            break
        else:
            center_points = deepcopy(new_centers)
            for center_point in center_points: center_point['children'] = []
    return sorted([i['center'] for i in center_points], key=lambda x: x[1])


def synthesize_vector_flow(major_vectors, bbox, w, h, cos_threshold, l):
    cell_x = (bbox[1][0] - bbox[0][0]) / w
    cell_y = (bbox[1][1] - bbox[0][1]) / h
    vf = [[[] for j in range(w)] for i in range(h)]
    for major_vector in major_vectors:
        for m in range(w):
            for n in range(h):
                cell_lng = bbox[0][0] + (m + 0.5) * cell_x
                cell_lat = bbox[0][1] + (n + 0.5) * cell_y
                vector = [cell_lng - major_vector['loc'][0], cell_lat - major_vector['loc'][1]]


def export_merged_vector(filename):
    '''
    将主向量文件进行方向空间合并
    :param filename: 主向量文件名
    :return: 合并后向量
    '''
    major_vectors = sites2vector(filename)
    # with open(filename) as f:
    #     major_vectors = json.load(f)
    #     f.close()
    merged_vectors = []
    for major_vector in major_vectors.values():
        merged_in = direction_merge(major_vector['in'])
        merged_out = direction_merge(major_vector['out'])
        merged_vectors.append(geojson.Feature(geometry=geometry.Point(major_vector['loc']),
                                              properties={'in_north_x': np.cos(merged_in['North'][0]) * merged_in['North'][1],
                                                          'in_north_y': np.sin(merged_in['North'][0]) * merged_in['North'][1],
                                                          'in_west_x': np.cos(merged_in['West'][0]) * merged_in['West'][1],
                                                          'in_west_y': np.sin(merged_in['West'][0]) * merged_in['West'][1],
                                                          'in_south_x': np.cos(merged_in['South'][0]) * merged_in['South'][1],
                                                          'in_south_y': np.sin(merged_in['South'][0]) * merged_in['South'][1],
                                                          'in_east_x': np.cos(merged_in['East'][0]) * merged_in['East'][1],
                                                          'in_east_y': np.sin(merged_in['East'][0]) * merged_in['East'][1],
                                                          'out_north_x': np.cos(merged_out['North'][0]) * merged_out['North'][1],
                                                          'out_north_y': np.sin(merged_out['North'][0]) * merged_out['North'][1],
                                                          'out_west_x': np.cos(merged_out['West'][0]) * merged_out['West'][1],
                                                          'out_west_y': np.sin(merged_out['West'][0]) * merged_out['West'][1],
                                                          'out_south_x': np.cos(merged_out['South'][0]) * merged_out['South'][1],
                                                          'out_south_y': np.sin(merged_out['South'][0]) * merged_out['South'][1],
                                                          'out_east_x': np.cos(merged_out['East'][0]) * merged_out['East'][1],
                                                          'out_east_y': np.sin(merged_out['East'][0]) * merged_out['East'][1]}))
    with open('merged_vectors.geojson', 'w', newline='', encoding='utf-8') as f:
        geojson.dump(geojson.FeatureCollection(merged_vectors), f, sort_keys=True)
        f.close()
    return merged_vectors


def direction_merge(vectors):
    '''
    对一组向量进行方向合并
    :param vectors: 向量集合
    :return: 四个主方向的向量
    '''
    classify = {'North': [[np.pi / 2, 1]], 'West': [[np.pi, 1]], 'South': [[3 * np.pi / 2, 1]], 'East': [[2 * np.pi, 1]]}
    for vector in vectors:
        if np.pi / 4 <= vector[0] < np.pi * 3 / 4:
            classify['North'].append(vector)
        if 3 * np.pi / 4 <= vector[0] < np.pi * 5 / 4:
            classify['West'].append(vector)
        if 5 * np.pi / 4 <= vector[0] < np.pi * 7 / 4:
            classify['South'].append(vector)
        if 7 * np.pi / 4 <= vector[0] or 0 <= vector[0] < np.pi / 4:
            classify['East'].append(vector)
    for key, vector in classify.items():
        if len(vector) == 1:
            classify[key] = vector[0]
        else:
            x = np.sum([i[1] * np.cos(i[0]) for i in vector])
            y = np.sum([i[1] * np.sin(i[0]) for i in vector])
            classify[key] = [get_vector_direction([0, 0], [x, y]), np.sqrt(x * x + y * y)]
    return classify


def generate_vector_flow():
    with open('north_out_x.json', 'r') as f_e_x:
        with open('north_out_y.json', 'r') as f_e_y:
            with open('south_out_x.json', 'r') as f_w_x:
                with open('south_out_y.json', 'r') as f_w_y:
                    e_x = json.load(f_e_x)['features']
                    e_y = json.load(f_e_y)['features']
                    w_x = json.load(f_w_x)['features']
                    w_y = json.load(f_w_y)['features']
                    value = [[ex['attributes']['Predicted'],
                              ey['attributes']['Predicted'],
                              wx['attributes']['Predicted'],
                              wy['attributes']['Predicted']]
                             for (ex, ey, wx, wy) in zip(e_x, e_y, w_x, w_y)]
                    f_w_y.close()
                f_w_x.close()
            f_e_y.close()
        f_e_x.close()
    result = []
    for v in value:
        for i in v:
            result.append(i)
    with open('north_south.json', 'w', encoding='utf-8') as f:
        json.dump(result, f)


def vector_flow_export(k, max_iteration, w, h, cos_threshold, l, bbox):
    vectors = sites2vector(filename='site_raw_vector.json')
    count = 0
    for vector in vectors.values():
        major_vector = {'in': k_means(vector['in'], k, max_iteration),
                        'out': k_means(vector['out'], k, max_iteration)}
        vector['major_vector'] = major_vector
        count += 1
        print('Major vector finish %d' % count)
    with open('major_vector.json', 'w', newline='', encoding='utf-8') as f:
        major_vectors = [{'loc': vector['loc'], 'major_vector': vector['major_vector']} for vector in vectors.values()]
        json.dump(major_vectors, f)
        f.close()
    # vf = synthesize_vector_flow(major_vectors, bbox, w, h, cos_threshold, l)
    merged_vectors = export_merged_vector('major_vector.json')


if __name__ == '__main__':
    # db_export()
    # vector_flow_export(k=4,
    #                    max_iteration=200,
    #                    w=1000,
    #                    h=500,
    #                    cos_threshold=0.0001,
    #                    l=90,
    #                    bbox=[[120.636690154504251, 27.982619974031067], [120.723288207926046, 28.027239987997554]])
    # export_merged_vector('site_raw_vector.json')
    generate_vector_flow()
