import {IsString, IsOptional} from "class-validator"
import { User } from "../entity/User";

export class TypeUserDto {
    
    @IsString()
    libelle: string
    
    @IsOptional()
    users: Array<User>
} 