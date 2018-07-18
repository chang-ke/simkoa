const http = require('http');
const Emmiter = require('events');
const compose = require('./compose');
const response = require('./response');
const context = require('./context');
const request = require('./request');
const middlewareLoader = require('./middlewareLoader');
/**
 *
 * @class Application
 * @extends {Emmiter}
 */
module.exports = (function() {
  let routeLoader = Symbol('routeLoader');
  return class Application extends Emmiter {
    constructor() {
      super();
      this.middelware = [];
      this.context = Object.create(context);
      this.request = Object.create(request);
      this.response = Object.create(response);
      //this[routeLoader]();
    }
    [routeLoader]() {
      console.log(process.cwd());
      console.log(__dirname);
    }
    /**
     *
     * @param {any} argvs
     * @returns httpServer
     * @memberof Application
     */
    listen(...argvs) {
      const httpServer = http.createServer(this.callback());
      return httpServer.listen(...argvs);
    }
    /**
     *
     *
     * @returns {Function}
     * @memberof Application
     */
    callback() {
      //获得middleware调用起始函数
      this.middelware = [...this.middelware, ...middlewareLoader()];
      const fn = compose(this.middelware);
      //events继承过来的，获取error事件注册次数，防止重复注册
      // if (!this.listenerCount('error')) {
      //   this.on('error', this.onerror);
      // }
      return (req, res) => {
        //创建上下文
        const ctx = this.createContext(req, res);
        //处理请求
        return this.handleRequest(ctx, fn);
      };
    }
    /**
     *
     * @param {Function} fn
     * @returns this 默认返回this
     * @memberof Application
     */
    use(fn) {
      if (typeof fn !== 'function') {
        throw new TypeError('Middleware must be a function!');
      }
      this.middelware.push(fn);
      return this;
    }
    /**
     *
     * @param {Object} req
     * @param {Object} res
     * @returns context
     * @memberof Application
     */
    createContext(req, res) {
      const context = Object.create(this.context);
      const request = (context.request = Object.create(this.request));
      const response = (context.response = Object.create(this.response));
      context.app = request.app = response.app = this;
      context.req = request.req = response.req = req;
      context.res = request.res = response.res = res;
      request.ctx = response.ctx = context;
      request.response = response;
      response.request = request;
      return context;
    }
    /**
     *
     * @param {Object} ctx
     * @param {Function} fnMiddleware
     * @returns Promise
     * @memberof Application
     */
    handleRequest(ctx, fnMiddleware) {
      const res = ctx.res;
      //若中间件未对请求进行响应，则返回404
      res.statusCode = 404;
      // fnMiddleware执行代表middleware开始执行
      // compose处理middleware，递归逐个执行，全部执行完毕后执行handlResponse完成响应
      const handleResponse = () => this.respond(ctx);
      const handleError = err => ctx.onerror(ctx, err);
      return fnMiddleware(ctx)
        .then(handleResponse)
        .catch(handleError);
    }
    /**
     *
     * @param {Object} ctx
     * 处理请求
     * @memberof Application
     */
    respond(ctx) {
      let body = ctx.body;
      ctx.res.end(body);
    }
    /**
     *
     * @param {Object} error
     * 处理错误
     * @memberof Application
     */
    onerror(ctx, err) {
      //this.emit('error', err)
      //ctx.res.end(err.message)
      console.log(ctx.status, 'error:', new Date().toDateString(), err.toString());
    }
  };
})();
