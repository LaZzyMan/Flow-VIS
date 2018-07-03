import React, { Component } from 'react'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
    }
  }

  handleClick() {
    this.setState(prevState => ({ count: prevState.count + 1 }))
  }

  render() {
    const { count } = this.state
    return (
      <div>
                this is home~<br />
                当前计数：{count}<br />
        <button onClick={() => this.handleClick()} type="button">自增</button>
      </div>
    )
  }
}
