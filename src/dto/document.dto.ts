import { IsString, IsOptional, IsNumber } from "class-validator";
import { User } from "../entity/User";
import { TypeDocument } from "../entity/TypeDocument";
import { Note } from "../entity/Note";
import { Classe } from "../entity/Classe";
import { Suggestion } from "../entity/Suggestion";
import { Correction } from "../entity/Correction";
import { Commentaire } from "../entity/Commentaire";

export class DocumentDto {
    
    @IsString()
    libelle: string

    @IsString()
    description: string

    @IsString()
    path: string

    @IsString()
    createat: Date

    @IsNumber()
    telechargement: number

    @IsNumber()
    nombreVue: number

    @IsOptional()
    user: User

    @IsOptional()
    typeDocument: TypeDocument

    @IsOptional()
    notes: Array<Note>

    @IsOptional()
    suggestions: Suggestion

    @IsOptional()
    correction: Array<Correction>

    @IsOptional()
    commentaires: Array<Commentaire>

    @IsOptional()
    classe : Classe
}