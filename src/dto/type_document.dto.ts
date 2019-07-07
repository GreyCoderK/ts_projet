import {IsString, IsOptional} from "class-validator"
import { Document } from "entity/Document";

export class TypeDocumentDto {
    
    @IsString()
    libelle: string
    
    @IsOptional()
    documents: Array<Document>
} 