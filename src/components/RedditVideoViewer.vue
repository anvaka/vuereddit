<template>
<video controls class='reddit-video'>
  <source :src="dash" type="application/dash+xml">
  <source :src="fallback" type="video/mp4">
</video>
</template>
<script>
export default {
  name: 'RedditVideoViewer',
  props: ['vm'],
  computed: {
    dash() {
      return this.getVideoSource().dash_url;
    },
    fallback() {
      return this.getVideoSource().fallback_url;
    }
  },
  methods: {
    getVideoSource() {
      return this.vm.media ?
        this.vm.media.reddit_video : 
        this.vm.preview.reddit_video_preview;
    }
  }
}
</script>
<style>
.reddit-video {
  width: 100%;
}

</style>
