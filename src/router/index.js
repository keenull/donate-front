import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import { Message } from 'element-ui';
import index from '@/page/index'
import login from '@/page/login'
import register from '@/page/register'
import record from '@/page/user/donationrecord'
import forhelp from '@/page/user/forhelp'
import home from '@/page/user/home'
import personhelp from '@/page/user/personhelp'
import applydetail from '@/page/user/applydetail'
import publicdetail from '@/page/user/publicdetail'
import personapply from '@/page/user/personapply'
import persondonate from '@/page/user/persondonate'
import qualificate from '@/page/user/qualificate'
import publicproject from '@/page/user/publicproject'
import alipay from '@/page/user/alipay'
import personfinished from '@/page/user/personfinished'
import publicfinished from '@/page/user/publicfinished'

import admin from '@/page/admin/admin'
import adminlist from '@/page/admin/adminlist'
import bulletin from '@/page/admin/bulletin'
import donatecount from '@/page/admin/donatecount'
import donatelist from '@/page/admin/donatelist'
import personunverified from '@/page/admin/personunverified'
import personverified from '@/page/admin/personverified'
import publicunverified from '@/page/admin/publicunverified'
import adminQualificate from '@/page/admin/adminQualificate'
import adminperson from '@/page/admin/adminperson'
import adminpublic from '@/page/admin/adminpublic'
import publicverified from '@/page/admin/publicverified'
import userlist from '@/page/admin/userlist'
import role from '@/page/admin/role'
import permission from '@/page/admin/permission'
import donateanalysis from '@/page/admin/donateanalysis'
import applyanalysis from '@/page/admin/applyanalysis'
import { getCookie } from '../utils/util'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/home',
      component: login,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/index',
      name: '',
      component: index,
      children: [{
        path: '/home',
        name: '首页',
        component: home,
        meta: {
          requireAuth: false
        }
      },
        {
          path: '/record',
          name: '捐款记录',
          component: record,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/forhelp',
          name: '申请求助',
          component: forhelp,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/applydetail',
          name: '求助详情',
          component: applydetail,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicdetail',
          name: '求助详情',
          component: publicdetail,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/personhelp',
          name: '个人求助',
          component: personhelp,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicproject',
          name: '公益项目',
          component: publicproject,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/alipay',
          name: '支付宝',
          component: alipay,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/personapply',
          name: '求助记录',
          component: personapply,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/persondonate',
          name: '捐赠记录',
          component: persondonate,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/qualificate',
          name: '资质审核',
          component: qualificate,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/personfinished',
          name: '个人完成捐赠',
          component: personfinished,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicfinished',
          name: '公益完成捐赠',
          component: publicfinished,
          meta: {
            requireAuth: false
          }
        }
        ]
    },
    {
      path: '/admin',
      name: '后台首页',
      component: admin,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/adminQualificate',
      name: '后台审核',
      component: adminQualificate,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/adminperson',
      name: '后台个人申请审核',
      component: adminperson,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/adminpublic',
      name: '后台公益申请审核',
      component: adminpublic,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/manage',
      name: 'manage',
      component: admin,
      children: [{
        path: 'system/role',
        component: role
      },{
        path: 'system/permission',
        component: permission
      },{
        path: 'user/userlist',
        component: userlist
      }, {
        path: 'user/adminlist',
        component: adminlist
      }, {
        path: 'public/verified',
        component: publicverified
      }, {
        path: 'public/unverfied',
        component: publicunverified
      }, {
        path: 'person/verified',
        component: personverified
      }, {
        path: 'person/unverfied',
        component: personunverified
      }, {
        path: 'donate/list',
        component: donatelist
      }, {
        path: 'donate/count',
        component: donatecount
      },{
        path: 'analysis/donateanalysis',
        component: donateanalysis
      },{
        path: 'analysis/applyanalysis',
        component: applyanalysis
      },{
        path: 'manage/bulletin',
        component: bulletin
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/forhelp') {
    if (store.state.user){
      let flag = store.state.user.passed
      flag === 1 ? next() : Message.warning('您尚未申请审核')
    }else {
      router.push({path: '/login'})
    }
  } else if (to.meta.requireAuth || to.path.indexOf("manage") != -1) {
    let flag = getCookie('token')
    flag ? next() : router.push({path: '/login'})
  } else {
    next()
  }
})

export default router
