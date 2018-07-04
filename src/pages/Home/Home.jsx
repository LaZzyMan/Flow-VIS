import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGlkZWlubWUiLCJhIjoiY2o4MXB3eWpvNnEzZzJ3cnI4Z3hzZjFzdSJ9.FIWmaUbuuwT2Jl3OcBx1aQ'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        width: 500,
        height: 500,
        longitude: 120.68,
        latitude: 28.0,
        zoom: 4,
        maxZoom: 16,
        pitch: 37.11535300402728,
        bearing: -0.6424747174301046,
      },
    }
    autobind(this)
  }

  componentDidMount() {

  }

  updateViewport(viewport) {
    this.setState((prevState) => ({ ...prevState, ...viewport }))
  }

  render() {
    const { viewport } = this.state
    return (
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this.updateViewport}
      />
    )
  }
}
