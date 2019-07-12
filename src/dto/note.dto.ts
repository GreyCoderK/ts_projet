import { IsOptional, IsNumber } from "class-validator"
import { User } from "entity/User";
import { Document } from "entity/Document";

export class NoteDto {

    @IsNumber()
    note: number;

    @IsOptional()
    user : User

    @IsOptional()
    document : Document
}