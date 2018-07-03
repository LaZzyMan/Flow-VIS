import React, { Component } from 'react'
import { increment, decrement, reset } from 'actions/counter'

import { connect } from 'react-redux'

class Counter extends Component {
  render() {
    const {
      counter, cincrement, cdecrement, creset,
    } = this.props
    return (
      <div>
        <div>当前计数为{counter.count}</div>
        <button onClick={() => cincrement()} type="button">自增
        </button>
        <button onClick={() => cdecrement()} type="button">自减
        </button>
        <button onClick={() => creset()} type="button">重置
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter,
})

const mapDispatchToProps = (dispatch) => ({
  cincrement: () => {
    dispatch(increment())
  },
  cdecrement: () => {
    dispatch(decrement())
  },
  creset: () => {
    dispatch(reset())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
