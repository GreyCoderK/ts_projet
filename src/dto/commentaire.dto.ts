import { IsString, IsOptional } from "class-validator";
import { Actualite } from "../entity/Actualite";
import { Document } from "../entity/Document";
import { User } from "../entity/User";
import { Commentaire } from "../entity/Commentaire";

export class CommentaireDto {

    @IsString()
    libelle: string

    @IsOptional()
    user:User

    @IsOptional()
    document:Document

    @IsOptional()
    actualite:Actualite

    @IsOptional()
    commentaire: Array<Commentaire>

}
