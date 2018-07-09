import React, { Component } from 'react'
import autobind from 'react-autobind'
import MapView from 'components/MapView'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    autobind(this)
  }

  render() {
    return (
      <MapView />
    )
  }
}
