import { ServerResponse, Status } from './dep.ts';

type Reader = Deno.Reader;

export class Response {
  status?: Status;
  headers = new Headers();
  body?: any;

  toServerResponse(): ServerResponse {
    const body = this.body && typeof this.body === 'string' ? this.body : '';

    return {
      status: Status.OK,
      body: body,
      headers: this.headers
    };
  }
}
