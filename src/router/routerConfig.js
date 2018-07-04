import Home from 'pages/Home'
import NotFound from 'pages/NotFound'
import AsideLayout from 'layouts/AsideLayout'

const routerConfig = [
  {
    path: '/',
    layout: AsideLayout,
    component: Home,
  },
  {
    path: '*',
    layout: AsideLayout,
    component: NotFound,
  },
]

export default routerConfig
