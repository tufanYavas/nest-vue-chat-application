import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const protocol = req.headers['x-forwarded-proto'] || req.protocol;

		if (protocol === 'http') {
			const httpsUrl = `https://${req.headers.host}${req.url}`;
			res.redirect(301, httpsUrl);
		} else {
			next();
		}
	}
}
