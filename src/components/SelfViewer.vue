<template>
  <div class="self-container">
    <div v-html="decodedHtml"></div>
    <div class="read-more"></div>
  </div>
</template>

<script>
import he from 'he';

export default {
  name: "SelfViewer",
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  computed: {
    decodedHtml() {
      const html = this.vm.selftext_html;
      return html ? he.decode(html) : "";
    }
  }
};
</script>

<style lang="stylus">
.self-container {
  max-height: 200px;
  overflow: hidden;
  position: relative;

  p {
    margin: 8px 0;
  }

  code {
    background-color: #efefef;
  }
}

.read-more {
  position: absolute;
  height: 50px;
  top: 150px;
  left: 0;
  width: 100%;
  margin: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
}
</style>