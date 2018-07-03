/* eslint-disable */
import ReactDom from 'react-dom'
import { getRouter, AppContainer, Provider } from 'router/router'
import React from 'react'
import store from './redux/store'

renderWithHotReload(getRouter())

if (module.hot) {
  module.hot.accept('./router/router', () => {
    const getRouter = require('router/router').default
    renderWithHotReload(getRouter())
  })
}

function renderWithHotReload(RootElement) {
  ReactDom.render(
    <AppContainer>
      <Provider store={store}>
        {RootElement}
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  )
}
