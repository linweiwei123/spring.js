import { ServerResponse, Status } from './deps.ts';
import { Request } from './request.ts';
import { isType } from './utils.ts';

type Reader = Deno.Reader;

export class Response {
  status?: Status;
  headers = new Headers();
  body?: any;
  req: Request;

  constructor(req: Request) {
    console.log('初始化response');
    this.req = req;
    this.initResponseHeader();
    this.status = Status.NotFound;
  }

  toServerResponse(): ServerResponse {
    let body = this.body || '';

    if (isType(body, 'object')) {
      body = JSON.stringify(body);
    }

    return {
      status: Status.OK,
      body: body,
      headers: this.headers
    };
  }

  setResponse(options: { headers?: Headers; body?: any }) {
    Object.assign(this, options);
  }

  initResponseHeader() {
    let contentType = this.req._serverRequest.headers.get('content-type');
    switch (contentType) {
      case 'application/json':
        this.headers.set('Content-Type', 'application/json');
        break;
      case 'text/html':
        this.headers.set('Content-Type', 'text/html');
        break;
    }
  }
}
