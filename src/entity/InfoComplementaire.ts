import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Info {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar")
    libelle: string

    @Column("varchar")
    author: string

    @Column("varchar")
    email: string

    @Column("varchar")
    contact: string

    @Column("text", {nullable: true})
    description: string

    @Column("int")
    telechargement: number
}