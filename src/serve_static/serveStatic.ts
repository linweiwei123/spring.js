import { Context } from '../context.ts';
import { path, existsSync, Status } from '../deps.ts';

const MEDIA_TYPES: Record<string, string> = {
	'.md': 'text/markdown',
	'.html': 'text/html',
	'.htm': 'text/html',
	'.json': 'application/json',
	'.map': 'application/json',
	'.txt': 'text/plain',
	'.ts': 'text/typescript',
	'.tsx': 'text/tsx',
	'.js': 'application/javascript',
	'.jsx': 'text/jsx',
	'.gz': 'application/gzip',
	'.css': 'text/css',
	'.wasm': 'application/wasm',
	'.mjs': 'application/javascript',
};

/** Returns the content-type based on the extension of a path. */
function contentType(urlPath: string): string | undefined {
	return MEDIA_TYPES[path.extname(urlPath)];
}

export class ServeStatic {
	viewRootDir: string;

	constructor(viewRootDir: string) {
		if (viewRootDir === undefined) {
			throw new Error('viewRootDir不能为空');
		}
		this.viewRootDir = viewRootDir;
	}

	async init(context: Context, next: () => Promise<void>): Promise<void> {
		let req = context.request._serverRequest;
		let { method, url } = req;
		if (method !== 'GET' && method !== 'HEAD') {
			await next();
			return;
		}

		let filePath = path.join(Deno.cwd(), this.viewRootDir, url);
		if (!existsSync(filePath)) {
			await next();
			return;
		}

		const [file, fileInfo] = await Promise.all([Deno.open(filePath), Deno.stat(filePath)]);

		const headers = new Headers();
		headers.set('content-length', fileInfo.size.toString());
		const contentTypeValue = contentType(filePath);
		if (contentTypeValue) {
			headers.set('content-type', contentTypeValue);
		}

		if (method === 'HEAD') {
			req.respond({
				headers: headers,
				status: Status.OK,
			});
		} else {
			try {
				await req.respond({ status: 200, headers, body: file });
			} finally {
				file.close();
			}
		}
	}
}
