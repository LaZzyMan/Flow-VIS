import React, { Component, Fragment } from 'react'
import autobind from 'react-autobind'
import MapView from 'components/MapView'
import DashBoard from 'components/DashBoard'
import ParticleSetting from 'components/ParticleSetting'
import { toggleResize } from '../../utils'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: [
        { name: 'Station Layer', enable: true },
        { name: 'Voronoi Layer', enable: true },
        { name: 'Road Layer', enable: false },
        { name: 'Particle Layer', enable: false },
        { name: 'Direction Layer', enable: false },
      ],
      strength: {
        resistance: 0.5,
        roadGuide: 0.5,
        roadGravity: 0.5,
        trajectoryField: 0.5,
      },
    }
    autobind(this)
  }

  componentDidMount() {
    toggleResize()
  }

  onSwitchChanged = (checked, name) => {
    this.setState((prevState) => ({
      settings: prevState.settings.map((setting) => {
        if (setting.name !== name) {
          return setting
        }
        return Object.assign(setting, { enable: checked })
      }),
    }))
  }

  onStrengthChanged = (strength) => {
    this.setState((prevState) => ({ viewport: { ...prevState.strength, ...strength } }))
  }

  render() {
    const { settings, strength } = this.state
    return (
      <Fragment>
        <MapView settings={settings} strength={strength} />
        <DashBoard settings={settings} onSwitchChanged={this.onSwitchChanged} />
        {settings[3].enable && (
        <ParticleSetting
          strength={strength}
          onStrengthChanged={this.onStrengthChanged}
        />)}
      </Fragment>
    )
  }
}
