# vuereddit

A simple reddit client written as a vue component.

## Usage 

Install the module first:

```
npm install vue-reddit-client
```

And use it in your vue application:

``` vue
<template>
  <subreddit name='javascript'></subreddit>
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

## License

MIT