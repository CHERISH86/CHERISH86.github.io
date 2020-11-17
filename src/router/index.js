import Vue from 'vue'
import Router from 'vue-router'
import AdminHome from '@/components/AdminHome'
import RedPacketCreate from '@/components/RedPacketCreate'
import BasicMes from '@/components/BasicMes'
import StatusSet from '@/components/StatusSet'
import Progress from '@/components/Progress'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AdminHome',
      component: AdminHome,
      redirect: '/BasicMes',
      children: [
        {
          path: '/RedPacketCreate',
          name: 'RedPacketCreate',
          component: RedPacketCreate
        },
        {
          path: '/BasicMes',
          name: '/BasicMes',
          component: BasicMes
        },
        {
          path: '/StatusSet',
          name: '/StatusSet',
          component: StatusSet
        },
        {
          path: '/Progress',
          name: '/Progress',
          component: Progress
        }
      ]
    }
  ]
})
