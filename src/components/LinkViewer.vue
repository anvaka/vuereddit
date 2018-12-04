<template>
  <a :href='vm.url' class='url'>{{vm.url}}</a>
</template>
<script>
export default {
  name: 'LinkViewer',
  props: ['vm'],
}
</script>
