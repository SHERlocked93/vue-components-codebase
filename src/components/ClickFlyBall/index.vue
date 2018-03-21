/**
* 创建于 2018/3/21
* 作者: SHERlocked93
* 功能: 点击产生抛物线下落的小球，常用在购物车上
* 参考: https://segmentfault.com/a/1190000013355484
*/


<template>
  <div class='click-fly-ball click-fly-ball-hook' ref='clickFlyBall' @click='generateBall'>
    <h1>点击空白处</h1>
    <div class='garbage' ref='shopcart'>购物车</div>
  </div>
</template>

<script type='text/javascript'>
  export default {
    name: 'click-fly-ball',
    methods: {
      generateBall(ev) {
        const clientDom = document.querySelector('.click-fly-ball-hook')
        this.$nextTick(() => {
          let ball = document.createElement('div')
          const left = ev.clientX
          const top = ev.clientY
          ball.classList.add('ball')
          ball.style.left = `${left - clientDom.offsetLeft}px`
          ball.style.top = `${top - clientDom.offsetTop}px`
          this.$refs.clickFlyBall.append(ball)
          setTimeout(function() {
            ball.style.left = ''
            ball.style.top = ''
            ball.classList.add('run')
          }, 100)
        })
        
      }
    }
  }
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
  .click-fly-ball {
    background-color: rgba(154, 205, 50, .4);
    position: relative;
    height: 80vh;
    cursor: hand;
    
    .garbage {
      z-index: 1200;
      display: table-cell;
      vertical-align: middle;
      position: absolute;
      top: 780px;
      left: 10px;
      text-align: center;
      background-color: deepskyblue;
      height: 25px;
      width: 200px;
    }
    /deep/ .ball {
      z-index: 1000;
      position: absolute;
      height: 10px;
      width: 10px;
      display: inline-block;
      border-radius: 50%;
      background-color: orange;
      transition: left .5s linear, top .5s cubic-bezier(.37, -1.01, .83, .67);
    }
    
    /deep/ .run {
      left: 110px;
      top: 780px;
    }
  }
</style>
