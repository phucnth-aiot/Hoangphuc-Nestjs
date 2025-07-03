import { AuthService } from './auth.service';
import { Body, Post, HttpCode, HttpStatus, Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() loginDto: Record<string, any>) {
    return this.authservice.signIn(loginDto.phone, loginDto.password);
  }
}
