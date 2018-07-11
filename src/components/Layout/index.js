import { Layout } from 'antd'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Header from './Header'
import SideBar from './SideBar'
import { toggleResize } from '../../utils'

const { Content } = Layout

@withRouter
class AppLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
    }
  }

  componentDidMount() {
  }

  toggle = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
    toggleResize()
  }

  render() {
    const { collapsed } = this.state
    const { children, match, location } = this.props
    return (
      <Layout>
        <SideBar collapsed={collapsed} match={match} location={location} />
        <Layout>
          <Header collapsed={collapsed} onClickHandle={this.toggle} />
          <Content id="layout-content">
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default AppLayout
