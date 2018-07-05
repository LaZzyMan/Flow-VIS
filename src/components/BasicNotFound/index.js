import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const styles = {
  notfoundContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '500px',
  },
  imgNotfound: {
    marginRight: '50px',
  },
  title: {
    color: '#333',
    fontSize: '24px',
    margin: '20px 0',
  },
  description: {
    color: '#666',
    fontSize: '16px',
  },
}

class BasicNotFound extends Component {
  static displayName = 'BasicNotFound';

  render() {
    return (
      <div className="basic-not-found">
        <div style={styles.notfoundContent}>
          <img
            src="../../icons/404.png"
            style={styles.imgNotfound}
            alt="页面不存在"
          />
          <div className="prompt">
            <h3 style={styles.title}>抱歉，你访问的页面不存在</h3>
            <p style={styles.description}>
                您要找s的页面没有找到，请返回<Link to="/">首页</Link>继续浏览
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default BasicNotFound
