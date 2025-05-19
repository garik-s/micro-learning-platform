import { IsEmail, MinLength, IsString, IsIn } from 'class-validator';

export enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
}

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsIn(['student', 'instructor'])
  role: Role;
}


export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}