<template>
  <div id="app">
    <div class='app-link'>
      <div v-for='item in routesLinks' :key='item.name' v-if='routesLinks.length'>
        <router-link :to='item.path' tag='span' class='app-link-route'>{{item.name}}</router-link>
      </div>
    </div>
    <hr>
    <router-view/>
  </div>
</template>

<script>
  import { routes } from '@/router'
  
  export default {
    name: 'App',
    data() {
      return {}
    },
    computed: {
      routesLinks() {
        return routes
      }
    },
    mounted() {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 15px;
    
    .app-link {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      color: #41b883;
      justify-content: center;
      cursor: pointer;
      
      .app-link-route {
        margin: 2px 7px;
      }
    }
    
  }
</style>
