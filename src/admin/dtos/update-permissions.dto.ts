import { Type } from 'class-transformer';
import { PermissionDto } from '../../users/dtos/permission.dto';
import { IsNumber } from 'class-validator';

export class UpdatePermissionsDto {
	@IsNumber()
	user_id: number;

	@IsNumber()
	rank_id: number;

	@Type(() => PermissionDto)
	permissions: PermissionDto;
}
