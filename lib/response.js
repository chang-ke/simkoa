module.exports = {
  set body(value) {
    this._body = value || null;
  },
  get body() {
    return this._body;
  },
  set status(code) {
    this.res.statusCode = +code;
  },
  get status() {
    return this.res.statusCode;
  },
  set(field, val) {
    this.res.setHeader(field, val);
  },
};
