import { Controller, Get, Post, Put, Param, Delete, Body } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from './dtos/create-user.dtos';
import { UserDto } from './dtos/user.dto';
import { UserUpdateDto } from './dtos/user-update.dtos';
import { UserDeleteDto } from './dtos/user-delete.dtos';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService){}

  @Get()
  findall(){
    return this.UserService.findAll
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto){
    return this.UserService.create(CreateUserDto)
  }

  @Put(':userid')
  update(@Param('userid') userid:string, @Body() UserUpdateDto: UserUpdateDto){
    return this.UserService.update(userid, UserUpdateDto)
  }

  @Delete('userid')
  delete(@Param('userid') @Body() userid:string) {
    return this.UserService.delete(userid)
  }
}
