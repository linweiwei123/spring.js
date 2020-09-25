import { ServerRequest } from './dep.ts';

export class Request {
  private _serverRequest: ServerRequest;

  constructor(request: ServerRequest) {
    this._serverRequest = request;
  }
}
