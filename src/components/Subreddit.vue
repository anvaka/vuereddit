<template>
  <div class='subreddit' @scroll='updateVisibility'>
    <div class='title-area'>
      <h3 :title='description'><a :href="subLink">/r/{{name}}</a><span v-if='about' class='subscribers'> {{subscribersCount}} subscribers; {{activeCount}} online</span></h3>
    </div>
    <div class='controls'>
      <span class='sort-label'>SORT:</span>
      <select v-model='selectedSortOption'>
        <option v-for='(sortOption, index) in sortOptions' :key='index' :value='sortOption.value'>{{sortOption.display}}</option>
      </select>
      <select v-if='canChooseTime' v-model='selectedTimeFilter'>
        <option v-for='(timeOption, index) in timeFilterOptions' :key='index' :value='timeOption.value'>{{timeOption.display}}</option>
      </select>
    </div>
    <div v-if='loading' class='loading'>Loading...</div>
    <div v-if='!loading && details && !details.error' class='details-container'>
      <post v-for='child in details.result.data.children' :key='child.data.id' :vm='child.data'></post>
    </div>
    <div v-if='!loading && details && details.error' class='error'>
      <div class='message'>An error occurred while trying to fetch /r/{{name}}.</div>
      <pre>{{details.error}}</pre>
    </div>
  </div>
</template>
<script>
import makeRedditClient from '../lib/redditClient';
import eventHub from '../lib/eventHub.js';
import abbreviateNumber from '../lib/abbreviateNumber';

import Post from './Post';

const redditClient = makeRedditClient();

export default {
  name: 'Subreddit',
  props: ['name', 'align', 'width'],
  components: {
    Post
  },
  computed: {
    description() {
      const {about} = this;
      return (about && about.description) || '';
    },
    canChooseTime() {
      return this.selectedSortOption === 'top' ||
          this.selectedSortOption === 'controversial';
    },
    subscribersCount() {
      if (!this.about) return;
      return abbreviateNumber(this.about.subscribers);
    },
    activeCount() {
      if (!this.about) return;
      return abbreviateNumber(this.about.active_user_count);
    },
    subLink() {
      return 'https://reddit.com/r/' + this.name;
    }
  },
  data() {
    const sortOptions = getSortOptions(); 
    const timeFilterOptions = getTimeFilterOptions();
    return {
      about: null,
      loading: true,
      details: null,
      selectedSortOption: sortOptions[0].value,
      selectedTimeFilter: timeFilterOptions[1].value,
      sortOptions,
      timeFilterOptions
    }
  },
  mounted() {
    this.updateStyle();
    this.fetchCurrent();
    this.fetchAbout();
    window.addEventListener('resize', this.updateResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateResize);
  },
  methods: {
    updateResize() {
      eventHub.$emit('resize', this.$el.scrollTop, this.$el.clientHeight);
      this.updateStyle();
    },
    updateVisibility() {
      eventHub.$emit('scroll', this.$el.scrollTop, this.$el.clientHeight);
    },
    fetchCurrent() {
      this.loading = true;
      let timeFilter = this.canChooseTime ? this.selectedTimeFilter : undefined;

      redditClient
        .fetchPosts(this.name, this.selectedSortOption, timeFilter)
        .then(this.updateData); 
    },
    fetchAbout() {
      this.about = null;
      redditClient
        .fetchAbout(this.name)
        .then(this.updateAbout);
    },
    updateData(subredditDetails) {
      this.details = subredditDetails;
      this.loading = false;
    },
    updateAbout(response) {
      this.about = response && response.result.data;
    },
    updateStyle() {
      if (this.$el.clientWidth < 600) {
        this.$el.classList.add('small-screen');
      } else {
        this.$el.classList.remove('small-screen');
      }
    }
  },
  watch: {
    name() {
      this.updateStyle();
      this.fetchCurrent();
      this.fetchAbout();
    },
    selectedSortOption() {
      this.fetchCurrent();
    },
    selectedTimeFilter() {
      this.fetchCurrent();
    }
  }
}

function getSortOptions() {
  return [{
      value: 'hot',
      display: 'Hot'
    }, {
      value: 'new',
      display: 'New'
    }, {
      value: 'controversial',
      display: 'Controversial'
    }, {
      value: 'top',
      display: 'Top'
    }, {
      value: 'rising',
      display: 'Rising'
    }];
}

function getTimeFilterOptions() {
  return [{
      value: 'hour',
      display: 'Past Hour'
    }, {
      value: 'day',
      display: 'Past 24 Hours'
    }, {
      value: 'week',
      display: 'Past Week'
    }, {
      value: 'month',
      display: 'Past Month'
    }, {
      value: 'year',
      display: 'Past Year'
    }, {
      value: 'all',
      display: 'Of All Time'
    }];
}
</script>
<style lang="stylus">
@import './variables.styl';

.title-area {
  padding: 8px;
  background-color: #333;
  color: post-background;
  a {
    text-decoration: none;
    color: post-background;
  }
  h3 {
    margin: 0;
  }
}
.error {
  color: #860e05;
  margin: 8px;

  pre {
    overflow: scroll;
    padding-bottom: 24px;
  }
}
.sort-label {
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin: 0 8px;
}
.subscribers {
  font-weight: normal;
  font-size: 12px;
}
.subreddit {
  overflow-y: auto;
  background: background-color;
}
.controls {
  margin: 8px 0;
}
.controls select {
  display: inline-block;
}
.subreddit {
  height: 100%;
  width: 100%;
}
.loading {
  margin-left: 8px;
}
</style>


