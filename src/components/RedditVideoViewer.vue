<template>
<video controls class='reddit-video' ref="video">
  <source :src="dash" type="application/dash+xml">
  <source :src="fallback" type="video/mp4">
</video>
</template>
<script>
/* eslint-disable no-console */
import dashjs from 'dashjs';

export default {
  name: 'RedditVideoViewer',
  props: ['vm'],
  computed: {
    dash() {
      return this.getVideoSource().dash_url;
    },
    fallback() {
      return this.getVideoSource().fallback_url;
    },
    audio() {
      let url = this.getVideoSource().fallback_url;
      let audioUrl = url.replace(/\/DASH_\d+\.mp4/, '\\DASH_audio.mp4');
      return audioUrl;
    }
  },
  mounted() {
    let dashUrl = this.dash;
    let player = dashjs.MediaPlayer().create();
    player.initialize(this.$refs.video, dashUrl, false)
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
