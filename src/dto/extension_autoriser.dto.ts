import { IsString } from "class-validator"

export class ExtensionDto { 
    @IsString()
    libelle!: string
} 