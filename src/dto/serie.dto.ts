import {IsArray ,IsInt, IsString} from "class-validator"
import { Classe } from "../entity/Classe";

export class SerieDto {
    @IsInt()
    id!:number

    @IsString()
    libelle!: string
    
    @IsArray()
    classe?: Classe
} 