<template>
  <div></div>
</template>
<script>
export default {
  name: 'LinkViewer',
  props: ['vm'],
  mounted() {
    this.intersectionObserver = new IntersectionObserver(this.onElementVisible, {
      root: this.vm.list.$el
    });
    this.intersectionObserver.observe(this.$el);
  },
  beforeDestroy() {
    this.intersectionObserver.disconnect();
  },
  methods: {
    onElementVisible(e) {
      if (e[0].isIntersecting) {
        this.vm.loadTheRest();
      }
    }
  }
}
</script>
