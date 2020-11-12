import Vue from 'vue'
import Router from 'vue-router'
import AdminHome from '@/components/AdminHome'
import RedPacketCreate from '@/components/RedPacketCreate'

Vue.use(Router)

export default new Router({
  mod: 'history',
  routes: [
    {
      path: '/',
      name: 'AdminHome',
      component: AdminHome,
      children: [
        {
          path: '/RedPacketCreate',
          name: 'RedPacketCreate',
          component: RedPacketCreate
        }
      ]
    }
  ]
})
