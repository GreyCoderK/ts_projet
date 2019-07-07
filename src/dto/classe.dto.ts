import {IsArray ,IsInt, IsString} from "class-validator"
import { Serie } from "../entity/Serie";

export class ClasseDto {
    @IsInt()
    id:number

    @IsString()
    libelle: string

    @IsArray()
    series: Array<Serie>
} 