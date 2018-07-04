import { Layout, Icon } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

const { Header } = Layout

class MyHeader extends Component {
  render() {
    const { collapsed, onClickHandle } = this.props
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={onClickHandle}
        />
      </Header>
    )
  }
}

MyHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onClickHandle: PropTypes.func.isRequired,
}

export default MyHeader
