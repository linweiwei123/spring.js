import { Spring, Context, Middleware } from './src/spring.ts';

let app = new Spring();

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

app.static('public');

// app.use(async (ctx: Context, next) => {
// 	console.log('1');
// 	await delay();
// 	await next();
// 	console.log('2');
// });

// app.use(async (ctx: Context, next) => {
// 	console.log('3');
// 	await delay();
// 	await next();
// 	console.log('4');
// });

app.get('/home', async (ctx: Context) => {
  ctx.render('index.html', {
    data: {
      name: 'linweiwei'
    }
  });
  return;
});

app.get('/api/data', async (ctx: Context, next) => {
  ctx.response.body = {
    code: 0,
    data: {},
    msg: 'success'
  };
});

app.use(async (ctx: Context, next) => {
  ctx.response.body = '404';
  return;
});

await app.listen(4000);
