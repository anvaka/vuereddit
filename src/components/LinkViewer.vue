<template>
  <a :href="decodedURL" class="url" target="_blank">{{ vm.url }}</a>
</template>

<script>
export default {
  name: 'LinkViewer',
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  computed: {
    decodedURL() {
      return this.vm.url.replace(/&amp;/g, '&');
    }
  }
}
</script>