import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'
import DeckGL, { GeoJsonLayer, MapController } from 'deck.gl'
import TWEEN from 'tween.js'
import { hex2Rgba } from '../../utils'
import './MapView.scss'
import PropTypes from 'prop-types'

const roadData = require('../../data/road_selected.geojson')
const station = require('../../data/site_point_selected.geojson')
const voronoi = require('../../data/site_polygon_selected.geojson')

const roadColorMap = [
  hex2Rgba('#CB3466', 255),
  hex2Rgba('#CB4D34', 255),
  hex2Rgba('#CB9934', 255),
  hex2Rgba('#B2CB34', 255),
  hex2Rgba('#66CB34', 255),
]

const animate = () => {
  TWEEN.update()
  window.requestAnimationFrame(animate)
}
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGlkZWlubWUiLCJhIjoiY2o4MXB3eWpvNnEzZzJ3cnI4Z3hzZjFzdSJ9.FIWmaUbuuwT2Jl3OcBx1aQ' // eslint-disable-line

class MapView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        width: 500,
        height: 500,
        longitude: 120.68,
        latitude: 28.0,
        zoom: 14,
        maxZoom: 16,
        pitch: 37.11535300402728,
        bearing: -0.6424747174301046,
        interactive: true,
      },
    }
    autobind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    animate()
  }

  onResize() {
    const contentElement = document.getElementById('layout-content')
    this.updateViewport({
      width: contentElement.clientWidth,
      height: contentElement.clientHeight,
    })
  }

  updateViewport(viewport) {
    this.setState((prevState) => ({ viewport: { ...prevState.viewport, ...viewport } }))
  }

  render() {
    const { viewport } = this.state
    const { settings } = this.props
    const layers = [
      settings[1].enable && new GeoJsonLayer({
        id: 'voronoi-layer',
        data: voronoi,
        pickable: true,
        stroked: true,
        filled: true,
        lineJointRounded: true,
        fp64: true,
        getFillColor: hex2Rgba('#3b8d99', 100),
        getLineColor: hex2Rgba('#3b8d99', 255),
        getLineWidth: 1,
      }),
      settings[2].enable && new GeoJsonLayer({
        id: 'road-layer',
        data: roadData,
        pickable: true,
        stroked: true,
        lineJointRounded: true,
        fp64: true,
        getLineColor: f => roadColorMap[Number(f.properties.FuncClass) - 1],
        getLineWidth: f => Number(f.properties.Width),
        lineWidthMinPixels: 0.5,
        lineWidthMaxPixels: 2,
      }),
      settings[0].enable && new GeoJsonLayer({
        id: 'station-layer',
        data: station,
        pickable: true,
        fp64: true,
        getFillColor: hex2Rgba('#aa4b6b', 200),
        getRadius: 5,
      }),
    ]
    return (
      <ReactMapGL
        className="map-view"
        {...viewport}
        mapStyle="mapbox://styles/hideinme/cj9ydelgj7jlo2su9opjkbjsu"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this.updateViewport}
      >
        <DeckGL {...viewport} layers={layers} controller={MapController} />
      </ReactMapGL>
    )
  }
}

MapView.propTypes = {
  settings: PropTypes.array.isRequired,
}

export default MapView
