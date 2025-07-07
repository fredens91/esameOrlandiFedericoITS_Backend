import { IsEmail, IsIn, IsString, MinLength } from "class-validator";
// import { USER_ROLE_ENUM } from "../utils/enums/user.enum";

export class AddUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  username: string;

  @IsString()
  role: string;

  @MinLength(8)
  // @Matches(new RegExp("^(?=.*d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"), {
  //   message:
  //     "password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special character",
  // })
  password: string;
}

export class LoginDTO {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
