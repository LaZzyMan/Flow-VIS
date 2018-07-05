import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import AppLayout from 'components/Layout'

const routerConfig = [
  {
    path: '/',
    layout: AppLayout,
    component: Home,
  },
  {
    path: '*',
    layout: AppLayout,
    component: NotFound,
  },
]

export default routerConfig
