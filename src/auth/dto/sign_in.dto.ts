import { ApiProperty } from "@nestjs/swagger";

export class SignInDto{
    @ApiProperty({
        example:'admin@admin.com'
    })
    email: string;

    @ApiProperty({
        example:'123456'
    })
    password: string;
}