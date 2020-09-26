import { ServerRequest } from './deps.ts';

export class Request {
  _serverRequest: ServerRequest;

  constructor(request: ServerRequest) {
    this._serverRequest = request;
  }
}
