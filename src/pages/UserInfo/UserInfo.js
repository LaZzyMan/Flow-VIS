import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUserInfo } from 'actions/userInfo'

class UserInfo extends Component {
  render() {
    const { userInfo, getUser } = this.props
    const { user, isLoading, errorMsg } = userInfo
    return (
      <div>
        {
          isLoading ? '请求信息中......'
            : (
              errorMsg || (
              <div>
                <p>用户信息：</p>
                <p>用户名：{user.name}</p>
                <p>介绍：{user.intro}</p>
              </div>
              )
            )
        }
        <button onClick={() => getUser()} type="button">请求用户信息</button>
      </div>
    )
  }
}

export default connect((state) => ({ userInfo: state.userInfo }), { getUserInfo })(UserInfo)
