import { IsString, IsOptional } from "class-validator";

export class logicielDto {
    
    @IsString()
    libelle: string

    @IsString()
    path: string

    @IsOptional()
    description: string

    @IsOptional()
    telechargement: Number
}