import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
}
