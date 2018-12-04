import jsonpFetch from "./jsonpFetch";

export default function redditClient() {
  const endpoint = 'https://www.reddit.com/r/';

  let cachedPosts = new Map(); // from reddit name to fetch results
  let pendingResolvers = new Map(); // requested subreddits

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
    return fetchPosts(subredditName, 'about');
  }

  function fetchPosts(subredditName, suffix, timeFilter) {
    let key = `${subredditName}/${suffix}.json`
    if (timeFilter) {
      key += '?t=' + timeFilter;
    }
    const cachedResponse = cachedPosts.get(key);
    if (cachedResponse) {
      return Promise.resolve(cachedResponse);
    }
    const pendingResponse = pendingResolvers.get(key);
    if (pendingResponse) {
      let actualResolve, actualReject;
      const alsoResolve = new Promise((resolve, reject) => {
        actualResolve = resolve;
        actualReject = reject;
      });

      pendingResolvers.push({
        resolve: actualResolve,
        reject: actualReject,
      });

      return alsoResolve;
    }


    return jsonpFetch(`${endpoint}${key}`).then(result => {
      const value = {
        error: null,
        result
      };
      cachedPosts.set(key, value)
      resolveAllPendingFor(key, /* resolve = */ true, value);
      return value;
    }).catch(error => {
      const value = {
        error,
        result: null
      };
      cachedPosts.set(key, value)
      resolveAllPendingFor(key, /* resolve = */ false, value);
    });
  }

  function resolveAllPendingFor(subredditName, resolve, result) {
    const moreToResolve = pendingResolvers.get(subredditName);
    if (!moreToResolve) return;
    moreToResolve.forEach(promise => resolve ? promise.resolve(result) : promise.reject(result))
  }
}