import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'
import { message } from 'antd'
import DeckGL, { GeoJsonLayer } from 'deck.gl'
import { isWebGL2, registerShaderModules } from 'luma.gl'
import TWEEN from 'tween.js'
import PropTypes from 'prop-types'
import { hex2Rgba, getBounds } from '../../utils'
import {
  getRoad, getStation, getPolygon, getTexture,
} from '../../api'
import fsfp32 from '../../shaderlib/fs-fp32'
import fsproject from '../../shaderlib/fs-project'
import fslighting from '../../shaderlib/fs-lighting'
import ParticleLayer from './ParticleLayer'
import './MapView.scss'

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
        // interactive: true,
      },
      webGL2Supported: true,
      data: null,
    }
    autobind(this)
    const particleState = { particleTime: 0 }
    this.particleAnimation = new TWEEN.Tween(particleState)
      .to({ particleTime: 60 }, 1000)
      .onUpdate(() => this.setState(particleState))
      .repeat(Infinity)
  }

  componentDidMount() {
    const { settings } = this.props
    message.loading('Loading Data..', 0)
      .then(() => message.success('Loading finished', 2.5))
    window.addEventListener('resize', this.onResize.bind(this))
    this.onResize()
    this.loadData()
    if (settings[3].enable) {
      this.particleAnimation.start()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { settings } = nextProps
    if (settings[3].enable) {
      this.particleAnimation.start()
    } else {
      this.particleAnimation.stop()
    }
  }

  componentWillUnmount() {
    this.particleAnimation.stop()
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
    const that = this
    Promise.all([getRoad({}), getStation({}), getPolygon({}), getTexture({})])
      .then(([roads, stations, polygons, textures]) => {
        message.destroy()
        this.setState({
          data: {
            roadData: roads,
            voronoi: polygons,
            station: stations,
            texData: textures,
          },
        })
        that.onResize()
      }).catch(() => {
        message.destroy()
        that.onResize()
      })
  }

  updateViewport = (viewport) => {
    this.setState((prevState) => ({ viewport: { ...prevState.viewport, ...viewport } }))
  }

  render() {
    const {
      viewport, webGL2Supported, data,
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
    let layers = []
    if (data) {
      const {
        roadData, station, voronoi, texData,
      } = data
      layers = [
        settings[1].enable && new GeoJsonLayer({
          id: 'voronoi-layer',
          data: voronoi,
          pickable: true,
          stroked: true,
          filled: false,
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
        settings[3].enable && new ParticleLayer({
          id: 'particle-layer',
          fp64: true,
          bbox: {
            minLng: 120.636690154504251,
            maxLng: 120.723288207926046,
            minLat: 27.982619974031067,
            maxLat: 28.027239987997554,
          },
          textureSize: { height: 88, width: 173 },
          texData,
          bounds: getBounds(texData),
        }),
      ]
    }
    return (

      <ReactMapGL
        className="map-view"
        {...viewport}
        mapStyle="mapbox://styles/hideinme/cjjo0icb95w172slnj93q6y31"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        dragRotate
        onViewportChange={v => this.updateViewport(v)}
      >
        <DeckGL
          {...viewport}
          layers={layers}
          onWebGLInitialized={this.onWebGLInitialized}
        />
      </ReactMapGL>

    )
  }
}

MapView.propTypes = {
  settings: PropTypes.array.isRequired,
}

export default MapView
