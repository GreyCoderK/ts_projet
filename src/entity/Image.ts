import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User";
import { Actualite } from "./Actualite";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", {nullable:true})
    libelle: string

    @Column("varchar")
    path: string

    @Column("text",{nullable:true})
    description: string

    @ManyToOne(type => User, user => user.images, {nullable:true})
    user:User

    @ManyToOne(type => Actualite, actualite => actualite.images, {nullable:true})
    actualite:Actualite
}