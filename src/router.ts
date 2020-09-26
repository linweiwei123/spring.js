import { Context } from './context.ts';
import { pathFormat } from './helper.ts';

export interface routeMiddleware {
  (context: Context, next: () => Promise<void>): Promise<void> | void;
}

export interface Layer {
  path: string;
  handle: routeMiddleware;
  method: string;
}

export class Router {
  stacks: Layer[] = [];

  addRoute(layer: Layer) {
    this.stacks.push(layer);
  }

  middlewareInit(context: Context, out: () => Promise<void>) {
    let index = 0;
    const stacks = this.stacks;
    async function dispatch(index: number) {
      let layer = stacks[index++];

      if (!layer) {
        return out();
      }

      const { path, handle, method } = layer;
      const pathname = pathFormat(context.request._serverRequest.url || '/');
      const reqMethod = context.request._serverRequest.method;

      // 如果route不匹配 或这 method不匹配则略过
      if ((path !== '' && pathname !== path) || reqMethod !== method) {
        dispatch(index++);
        return;
      }

      // console.log("_serverRequest", context.request._serverRequest);
      handle(context, dispatch.bind(null, index));
    }

    return dispatch(0);
  }
}
