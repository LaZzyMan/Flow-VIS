import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'
import { Spin } from 'antd'
import DeckGL, { GeoJsonLayer, MapController } from 'deck.gl'
import { isWebGL2, registerShaderModules } from 'luma.gl'
import TWEEN from 'tween.js'
import PropTypes from 'prop-types'
import { hex2Rgba } from '../../utils'
import './MapView.scss'
import { getRoad, getStation, getPolygon } from '../../api'

import fsfp32 from '../../shaderlib/fs-fp32'
import fsproject from '../../shaderlib/fs-project'
import fslighting from '../../shaderlib/fs-lighting'

registerShaderModules([fsfp32, fsproject, fslighting])

// const roadData = require('../../data/road_selected.geojson')
// const station = require('../../data/site_point_selected.geojson')
// const voronoi = require('../../data/site_polygon_selected.geojson')

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
      webGL2Supported: true,
      isLoading: true,
      roadData: null,
      station: null,
      voronoi: null,
    }
    autobind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    this.loadData()
    animate()
  }

  onResize() {
    const contentElement = document.getElementById('layout-content')
    this.updateViewport({
      width: contentElement.clientWidth,
      height: contentElement.clientHeight,
    })
  }

  onWebGLInitialized = (gl) => {
    const webGL2Supported = isWebGL2(gl)
    this.setState({ webGL2Supported })
  }

  loadData = () => {
    const { isLoading } = this.state
    getRoad({}).then(response => {
      this.setState({ roadData: response.data })
      if (isLoading) {
        this.setState({ isLoading: false })
      }
    }).catch(() => {
      if (isLoading) {
        this.setState({ isLoading: false })
      }
    })
    getStation({}).then(response => {
      this.setState({ station: response.data })
    }).catch(() => {
      if (isLoading) {
        this.setState({ isLoading: false })
      }
    })
    getPolygon({}).then(response => {
      this.setState({ voronoi: response.data })
    }).catch(() => {
      if (isLoading) {
        this.setState({ isLoading: false })
      }
    })
  }

  updateViewport = (viewport) => {
    this.setState((prevState) => ({ viewport: { ...prevState.viewport, ...viewport } }))
  }

  render() {
    const {
      viewport, webGL2Supported, isLoading, roadData, station, voronoi,
    } = this.state
    if (!webGL2Supported) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <h2> {"THIS DEMO REQUIRES WEBLG2, BUT YOUR BRWOSER DOESN'T SUPPORT IT"} </h2>
        </div>
      )
    }
    const { settings } = this.props
    const layers = [
      settings[1].enable && voronoi !== null && new GeoJsonLayer({
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
      settings[2].enable && roadData !== null && new GeoJsonLayer({
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
      settings[0].enable && station !== null && new GeoJsonLayer({
        id: 'station-layer',
        data: station,
        pickable: true,
        fp64: true,
        getFillColor: hex2Rgba('#aa4b6b', 200),
        getRadius: 5,
      }),
    ]
    return (
      <Spin spinning={isLoading}>
        <ReactMapGL
          className="map-view"
          {...viewport}
          mapStyle="mapbox://styles/hideinme/cj9ydelgj7jlo2su9opjkbjsu"
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={v => this.updateViewport(v)}
        >
          <DeckGL
            {...viewport}
            layers={layers}
            controller={MapController}
            onWebGLInitialized={this.onWebGLInitialized}
          />
        </ReactMapGL>
      </Spin>
    )
  }
}

MapView.propTypes = {
  settings: PropTypes.array.isRequired,
}

export default MapView
