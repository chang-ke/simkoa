const fs = require('fs');
const path = require('path');
const root = process.cwd();

module.exports = function middlewareLoader() {
  let paths = fs.readdirSync(path.resolve(root, 'middleware'));
  let middlewares = [];
  paths.forEach(name => {
    let fn = require(path.resolve(root, 'middleware', name));
    if (Array.isArray(fn)) {
      middlewares.push(...fn);
    } else if (Object.prototype.toString.call(fn) === '[object Object]') {
      middlewares.push(...Object.keys(fn).map(key => fn[key]));
    } else {
      middlewares.push(fn);
    }
  });
  return middlewares;
};
