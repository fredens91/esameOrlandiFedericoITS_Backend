import { IsEmail, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
