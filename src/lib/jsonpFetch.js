let myIndex = 0;
// TODO: this should be done via queue, so that we don't spam reddit too much.

/**
 * Performs JSONP fetch and returns a promise
 */
export default function jsonpFetch(url) {
  let isCancelled, actualResolve;
  let loadScript = null;
  const name = 'jsonp' + (myIndex++);
  window[name] = downloaded;
  let cancelable = new Promise(download);
  cancelable.cancel = cancel;

  return cancelable;

  function download(resolve, reject) {
    actualResolve = resolve;

    loadScript = document.createElement('script');
    const joinWith = url.indexOf('?') > 0 ? '&' : '?'
    loadScript.src = `${url}${joinWith}jsonp=${name}`;
    loadScript.onerror = reject;
    document.head.appendChild(loadScript);
  }

  function cancel() {
    isCancelled = true;
  }

  function downloaded(e) {
    if (isCancelled) {
      dispose();
      return;
    }

    actualResolve(e);
    dispose();
  }

  function dispose() {
    if (loadScript) {
      document.head.removeChild(loadScript);
      loadScript = null;
    }
    delete window[name];
  }
}