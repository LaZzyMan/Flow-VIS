import React, { Component } from 'react'
import ReactMapGL from 'react-map-gl'
import autobind from 'react-autobind'
import TWEEN from 'tween.js'

const animate = () => {
  TWEEN.update()
  window.requestAnimationFrame(animate)
}
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
        zoom: 12,
        maxZoom: 16,
        pitch: 37.11535300402728,
        bearing: -0.6424747174301046,
        interactive: true,
      },
    }
    autobind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
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
    return (
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/hideinme/cj9ydelgj7jlo2su9opjkbjsu"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this.updateViewport}
      />
    )
  }
}
