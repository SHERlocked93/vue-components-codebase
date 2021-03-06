import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from 'components/HelloWorld'
import DraggableProgressbar from 'components/DraggableProgressbar'
import ClickFlyBall from 'components/ClickFlyBall'
import MultiSelect from 'components/SimpleManage'

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
  },
  {
    path: '/multiSelect',
    name: '多项选择组件+基础分页组件',
    component: MultiSelect
  }

]


export default new Router({ routes })
