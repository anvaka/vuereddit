<template>
  <div id="app">
    <form action="" @submit.prevent="subredditName = inputModel">
      <input type="text" v-model='inputModel'>
    </form>
    <subreddit :name='subredditName' class='right-aligned'></subreddit>
    <subreddit name='javascript'></subreddit>
  </div>
</template>

<script>

import Subreddit from './components/Subreddit'

export default {
  name: 'App',
  data() {
    const subredditName = 'programming';
    return {
      subredditName,
      inputModel: subredditName,
    };
  },

  components: {
    Subreddit
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.right-aligned {
  position: absolute;
  right: 0;
  width: 400px;
  top: 0;
  bottom: 0;
}
</style>
