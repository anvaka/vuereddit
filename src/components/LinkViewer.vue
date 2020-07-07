<template>
  <a :href='vm.url' class='url' target='_blank'>{{vm.url}}</a>
</template>
<script>
export default {
  name: 'LinkViewer',
  props: ['vm'],
}
</script>
