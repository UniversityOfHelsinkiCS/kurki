const callWithCache = (cache, key, fn) => {
  let promise;

  if (cache.get(key)) {
    promise = cache.get(key);
  } else {
    promise = fn();

    promise.catch((err) => {
      cache.del(key);

      throw err;
    });

    cache.set(key, promise);
  }

  return promise;
};

export default callWithCache;
