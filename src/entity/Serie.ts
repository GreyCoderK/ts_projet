import {ManyToOne ,Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Classe } from "./Classe";

@Entity()
export class Serie {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    libelle: string;

    @ManyToOne(type => Classe, classe => classe.series,{nullable: true} )
    classe : Classe
}
