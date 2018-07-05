import { Layout, Icon, Menu } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import sideMenuConfig from 'router/menuConfig.js'
import { Link } from 'react-router-dom'
import './SideBar.scss'

const { Sider } = Layout
const { SubMenu } = Menu

class SideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { collapsed, location } = this.props
    const { pathname } = location
    const menu = sideMenuConfig.map((nav, index) => {
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
                <Menu.Item key={item.path}>
                  <Link {...linkProps}>{item.name}</Link>
                </Menu.Item>
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
        <Menu.Item key={nav.path}>
          <Link {...linkProps}>
            <span>
              {nav.icon ? (<Icon type={nav.icon} />) : null}
              <span>{nav.name}</span>
            </span>
          </Link>
        </Menu.Item>
      )
    })
    console.log(menu)
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
          defaultSelectedKeys={[pathname]}
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
                      <Menu.Item key={item.path}>
                        <Link {...linkProps}>{item.name}</Link>
                      </Menu.Item>
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
              <Menu.Item key={nav.path}>
                <Link {...linkProps}>
                  <span>
                    {nav.icon ? (<Icon type={nav.icon} />) : null}
                    <span>{nav.name}</span>
                  </span>
                </Link>
              </Menu.Item>
            )
          })}
        </Menu>
      </Sider>
    )
  }
}

SideBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
}

export default SideBar
