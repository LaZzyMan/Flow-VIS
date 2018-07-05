import { Layout, Icon } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Header.scss'

const { Header } = Layout

class MyHeader extends Component {
  openGithub = () => {
    window.open('https://github.com/LaZzyMan/Flow-VIS', '_blank')
  }

  render() {
    const { collapsed, onClickHandle } = this.props
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={onClickHandle}
        />
        <Icon className="github" type="github" onClick={this.openGithub} />
      </Header>
    )
  }
}

MyHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onClickHandle: PropTypes.func.isRequired,
}

export default MyHeader
