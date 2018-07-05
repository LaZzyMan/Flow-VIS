/* eslint-disable */
import ReactDom from 'react-dom'
import Router from 'router/router'
import 'style/antd.scss'
import React from 'react'
import store from './redux/store'

renderWithHotReload(Router)

if (module.hot) {
  module.hot.accept('./router/router', () => {
    const Router = require('router/router').default
    renderWithHotReload(Router)
  })
}

function renderWithHotReload(RootElement) {
  ReactDom.render(RootElement, document.getElementById('app'),
  )
}
