import { IsString, IsOptional } from "class-validator";
import { Document } from "entity/Document";

export class CorrectionDto {
    
    @IsString()
    libelle: string

    @IsOptional()
    document:Document
}