<template>
  <div class='post'>
    <a class='post-content' :href='permalink' target='_blank' v-if='!vm.scrollTracker'>
      <div class='byline'>Posted by <a :href='authorLink' target='_blank'>/u/{{vm.author}}</a> {{postedTime}} in <a :href='subredditLink'>{{vm.subreddit}}</a></div>
      <div class='title'>{{decodedTitle}}</div>

      <component :is='cardViewer' :vm='vm'></component>

      <div class='status-line'>
        <div class='vote-count small'>{{prettyScore}}</div>
        <a :href='permalink' class='comments-count' target='_blank'>{{commentsCount}}</a>
      </div>
    </a>
    <div v-else>
      <scroll-tracker :vm='vm'></scroll-tracker>
    </div>
  </div>
</template>

<script>
import LinkViewer from './LinkViewer.vue';
import ImageViewer from './ImageViewer.vue';
import SelfViewer from './SelfViewer.vue';
import MediaViewer from './MediaViewer.vue';
import ScrollTracker from './ScrollTracker.vue';
import RedditVideoViewer from './RedditVideoViewer.vue';
import ImgurVideoViewer from './ImgurVideoViewer.vue';
import abbreviateNumber from '../lib/abbreviateNumber.js';
import he from 'he';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export default {
  components: { ScrollTracker },
  name: 'Post',
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  computed: {
    cardViewer() {
      const vm = this.vm;
      if (this.isImage(vm.url)) return ImageViewer;
      if (vm.is_self) return SelfViewer;
      if (vm.media_embed?.content) return MediaViewer;
      if (vm.media?.reddit_video?.dash_url) return RedditVideoViewer;
      if (vm.preview?.reddit_video_preview?.dash_url) return RedditVideoViewer;
      if (vm.url?.match(/imgur.com\/(.+)\.gifv/)) return ImgurVideoViewer;
      return LinkViewer;
    },
    decodedTitle() {
      return he.decode(this.vm.title || '');
    },
    postedTime() {
      const date = new Date(this.vm.created_utc * 1000);
      return timeAgo.format(date);
    },
    prettyScore() {
      return abbreviateNumber(this.vm.score);
    },
    authorLink() {
      return `https://reddit.com/u/${this.vm.author}`;
    },
    permalink() {
      return `https://reddit.com${this.vm.permalink}`;
    },
    subredditLink() {
      return `https://reddit.com/r/${this.vm.subreddit}`;
    },
    commentsCount() {
      const count = this.vm.num_comments;
      if (count === 0) return 'No comments';
      if (count === 1) return '1 Comment';
      return `${abbreviateNumber(count)} Comments`;
    }
  },
  methods: {
    isImage(url) {
      return url?.match(/\.(png|jpg|jpeg|gif)\b/i);
    }
  }
}
</script>

<style lang="stylus">
@import './variables.styl';

.post {
  background: post-background;
  border: 1px solid background-border;
  border-radius: 2px;
  display: flex;
  margin: 0 8px 16px 8px;
  max-width: 650px;
  flex-direction: row;
  .title {
    font-weight: 500;
    color: primary-text;
  }
  .vote-count {
    padding: 8px;
    width: 50px;
    flex-shrink: 0;
    text-align: center;
    background: vote-background;
  }
  h1 {
    font-weight: 700;
    font-size: 18px;
    color: primary-text;
  }
  a {
    text-decoration: none;
    display: inline-block;
    padding: 4px 8px;
    color: secondary-text;
    &:hover {
      background: #ddd;
    }
  }
  .url {
    font-size: 12px;
    color: active-url;
    padding: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    &:hover {
      background: transparent;
      text-decoration: underline;
    }
  }
  a.comments-count {
    padding: 8px
  }
  .post-content {
    width: 100%;
    flex: 1;
    overflow: hidden;
    padding: 8px  4px 0 4px;
    &:hover {
      background: transparent;
    }
    .byline {
      font-size: 12px;
      color: secondary-text;
    }
    .status-line {
      font-size: 12px;
      font-weight: bold;
      margin: 0 -4px;
      padding: 0 4px;
      background-color: vote-background;
    }
  }
}

.image-preview {
  max-width: 100%;
  margin-top: 8px;
}

.small {
  display: none;
}

.small-screen {
  .post {
    margin: 0 0 16px 0;
    .vote-count {
      display: none;
    }
    .vote-count.small {
      display: inline;
      font-weight: bold;
      color: black;
    }
  }
}
</style>