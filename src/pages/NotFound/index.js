import React, { Component } from 'react'
import BasicNotFound from 'components/BasicNotFound'
import './NotFound.scss'

class NotFound extends Component {
  static displayName = 'NotFound';

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="not-found-page">
        <BasicNotFound />
      </div>
    )
  }
}

export default NotFound
