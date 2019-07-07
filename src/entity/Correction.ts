import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Document } from "./Document";

@Entity()
export class Correction {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @ManyToOne(type => Document, document => document.suggestions, {nullable: true})
    document:Document
}