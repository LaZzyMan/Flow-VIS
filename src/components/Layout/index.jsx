import { Layout, Menu, Icon } from 'antd'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Header from './Header'

const { Sider, Content } = Layout

class AppLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  toggle = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
  }

  render() {
    const { collapsed } = this.state
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header collapsed={collapsed} onClickHandle={this.toggle} />
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    )
  }
}

AppLayout.propTypes = {}

export default AppLayout
