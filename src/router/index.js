import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from 'components/HelloWorld'
import DraggableProgressbar from 'components/DraggableProgressbar'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/draggableProgressbar',
    name: '可拖拽进度条',
    component: DraggableProgressbar
  }
]


export default new Router({ routes })
