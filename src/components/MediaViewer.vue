<template>
  <div>
    <a :href="vm.url" class="url" target="_blank">{{ vm.url }}</a>
    <div class="iframe-parent" v-html="getDecodedMediaFrame()"></div>
  </div>
</template>

<script>
import he from 'he';

export default {
  name: 'MediaViewer',
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isVisible: false,
      embedded: false,
      decoded: null
    };
  },
  methods: {
    getDecodedMediaFrame() {
      if (this.decoded) return this.decoded;
      this.decoded = he.decode(this.vm.media_embed.content).replace(/position:absolute;/, '');
      return this.decoded;
    }
  }
};
</script>

<style>
.iframe-parent iframe {
  width: 100%;
}
</style>