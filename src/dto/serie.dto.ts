import { IsString, IsOptional } from "class-validator"
import { Classe } from "../entity/Classe";

export class SerieDto {
    
    @IsString()
    libelle: string
    
    @IsOptional()
    classe: Array<Classe>

} 