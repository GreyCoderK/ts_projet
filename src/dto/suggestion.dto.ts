import { IsString, IsOptional } from "class-validator";
import { Document } from "../entity/Document";

export class SuggestionDto {

    @IsString()
    libelle: string

    @IsString()
    description: string

    @IsOptional()
    document:Document
}