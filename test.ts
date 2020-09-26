import { Spring, Context, Middleware } from './src/spring.ts';
import { serveStatic } from './src/deps.ts';

let app = new Spring();

app.use(serveStatic('public'));

app.use(async (ctx: Context, next) => {
  next();
});

app.get('/home', async (ctx: Context) => {
  ctx.render('index.html', {
    data: {
      name: 'linweiwei'
    }
  });
  return;
});

app.post('/api/data', async (ctx: Context, next) => {
  ctx.response.body = `{
    code: 0,
    data: {},
    msg: "success",
  }`;
});

app.use(async (ctx: Context, next) => {
  ctx.response.body = '404';
  return;
});

await app.listen(3000);
