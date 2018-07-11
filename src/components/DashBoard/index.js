import {
  Popover, Button, Icon, List, Switch,
} from 'antd'
import React, { Component } from 'react'
import './DashBoard.scss'
import PropTypes from 'prop-types'

class DashBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { settings, onSwitchChanged } = this.props
    return (
      <Popover trigger="click"
        arrowPointAtCenter
        content={(
          <List itemLayout="horizontal"
            dataSource={settings}
            renderItem={item => (
              <List.Item key={item.name}
                actions={[<Switch checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="cross" />}
                  checked={item.enable}
                  onChange={(checked) => onSwitchChanged(checked, item.name)}
                />]}
              >
                <List.Item.Meta title={item.name} />
              </List.Item>)}
          />)
        }
        title={(
          <span className="dashboard-title">
            <Icon type="setting"
              style={{
                fontSize: 20, marginLeft: '6px', marginTop: '2px', marginRight: '10px',
              }}
            />
            <span style={{ fontSize: 16 }}>Display Settings</span>
          </span>)}
      >
        <Button shape="circle" icon="setting" className="dashboard-button" size="large" />
      </Popover>
    )
  }
}

DashBoard.propTypes = {
  settings: PropTypes.array.isRequired,
  onSwitchChanged: PropTypes.func.isRequired,
}

export default DashBoard
