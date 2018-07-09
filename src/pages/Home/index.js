import React, { Component, Fragment } from 'react'
import autobind from 'react-autobind'
import MapView from 'components/MapView'
import DashBoard from 'components/DashBoard'


export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: [
        { name: 'Station Layer', enable: true },
        { name: 'Voronoi Layer', enable: true },
        { name: 'Road Layer', enable: true },
      ],
    }
    autobind(this)
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

  render() {
    const { settings } = this.state
    return (
      <Fragment>
        <MapView settings={settings} />
        <DashBoard settings={settings} onSwitchChanged={this.onSwitchChanged} />
      </Fragment>
    )
  }
}
