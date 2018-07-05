import { Layout } from 'antd'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Header from './Header'
import SideBar from './SideBar'

const { Content } = Layout

@withRouter
class AppLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  componentDidMount() {
  }

  toggle = () => {
    this.setState(prevState => ({ collapsed: !prevState.collapsed }))
  }

  render() {
    const { collapsed } = this.state
    const { children, match, location } = this.props
    return (
      <Layout>
        <SideBar collapsed={collapsed} match={match} location={location} />
        <Layout>
          <Header collapsed={collapsed} onClickHandle={this.toggle} />
          <Content style={{
            margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280,
          }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default AppLayout
