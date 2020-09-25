import { serve } from './dep.ts';
import { Context } from './context.ts';

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
}
