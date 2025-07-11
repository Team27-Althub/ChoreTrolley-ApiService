import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { GetUsersParamDto } from './dtos/get-users-param';
import { PatchUsersDto } from './dtos/patch-users.dto';
import { UsersService } from './providers/users.service';
import { ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token/access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @UseGuards(AccessTokenGuard)
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
  ) {
    return { getUsersParamsDto, limit, page };
  }

  @Post('/signup')
  public userRegistration(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.userRegistration(createUsersDto);
  }

  @Post('/google-signup')
  public registerByGoogleOauth() {
    return this.usersService.registerByGoogleAccount();
  }

  @Patch()
  public patchUser(@Body() patchRequest: PatchUsersDto) {
    return patchRequest;
  }
}
