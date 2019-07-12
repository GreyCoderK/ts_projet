import {ManyToOne ,Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";

@Entity()
export class Note {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    note: number;

    @ManyToOne(type => User, user => user.notes,{nullable: true})
    user : User

    @ManyToOne(type => Document, document => document.notes,{nullable: true})
    document : Document
}