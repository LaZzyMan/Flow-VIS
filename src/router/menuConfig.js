import Home from '@material-ui/icons/Home'
import Dashboard from '@material-ui/icons/Dashboard'
import Home from 'pages/Home'
import NotFound from 'pages/NotFound'

const sideMenuConfig = [
  {
    path: '/',
    sidebarName: 'Home',
    navbarName: 'Home',
    icon: Home,
    component: Home,
  },
  {
    name: 'Test',
    path: '/test',
    icon: 'yonghu',
    children: [
      {
        name: 'Page1',
        path: '/test/page1',
      },
      {
        name: 'page2',
        path: '/test/page2',
      },
    ],
  },
]

export { headerMenuConfig, sideMenuConfig }
