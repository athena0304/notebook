module.exports = {
  title: '前端学习笔记',  // 设置网站标题
  description: '前端学习笔记',
  base: '/notebook/',// 设置站点根路径
  repo: 'git@github.com:athena0304/notebook.git', // 添加 github 链接
  themeConfig: {
    repo: 'athena0304/notebook',
    nav: [
      { text: '教程笔记', link: '/tutorial/' },
      { text: '专题', link: '/subject/' },
      { text: '基础', link: '/basic/' },
      { text: '题', link: '/question/' }
    ],
    sidebar: {
      '/subject/': [
        '',
        'throttle-debouce',
        'examples'
      ],
      '/basic/': [
        ''
      ],
      '/question/': [
        ''
      ],
      '/tutorial/': [
        '',
        'modern-tutorial-part1',
        'modern-tutorial-part2',
        'modern-tutorial-part3'
      ]
    }
  }
}