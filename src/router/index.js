import Vue from 'vue'
import Router from 'vue-router'
import AdminHome from '@/components/AdminHome'
import RedPacketCreate from '@/components/RedPacketCreate'
import BasicMes from '@/components/BasicMes'
// import StatusSet from '@/components/StatusSet'
import Progress from '@/components/Progress'
import GrabEnvelope from '@/components/GrabEnvelope'
import EnvelopeRain from '@/components/EnvelopeRain'

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
          path: '/GrabEnvelope',
          name: '/GrabEnvelope',
          component: GrabEnvelope
        },
        {
          path: '/Progress',
          name: '/Progress',
          component: Progress
        }
      ]
    },
    {
      path: '/EnvelopeRain',
      name: 'EnvelopeRain',
      component: EnvelopeRain
    }
  ]
})
