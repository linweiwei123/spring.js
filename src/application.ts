import { serve } from './deps.ts';
import { Context } from './context.ts';
import { METHODS } from './constant.ts';
import { Router, Layer, routeMiddleware } from './router.ts';

export interface Middleware {
  (context: Context, next: () => Promise<void>): Promise<void> | void;
}

function compose(
  middlewares: Middleware[]
): (context: Context) => Promise<void> {
  return function (context: Context, next?: () => Promise<void>) {
    let index = 0;
    async function dispatch(index: number) {
      let middleware = middlewares[index++];

      if (!middleware) {
        return;
      }

      let fn = middleware;
      fn(context, dispatch.bind(null, index));
    }

    return dispatch(0);
  };
}

export class Application {
  private _middlewares: Middleware[] = [];
  usedRouter: boolean = false;
  _router = new Router();

  constructor() {}

  use(middleware: Middleware): void {
    this._middlewares.push(middleware);
  }

  async listen(port: number = 3000): Promise<void> {
    const middlewareChain = compose(this._middlewares);
    const server = serve({ port: port });

    console.log(`http://localhost:${port}/`);

    for await (const request of server) {
      let context = new Context(request);
      await middlewareChain(context);
      console.log('response', context.response.toServerResponse());
      await request.respond(context.response.toServerResponse());
    }
  }

  /**
   * 检测router中间件是否启用，未启用则开启
   */
  checkUseRouter() {
    // 如果未
    if (!this.usedRouter) {
      this.use(this._router.middlewareInit.bind(this._router));
      this.usedRouter = true;
    }
  }

  get(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'GET' });
  }

  post(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'POST' });
  }

  put(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'PUT' });
  }

  patch(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'PATCH' });
  }

  delete(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'DELETE' });
  }

  head(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'HEAD' });
  }

  options(path: string, handle: routeMiddleware) {
    this.checkUseRouter();
    this._router.addRoute({ path, handle, method: 'OPTIONS' });
  }
}
