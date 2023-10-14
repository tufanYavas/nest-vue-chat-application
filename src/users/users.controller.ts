import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Param,
	Query,
	NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ValidateUserResponseType } from 'src/enums';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('deneme')
	async deneme(@Body('username') username: string) {
		// const user = await this.usersService.findOneBy({ username });

		// console.log(user);
		// console.log(user.preference);
		// console.log(user.permission);
		const users = await this.usersService.findWithRelations({ username }, [
			'preference',
			'permission',
			'rank',
		]);
		for (const user of users) {
			console.log(user);
			console.log(user.preference);
			console.log(user.permission);
			console.log(user.rank);
		}
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get()
	findAllUsers(@Query('username') username: string) {
		return this.usersService.find(username);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.update(parseInt(id), body);
	}

	@Post('validateUser')
	async validateUser(@Body('username') username: string) {
		const user = await this.usersService.findOneBy({ username });
		if (!user) return ValidateUserResponseType.USER_NOT_FOUND;
		else if (user.rank.value > 1)
			return ValidateUserResponseType.USER_CAN_LOGIN_AS_AGENT;
		else return ValidateUserResponseType.USER_CANT_LOGIN_AS_AGENT;
	}
}
