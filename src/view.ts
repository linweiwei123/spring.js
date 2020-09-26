import { ejs } from './ejs/mod.ts';
import { path } from './deps.ts';

export class View {
  constructor() {}

  render(templateName: string, options: object) {
    let templateAbsPath = path.join(Deno.cwd(), 'view', templateName);
    let templateStr = Deno.readTextFileSync(templateAbsPath);
    return ejs.render(templateStr, options) as string;
  }
}
