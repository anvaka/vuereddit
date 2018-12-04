# vuereddit

A simple reddit client written as a vue component.

![demo](https://i.imgur.com/pmktzzg.gif)

## Usage 

Install the module first:

```
npm install vue-reddit-client
```

And use it in your vue application:

``` vue
<template>
  <subreddit name='videos'></subreddit>
</template>

<script>
import 'vue-reddit-client/dist/vuereddit.css'
import Subreddit from 'vue-reddit-client'

export default {
  name: 'App',
  components: {
    Subreddit
  }
}
</script>
```

This should give you a very simple reddit viewer:

![demo](https://i.imgur.com/Hov6mNu.png)

## Why?

I love reddit, obviously. I also want to build more tools on top of reddit, so I decided
to make this preview component.

Stay tuned for more.

In the mean time I have also recorded development of this library on video. The total time spent
here was around 7 hours. I compressed each session to a 30-60 seconds video, where lots of 
screens are flashing, except maybe last 15 seconds, where final result of work is visible.

I hope you find it entertaining. Here is a [YouTube playlist](https://www.youtube.com/playlist?list=PLiyBhz6G0njLd-nOcQvbzhssGI5Dy6Vjm)


## License

MIT