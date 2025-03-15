<template>
  <video controls class="reddit-video">
    <source :src="link" type="video/mp4">
  </video>
</template>

<script>
export default {
  name: 'ImgurVideoViewer',
  props: ['vm'], 
  computed: {
    link() {
      return this.vm.url.replace(/\.gifv$/, '.mp4');
    },
  },
}
</script>
