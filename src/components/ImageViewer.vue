<template>
  <img :src='vm.url' class='image-preview'>
</template>
<script>
export default {
  name: 'ImageViewer',
  props: ['vm']
}
</script>
