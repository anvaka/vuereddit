<template>
  <div class='subreddit' @scroll='updateVisibility'>
    <div class='background-area'>
      <a :href="subLink" target='_blank' >
        <div class='background-image' :style='backgroundStyle'></div>
      </a>
      <div class='background-content'>
        <a :href="subLink" target='_blank' class='background-reddit-icon'>
          <img v-if='hasIcon' :src='image.icon' class='community-icon'>
          <svg v-if='!newSubredditLoading && !hasIcon' class='community-icon' role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        </a>
        <div class='titles'  v-if='!newSubredditLoading && !showAgeWarning'>
          <h2 :title='title'>{{title}}</h2>
          <span v-if='about' class='subscribers'> {{subscribersCount}} members; {{activeCount}} online</span>
          <h3 v-html='description'></h3>
        </div>
        <slot name='after-title' v-if='!loading'></slot>
      </div>
    </div>
    <div class='controls' v-if='canShowPosts'>
      <span class='sort-label'>Sort posts by:</span>
      <select v-model='selectedSortOption'>
        <option v-for='(sortOption, index) in sortOptions' :key='index' :value='sortOption.value'>{{sortOption.display}}</option>
      </select>
      <select v-if='canChooseTime' v-model='selectedTimeFilter'>
        <option v-for='(timeOption, index) in timeFilterOptions' :key='index' :value='timeOption.value'>{{timeOption.display}}</option>
      </select>
    </div>
    <div v-if='loading' class='loading'>Loading...</div>
    <div v-if='showAgeWarning' class='age-warning'>
      <h2>You must be 18+ to view this community</h2>
      <p>
      You must be at least eighteen years old to view this content. 
      Are you over eighteen and willing to see adult content?
      </p>
      <a href='https://www.reddit.com/' target='_blank'>No</a>
      <a href='#' @click.prevent='confirmAge'>Yes</a>
    </div>
    <div v-if='canShowPosts' class='details-container'>
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
const he = require("he");

export default {
  name: 'Subreddit',
  props: ['name', 'align', 'width'],
  components: {
    Post
  },
  computed: {
    description() {
      const {about} = this;
      const html = about && about.public_description_html;
      if (html) {
        return he.decode(html);
      }
      return '';
    },
    title() {
      const {about} = this;
      const html = (about && about.title) || this.name;
      if (html) {
        return he.decode(html);
      }
      return this.name;
    },
    canShowPosts() {
      if (this.loading) return false;
      if (this.over18 === true && !this.ageConfirmed) return false;

      return this.details && !this.details.error;
    },
    showAgeWarning() {
      if (this.loading) return false;
      return (this.over18 === true && !this.ageConfirmed);
    },
    backgroundStyle() {
      let keyColor = this.about && this.about.banner_background_color || '';
      let imgPart = (this.image && this.image.banner && 
      !(this.showAgeWarning || (this.loading && !this.partialReload))) ? 
          `url(${this.image.banner}) no-repeat center / cover;background-position:center top; height: 192px;`
            : ';height: 86px;';
      return `background:${keyColor} ${imgPart}`
    },
    hasIcon() {
      if (this.loading && !this.partialReload) return false;
      if (this.showAgeWarning) return false;
      return this.image && this.image.icon;
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
    },
    newSubredditLoading() {
      return this.loading && !this.partialReload;
    }
  },
  data() {
    const sortOptions = getSortOptions(); 
    const timeFilterOptions = getTimeFilterOptions();
    return {
      about: null,
      over18: null,
      loading: true,
      details: null,
      image: null,
      partialReload: false,
      selectedSortOption: sortOptions[0].value,
      selectedTimeFilter: timeFilterOptions[1].value,
      // we store age on window, to not use cookies (gone after refresh)
      ageConfirmed: window.ageConfirmed || false,
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
    fetchCurrent(partialReload) {
      this.loading = true;
      this.partialReload = partialReload;
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
      if (this.about) {
        this.loading = false;
      }
      if (this.details && this.details.error) {
        this.image = null;
      }
    },
    updateAbout(response) {
      let data = response && response.result && response.result.data;
      this.about = data;
      this.over18 = this.about && this.about.over18;
      if (this.details) {
        this.loading = false;
      }
      let image = null;
      let icon = data.icon_img || data.community_icon;
      if (icon) {
        let banner = data.banner_img || data.banner_background_image;
        image = {
          icon: icon.split('?')[0],
          banner: banner ? banner.split('?')[0] : null
        }
      }
      this.image = image;
    },
    confirmAge() {
      window.ageConfirmed = true;
      this.ageConfirmed = true;
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
      this.about = null;
      this.details = null;
      this.updateStyle();
      this.fetchCurrent();
      this.fetchAbout();
    },
    selectedSortOption() {
      this.fetchCurrent(true);
    },
    selectedTimeFilter() {
      this.fetchCurrent(true);
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

.age-warning {
  text-align: center;
   a {
     display: inline-block;
     margin: 8px;
   }
}
.reddit-video {
  width: 100%;
}
.background-image {
  display: block;
  min-width: 260px;
  padding: 8px 16px;
}
.background-area {
  h2, h3 {
    margin: 0;
  }
  h2 {
    font-size: 28px;
    font-weight: 700;
    line-height: 32px;
  }
  h3 {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
  }
  .community-icon {
    width: 72px;
    height: 72px;
    border-radius: 100%;
    margin: 8px;
    border: 4px solid #fff;
  }
  .titles {
    // flex: 1;
    margin: 8px;
   p {
     margin: 8px 0;
   }
  }
  .background-reddit-icon {
    margin-top: -24px;
    float: right;
    img {
      background-color: white;
    }
  }
}
</style>


