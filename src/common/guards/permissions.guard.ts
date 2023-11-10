import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredPermissions =
			this.reflector.get<string[]>('permissions', context.getHandler()) ||
			this.reflector.get<string[]>('permissions', context.getClass());

		if (!requiredPermissions) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user: User = request.session.user;

		if (!user) {
			throw new UnauthorizedException();
		}
		const hasPermission = requiredPermissions.every((permission) =>
			Object.keys(user.permission).includes(permission),
		);

		if (!hasPermission) {
			throw new UnauthorizedException('You have no right to update settings.');
		}

		return true;
	}
}
