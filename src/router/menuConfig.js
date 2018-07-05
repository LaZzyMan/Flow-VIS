const sideMenuConfig = [
  {
    name: 'Home',
    path: '/',
    icon: 'home',
    newWindow: false,
    external: false,
  },
  {
    name: 'Test',
    path: '/test',
    icon: 'smile-o',
    children: [
      {
        name: 'Page1',
        path: '/test/page1',
        newWindow: false,
        external: false,
      },
      {
        name: 'page2',
        path: '/test/page2',
        newWindow: false,
        external: false,
      },
    ],
  },
]

export default sideMenuConfig
