import {
  Body, ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseInterceptors
} from "@nestjs/common";
import { CreateUsersDto } from './dtos/create-users.dto';
import { GetUsersParamDto } from './dtos/get-users-param';
import { PatchUsersDto } from './dtos/patch-users.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Get all users by id',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Get all users by id',
    example: 10,
  })
  public getUsers(
    @Param() getUsersParamsDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) page: number,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log(user);
    return { getUsersParamsDto, limit, page };
  }

  @Post('/signup')
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  public userRegistration(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.userRegistration(createUsersDto);
  }

  @Auth(AuthType.None)
  @Post('/google-signup')
  public registerByGoogleOauth() {
    return this.usersService.registerByGoogleAccount();
  }

  @Patch()
  public patchUser(@Body() patchRequest: PatchUsersDto) {
    return patchRequest;
  }
}
