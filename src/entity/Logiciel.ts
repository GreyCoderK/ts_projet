import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Logiciel {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @Column("varchar")
    path: string

    @Column("text", {nullable: true})
    description: string

    @Column("int",{default:0})
    telechargement: number
}