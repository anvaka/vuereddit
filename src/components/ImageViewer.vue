<template>
  <img :src='vm.url' class='image-preview'>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    vm: {
      type: Object,
      required: true
    }
  }
}
</script>