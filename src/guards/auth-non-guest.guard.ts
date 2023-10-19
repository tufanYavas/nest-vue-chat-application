import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthNonGuestGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		return request.session.user && request.session.user.id != -1;
	}
}
