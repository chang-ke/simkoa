const qs = require('querystring');
const { parse, stringify } = require('url');
module.exports = {
  get headers() {
    return this.req.headers;
  },
  get url() {
    return this.req.url;
  },
  get search() {
    return parse(this.req.url).search;
  },
  get query() {
    return parse(this.req.url).query;
  },
  get href() {
    return parse(this.req.url).href;
  },
  get path() {
    return parse(this.req.url).pathname;
  },
  get method() {
    return this.req.method;
  },
  get(filed) {
    return this.req.headers[field] || null;
  }
};
