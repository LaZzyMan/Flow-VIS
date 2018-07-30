import { Card, Slider } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './ParticleSetting.scss'

class ParticleSetting extends Component {
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
            defaultValue={strength.trajectoryField}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { trajectoryField: value }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Road Gravity</span>
          <Slider className="ps-slider"
            defaultValue={strength.roadGravity}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { roadGravity: value }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Road Guide</span>
          <Slider className="ps-slider"
            defaultValue={strength.roadGuide}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { roadGuide: value }),
            )}
          />
        </Card.Grid>
        <Card.Grid className="ps-card-grid">
          <span className="ps-title">Resistance</span>
          <Slider className="ps-slider"
            defaultValue={strength.resistance}
            max={100}
            min={0}
            onChange={(value) => onStrengthChanged(
              Object.assign(strength, { resistance: value }),
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
