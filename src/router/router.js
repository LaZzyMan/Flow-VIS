import {
  BrowserRouter as Router, Route, Switch, Link,
} from 'react-router-dom'
import Loadable from 'react-loadable'
import React from 'react'

const Loading = () => (
  <div>
Loading...
  </div>
)

const Home = Loadable({ loader: () => import('pages/Home/Home'), loading: Loading })
const Page1 = Loadable({ loader: () => import('pages/Page1/Page1'), loading: Loading })
const Counter = Loadable({ loader: () => import('pages/Counter/Counter'), loading: Loading })
const UserInfo = Loadable({ loader: () => import('pages/UserInfo/UserInfo'), loading: Loading })

// const LoadableComponent = Loadable({
//   loader: (component) => (props) => <Component {...props} />,
//   loading: Loading
// })

const getRouter = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">

首页
          </Link>
        </li>
        <li>
          <Link to="/page1">

Page1
          </Link>
        </li>
        <li>
          <Link to="/counter">

Counter
          </Link>
        </li>
        <li>
          <Link to="/userinfo">

UserInfo
          </Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/page1" component={Page1} />
        <Route path="/counter" component={Counter} />
        <Route path="/userinfo" component={UserInfo} />
      </Switch>
    </div>
  </Router>
)

export default getRouter
