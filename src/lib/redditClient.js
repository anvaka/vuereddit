import fetch from "./fetch";

export default function redditClient() {
  const endpoint = 'https://www.reddit.com/r/';

  let cachedPosts = new Map(); // from reddit name to fetch results
  let pendingRequests = new Map();

  return {
    /**
     * Downloads subreddit posts
     */
    fetchPosts,

    /**
     * Downloads information about subreddit
     */
    fetchAbout
  };

  function fetchAbout(subredditName) {
    let firstInMany = getAllInMultiView(subredditName)[0];
    return fetchPosts(firstInMany, 'about');
  }

  function getAllInMultiView(subredditName) {
    return subredditName.split('+').map(x => x.trim());
  }

  function fetchPosts(subredditName, suffix, timeFilter) {
    const cleanName = getAllInMultiView(subredditName).join('+')
    let key = `${cleanName}/${suffix}.json`
    if (timeFilter) {
      key += '?t=' + timeFilter;
    }

    let promise;
    const cachedResponse = cachedPosts.get(key);
    if (cachedResponse) {
      // if we have response in the cache - we give it right away
      promise = Promise.resolve(cachedResponse);
    } else if (pendingRequests.has(key)) {
      // This way already scheduled. We resolve it later.
      promise = new Promise((resolve, reject) => {
        pendingRequests.get(key).resolvers.push({resolve, reject});
      })
    } else {
      pendingRequests.set(key, {
        resolvers: []
      });
    }

    if (!promise) {
      // If we haven't figure out yet the promise, we have to fetch.
      promise = fetch(`${endpoint}${key}`, {responseType: 'json'})
        .then(result => {
          const value = { error: null, result };
          cachedPosts.set(key, value)
          resolveAllPendingFor(key, /* resolve = */ true, value);
          pendingRequests.delete(key);
          return value;
        }).catch(error => {
          const value = { error, result: null };
          // Note: We don't cache errors, so that we can retry them.
          // Still resolve current request:
          resolveAllPendingFor(key, /* resolve = */ false, value);
          pendingRequests.delete(key);
          return value;
        });
    }

    return promise;
  }

  function resolveAllPendingFor(subredditName, resolve, result) {
    const moreToResolve = pendingRequests.get(subredditName).resolvers;
    if (!moreToResolve) return;
    moreToResolve.forEach(promise => resolve ? promise.resolve(result) : promise.reject(result))
  }
}