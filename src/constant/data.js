// 菜单
export const menus = [
  {
    id: 100,
    name: '首页',
    url: '/home'
  },
  {
    id: 200,
    name: '个人求助',
    url: '/personhelp'
  },
  {
    id: 300,
    name: '公益项目',
    url: '/publicproject'
  },
  {
    id: 400,
    name: '捐款记录',
    url: '/record'
  },
  {
    id: 500,
    name: '已完成捐赠',
    url: '/personfinished'
  },
  {
    id: 600,
    name: '申请求助',
    url: '/forhelp'
  }
]

// 未登录菜单
export const notLogin = [
  {
    id: 100,
    name: '登录',
    url: 'login'
  },
  {
    id: 200,
    name: '注册',
    url: '/register'
  }
]

// 首页轮播图
export const carouselImg = [
  {
    id: '1',
    url: 'static/image/lbt1.png',
    introduction: '积小善成大爱，进入99公益日主会场 '
  },
  {
    id: '2',
    url: 'static/image/lbt2.jpg',
    introduction: ' 2019校园公益 '
  },
  {
    id: '3',
    url: 'static/image/lbt3.jpg',
    introduction: '益视频 | "教育界诺贝尔奖”试验：不让穷妈妈养出穷孩子'
  },
  {
    id: '4',
    url: 'static/image/lbt4.jpg',
    introduction: '在微澜图书馆，为流动儿童打开一扇窗'
  },
  {
    id: '5',
    url: 'static/image/lbt5.jpg',
    introduction: '2000北漂打工子弟在这改变命运，十多名留学海外'
  }
]

// 捐赠金额
export const donationAmount = [
  {id: 1, amount: '￥ 0.10'}, {id: 2, amount: '￥ 10.00'}, {id: 3, amount: '￥ 50.00'},
  {id: 4, amount: '￥ 100.00'}, {id: 5, amount: '自定义金额'}
]

// 编辑器工具栏
export const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'], // 引用，代码块
  [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
  [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
  [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
  [{ 'direction': 'rtl' }], // 文本方向
  // [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
  [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
  // [{ 'font': [] }], // 字体
  // [{ 'align': [] }], // 对齐方式
  // ['image', 'video'], // 上传图片、上传视频
  ['clean'] // 清除字体样式
]

export const navbar = [
  {
    name: '系统管理',
    icon: 'el-icon-setting',
    children: [
      {
        name: '权限管理',
        path: '/manage/system/permission'
      },
      {
        name: '角色管理',
        path: '/manage/system/role'
      }
    ]
  },
  {
    name: '用户管理',
    icon: 'el-icon-setting',
    children: [
      {
        name: '注册用户',
        path: '/manage/user/userlist'
      },
      {
        name: '后台管理员',
        path: '/manage/user/adminlist'
      }
    ]
  },
  {
    name: '公益项目',
    icon: 'el-icon-view',
    children: [
      {
        name: '已通过审核',
        path: '/manage/public/verified'
      },
      {
        name: '未通过审核',
        path: '/manage/public/unverfied'
      }
    ]
  },
  {
    name: '个人求助管理',
    icon: 'el-icon-edit',
    children: [
      {
        name: '已通过审核',
        path: '/manage/person/verified'
      },
      {
        name: '未通过审核',
        path: '/manage/person/unverfied'
      }
    ]
  },
  {
    name: '捐款管理',
    icon: 'el-icon-edit-outline',
    children: [
      {
        name: '捐款统计',
        path: '/manage/donate/list'
      },
      {
        name: '捐款列表',
        path: '/manage/donate/count'
      }
    ]
  },
  {
    name: '公告管理',
    icon: 'el-icon-bell',
    children: [
      {
        name: '公告管理',
        path: '/manage/manage/bulletin'
      }
    ]
  },
  {
    name: '图表分析',
    icon: 'el-icon-edit-outline',
    children: [
      {
        name: '申请分析',
        path: '/manage/analysis/applyanalysis'
      },
      {
        name: '捐赠分析',
        path: '/manage/analysis/donateanalysis'
      }
    ]
  }
]
