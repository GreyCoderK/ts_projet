import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class ExtensionAutoriser {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20
    })
    libelle: string
}