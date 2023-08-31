import VueRouter from 'vue-router'
import commonTable from '@/views/common-table'
import jpgCure from '@/views/jpg-cure'
import learning from '@/views/learning'
const routes = [
  {
    path: '/',
    redirect: '/commonTable',
  },
  {
    path: '/commonTable',
    name: 'commonTable',
    meta: {
      name: '表格示例',
      menu: true,
    },
    component: commonTable,
  },
  {
    path: '/jpgCure',
    name: 'jpgCure',
    meta: {
      name: 'jpgCure',
      menu: true,
    },
    component: jpgCure,
  },
  {
    path: '/learning',
    name: 'learning',
    meta: {
      name: 'learning',
      menu: true,
    },
    component: learning,
  },
  {
    path: '/car',
    name: 'car',
    meta: {
      name: 'car展示',
      menu: true,
    },
    component: () => import('@/views/car'),
  },
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)

  return originalPush.call(this, location).catch((err) => err)
}

VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)

  return originalPush.call(this, location).catch((err) => err)
}

export default routes
