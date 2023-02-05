import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty({description:'Email đăng nhập'})
    email:string;
    
    @ApiProperty({description:'Mật khẩu đăng nhập'})
    password:string;
}