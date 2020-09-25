import { Request } from './request.ts';
import { Response } from './response.ts';
import { ServerRequest, Status } from './dep.ts';

export class Context {
  request: Request;
  response = new Response();

  constructor(serverRequest: ServerRequest) {
    this.request = new Request(serverRequest);
    this.response.status = Status.NotFound;
  }
}
