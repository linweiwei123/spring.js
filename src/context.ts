import { Request } from './request.ts';
import { Response } from './response.ts';
import { ServerRequest, Status } from './deps.ts';
import { View } from './view.ts';

export class Context {
  request: Request;
  response = new Response();
  view = new View();

  constructor(serverRequest: ServerRequest) {
    this.request = new Request(serverRequest);
    this.response.status = Status.NotFound;
  }

  render(templateStr: string, options: object) {
    let content = this.view.render(templateStr, options);
    this.response.body = content;
  }
}
