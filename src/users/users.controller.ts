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
  NotAcceptableException,
  Session,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { ValidateUserResponseType } from './enums';
import { LoginLogService } from 'src/loginlog/loginlog.service';
import { LoginLog } from 'src/loginlog/loginlog.entity';
import { Request } from 'express';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly loginLogService: LoginLogService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: Express.Request['session']) {
    console.log(session.user);
    session.user = null;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: Express.Request['session'],
  ) {
    console.log({ body });
    const user = await this.authService.signup(
      body.username,
      body.password,
      body.gender,
    );
    session.user = user;
    return user;
  }

  @Post('/visitorLogin')
  async visitorLogin(
    @Body() body: CreateUserDto,
    @Session() session: Express.Request['session'],
    @Req() req: Request,
  ) {
    const matchUser = await this.usersService.findOneBy({
      username: body.username,
    });
    if (matchUser) {
      throw new NotAcceptableException('Username is already in use');
    }
    const user = new User();
    user.username = body.username;
    user.id = -1;
    user.gender = body.gender;
    session.user = user;

    const log: Partial<LoginLog> = {
      userId: user.id,
      isVisitor: false,
      username: user.username,
      isMobile: /mobile/i.test(req.headers['user-agent'] || ''),
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
    };

    await this.loginLogService.createLog(log);

    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: Express.Request['session'],
    @Req() req: Request,
  ) {
    const user = await this.authService.signin(body.username, body.password);
    const log: Partial<LoginLog> = {
      userId: user.id,
      isVisitor: false,
      username: user.username,
      isMobile: /mobile/i.test(req.headers['user-agent'] || ''),
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
    };

    await this.loginLogService.createLog(log);
    session.user = user;
    return user;
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
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
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
    else if (user.type > 1)
      return ValidateUserResponseType.USER_CAN_LOGIN_AS_AGENT;
    else return ValidateUserResponseType.USER_CANT_LOGIN_AS_AGENT;
  }
}
