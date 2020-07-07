<template>
<div>
  <a :href='vm.url' class='url' target='_blank'>{{vm.url}}</a>
  <div ref='htmlHost'></div>
</div>
</template>
<script>
import eventHub from '../lib/eventHub.js';

const he = require('he');

export default {
  name: 'MediaViewer',
  props: ['vm'],
  data() {
    return {
      isVisible: false,
      embedded: false,
      decoded: null
    }
  },
  created() {
    eventHub.$on('scroll', this.updateVisibility);
    eventHub.$on('resize', this.updateSize);
  },
  mounted() {
    const parent = getParentSubreddit(this.$el);
    this.updateVisibility(parent.scrollTop, parent.clientHeight);
  },
  beforeDestroy() {
    eventHub.$off('scroll', this.updateVisibility);
    eventHub.$off('resize', this.updateSize);
  },
  methods: {
    updateVisibility(scrollTop, height) {
      const y = this.$el.offsetTop;
      const isVisible = !(y > scrollTop + 2 * height || y < scrollTop - height);
      if (this.isVisible === isVisible) return;

      this.isVisible = isVisible;

      let html;
      const mediaHeight = this.vm.media_embed.height;
      if (this.isVisible && !this.embedded) {
        html = this.getDecodedMediaFrame();
        this.embedded = true;
        const {htmlHost} = this.$refs;
        htmlHost.innerHTML = html;
      } else if (!this.embedded) {
        html = `<div style="height:${mediaHeight}px;"></div>`;
        const {htmlHost} = this.$refs;
        htmlHost.innerHTML = html;
      }
      this.updateSize();
    },

    updateSize() {
      const {htmlHost} = this.$refs;
      const frame = htmlHost.querySelector('iframe');
      if (frame) {
        frame.style.width = '100%';
        frame.removeAttribute('height')
      }
    },

    getDecodedMediaFrame() {
      if (this.decoded) return this.decoded;
      this.decoded = he.decode(this.vm.media_embed.content).replace(/position:absolute;/, '')
      return this.decoded;
    }
  }
}

function getParentSubreddit(startFrom) {
  while (startFrom) {
    if (startFrom.classList.contains('subreddit')) return startFrom;
    startFrom = startFrom.parentElement;
  }
}
</script>
