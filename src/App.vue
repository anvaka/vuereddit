<template>
  <div id="app">
    <form action="" @submit.prevent="subredditName = inputModel">
      <input type="text" v-model='inputModel'>
    </form>
    <subreddit :name='subredditName' class='right-aligned' :showFirst=10></subreddit>
    <subreddit name='javascript'></subreddit>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Subreddit from './components/Subreddit.vue'

export default defineComponent({
  name: 'App',
  components: {
    Subreddit
  },
  data() {
    const subredditName = 'programming';
    return {
      subredditName,
      inputModel: subredditName,
    };
  }
})
</script>

<style>
/* Styles remain unchanged */
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