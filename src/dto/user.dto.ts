import {IsString, IsOptional, IsDate} from "class-validator"
import { User } from "../entity/User";
import { TypeUser } from "entity/TypeUser";
import { Document } from "entity/Document";
import { Note } from "entity/Note";
import { Image } from "entity/Image";
import { Commentaire } from "entity/Commentaire";

export class UserDto {
    
    @IsString()
    nom: string

    @IsString()
    prenoms: string

    @IsDate()
    birthday: Date

    @IsString()
    email: string

    @IsString()
    contact: string

    @IsString()
    password: string
    
    @IsOptional()
    users: Array<User>

    @IsOptional()
    typeUser : TypeUser

    @IsOptional()
    documents : Array<Document>

    @IsOptional()
    notes: Array<Note>

    @IsOptional()
    images: Array<Image>

    @IsOptional()
    commentaires: Array<Commentaire>
} 