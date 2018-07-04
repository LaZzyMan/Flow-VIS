const headerMenuConfig = [
  {
    name: '首页',
    path: '/',
    icon: 'home',
  },
  {
    name: '反馈',
    path: 'https://github.com/alibaba/ice',
    external: true,
    newWindow: true,
    icon: 'message',
  },
  {
    name: '帮助',
    path: 'https://alibaba.github.io/ice',
    external: true,
    newWindow: true,
    icon: 'bangzhu',
  },
]

const sideMenuConfig = [
  {
    name: 'Home',
    path: '/',
    icon: 'home',
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
