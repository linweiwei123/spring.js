import { Spring, Context, Middleware } from './src/spring.ts';

let spring = new Spring();

spring.use(async (ctx: Context, next) => {
  console.log('1');
  next();
  ctx.response.body = 'hello word!';
});

await spring.listen(3000);
