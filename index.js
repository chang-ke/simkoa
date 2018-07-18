const SimKoa = require('./lib/application');
try {
  const app = new SimKoa();
  app.use(async (ctx, next) => {
    console.log(1);
    //相当于执行compose里面的dispatch(i + 1)
    await next();
  });
  app.use(async (ctx, next) => {
    console.log(2);
    await next();
  });
  app.use(async (ctx, next) => {
    ctx.status = 200;
    ctx.body = 'server has response';
    ctx.set('Cache-Control', 'public, max-age=3600000')
    await next();
  });
  app.listen(3000);
} catch (error) {
  console.log(error);
}
process.on('unhandledRejection', error => {
  console.log(error);
});
