import { Layout, Icon, Menu } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sideMenuConfig from 'router/menuConfig.js'
import { Link } from 'react-router-dom'
import './SideBar.scss'

const { Sider } = Layout
const { SubMenu, MenuItem } = Menu

class SiderBar extends Component {
  constructor(props) {
    super(props)

    const openKeys = this.getOpenKeys()
    this.state = {
      openKeys,
    }
    this.openKeysCache = openKeys
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    })
    this.openKeysCache = openKeys
  };

  getOpenKeys = () => {
    const { match } = this.props
    const matched = match.url
    let openKeys = []
    if (Array.isArray(sideMenuConfig)) {
      sideMenuConfig.forEach((item, index) => {
        if (matched.startsWith(item.path)) {
          openKeys = [`sub${index}`]
        }
      })
    }
    return openKeys
  };

  render() {
    const { openKeys } = this.state
    const { collapsed, location } = this.props
    const { pathname } = location
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo" />
        <Menu theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          openKeys={openKeys}
          defaultSelectedKeys={[pathname]}
          onOpenChange={this.onOpenChange}
        >
          {sideMenuConfig.map((nav, index) => {
            if (nav.children && nav.children.length > 0) {
              return (
                <SubMenu
                  key={`sub${index}`}
                  title={(
                    <span>
                      {nav.icon ? (<Icon type={nav.icon} />) : null}
                      <span>{nav.name}</span>
                    </span>
                    )}
                >
                  {nav.children.map((item) => {
                    const linkProps = {}
                    if (item.newWindow) {
                      linkProps.href = item.path
                      linkProps.target = '_blank'
                    } else if (item.external) {
                      linkProps.href = item.path
                    } else {
                      linkProps.to = item.path
                    }
                    return (
                      <MenuItem key={item.path}>
                        <Link {...linkProps}>{item.name}</Link>
                      </MenuItem>
                    )
                  })}
                </SubMenu>
              )
            }
            const linkProps = {}
            if (nav.newWindow) {
              linkProps.href = nav.path
              linkProps.target = '_blank'
            } else if (nav.external) {
              linkProps.href = nav.path
            } else {
              linkProps.to = nav.path
            }
            return (
              <MenuItem key={nav.path}>
                <Link {...linkProps}>
                  <span>
                    {nav.icon ? (<Icon type={nav.icon} />) : null}
                    <span>{nav.name}</span>
                  </span>
                </Link>
              </MenuItem>
            )
          })}
        </Menu>
      </Sider>
    )
  }
}

SiderBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
}

export default SiderBar
