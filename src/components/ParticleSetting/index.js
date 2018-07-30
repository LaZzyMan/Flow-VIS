import { Card, Slider } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ParticleSetting.scss'

class ParticleSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      strength, onStrengthChanged,
    } = this.props
    return (
      <Card title="Particle Simulation"
        bordered={false}
        hoverable
        className="ps-card"
      >
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Trajectory Field</span>
          <Slider className="ps-slider"
            defaultValue={strength.trajectoryField * 100}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { trajectoryField: value / 100 }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Road Gravity</span>
          <Slider className="ps-slider"
            defaultValue={strength.roadGravity * 100}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { roadGravity: value / 100 }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Road Guide</span>
          <Slider className="ps-slider"
            defaultValue={strength.roadGuide * 100}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { roadGuide: value / 100 }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Resistance</span>
          <Slider className="ps-slider"
            defaultValue={strength.resistance * 100}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { resistance: value / 100 }),
            )}
          />
        </Card.Grid>
      </Card>
    )
  }
}

ParticleSetting.propTypes = {
  strength: PropTypes.object.isRequired,
  onStrengthChanged: PropTypes.func.isRequired,
}

export default ParticleSetting
