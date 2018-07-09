import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'
import DeckGL, { GeoJsonLayer, MapController } from 'deck.gl'
import TWEEN from 'tween.js'
import { hex2Rgba } from '../../utils'

const roadData = require('../../data/road_selected.geojson')

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
    this.updateViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  updateViewport(viewport) {
    this.setState((prevState) => ({ viewport: { ...prevState.viewport, ...viewport } }))
  }

  render() {
    const { viewport } = this.state
    const layers = [
      new GeoJsonLayer({
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
    ]
    return (
      <ReactMapGL
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

export default MapView
