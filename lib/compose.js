/**
 *
 * @param {Array} middleware
 * @returns {Function} middleware starter
 */
module.exports = function compose(middleware) {
  const toString = Object.prototype.toString;
  //  Array.isArray()
  if (!toString.call(middleware) === '[object Array]') {
    throw new TypeError('Middleware stack must be an Array!');
  }

  middleware.forEach(fn => {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be a function!');
    }
  });

  return function(ctx) {
    const length = middleware.length;
    function dispatch(i) {
      if (i < length) {
        const fnMiddleware = middleware[i];
        try {
          return Promise.resolve(
            fnMiddleware(ctx, function next() {
              return dispatch(i + 1);
            })
          );
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
    //初始执行中间件
    return dispatch(0);
  };
};
