import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import Layout from 'components/Layout'

const routerConfig = [
  {
    path: '/',
    layout: Layout,
    component: Home,
  },
  {
    path: '*',
    layout: Layout,
    component: NotFound,
  },
]

export default routerConfig
