import {IsString, IsOptional, IsDate, IsBoolean} from "class-validator"
import { Commentaire } from "entity/Commentaire";
import { Image } from "entity/Image";

export class ActualiteDto {
    
    @IsString()
    libelle: string

    @IsString()
    description: string

    @IsString()
    date: Date

    @IsBoolean()
    new: Boolean

    @IsOptional()
    images: Array<Image>

    @IsOptional()
    commentaires: Array<Commentaire>
} 