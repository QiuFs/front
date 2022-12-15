import Vue from 'vue'
import Router from 'vue-router'
import $cookie from '../api/cookie.js'
import store from '../store/index.js'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      component: () => import('../view/errorPage/404')
    },
    {
      path: '/',
      component: () => import('../view/index')
    },
    {
      path: '/index',
      component: () => import('../view/index')
    },
    {
      path: '/notice',
      component: () => import('../view/home/notice')
    },
    {
      name: 'notice-detail',
      path: '/notice-detail',
      component: () => import('../view/home/noticeDetail')
    },
    {
      path: '/free-lesson',
      component: () => import('../view/home/freeLesson')
    },
    {
      path: '/free-listen',
      component: () => import('../view/home/study/freeListen')
    },
    {
      path: '/problem',
      component: () => import('../view/home/problem')
    },
    {
      path: '/about',
      component: () => import('../view/home/about')
    },
    {
      path: '/findpass',
      component: () => import('../view/home/findpass')
    },
    {
      path: '/continue',
      component: () => import('../view/home/study/continue'),
      redirect: '/study',
      children: [
        {
          path: '/chapter/:id',
          component: () => import('../view/home/study/chapter'),
          meta: {
            check: true
          }
        },
        {
          path: '/study',
          component: () => import('../view/home/study/study'),
          redirect: '/my-index',
          children: [
            {
              path: '/my-index',
              component: () => import('../view/home/study/myIndex'),
              meta: {
                check: true
              }
            },
            {
              path: '/my-course',
              component: () => import('../view/home/study/myCourse'),
              meta: {
                check: true
              }
            },
            {
              path: '/setting',
              component: () => import('../view/home/study/setting'),
              meta: {
                check: true
              }
            }
          ]
        },
        {
          path: '/test/:id',
          component: () => import('../view/home/study/test'),
          meta: {
            check: true
          }
        },
        {
          path: '/listen',
          component: () => import('../view/home/study/listen'),
          meta: {
            check: true
          }
        }
      ]
    },
  ]
})

export default router

router.beforeEach((to, from, next) => {
  if (to.meta.check) {
    if ($cookie.getCookie('userName')) {
      next()
    } else {
      store.commit('setUser')
      Message.info('请先登陆')
      router.push('/')
    }
  } else {
    next()
  }
})
