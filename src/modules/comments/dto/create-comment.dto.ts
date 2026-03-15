import { ApiProperty } from "@nestjs/swagger";
import {IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example:"Zo'r video ekan"})
    @IsString()
    content:string

    @ApiProperty()
    @IsString()
    videoId:string

    @ApiProperty()
    @IsString()
    authorId:string
}
