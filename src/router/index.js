import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from 'components/HelloWorld'
import DraggableProgressbar from 'components/DraggableProgressbar'
import ClickFlyBall from 'components/ClickFlyBall'

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
  },
  {
    path: '/clickflyball',
    name: '点击产生抛物线小球',
    component: ClickFlyBall
  }
]


export default new Router({ routes })
