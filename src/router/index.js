import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from 'components/HelloWorld'
import haha from 'components/haha'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/haha',
    name: 'haha',
    component: haha
  }
]


export default new Router({ routes })
