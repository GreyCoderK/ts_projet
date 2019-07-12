import * as express from 'express'
import Controller from "interfaces/controller.interface";
import { getRepository } from 'typeorm';
import validationMiddleware from 'middleware/validation.middleware';
import NotFoundException from 'exception/notFoundException';
import { Note } from 'entity/Note';
import { NoteDto } from 'dto/note.dto';
import authMiddleware from 'middleware/auth.middleware';
import { User } from 'entity/User';
import { Document } from 'entity/Document';

class NoteController implements Controller{
    public path = '/note';
    public router = express.Router();
    
    private noteRepository = getRepository(Note);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllNote)
        this.router.get(`${this.path}/:id`, this.getNoteById);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(NoteDto, true),this.modifyNote);
        this.router.delete(`${this.path}/:id`, authMiddleware,this.deleteNote);
        this.router.post(this.path, authMiddleware,validationMiddleware(NoteDto),this.createANote);
    }

    private getAllNote = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const notes = await this.noteRepository.find()
        response.send(notes)
    }

    private getNoteById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const note = await this.noteRepository.find(id);
        if (note) {
          response.send(note);
        } else {
          next(new NotFoundException(id));
        }
    }

    private modifyNote = async (request, response, next) => {
        const id = request.params.id;
        const note = await this.noteRepository.findOne(id)
        
        note.note = request.body.note
        
        await this.noteRepository.update(id, note);
        const updatedNote = await this.noteRepository.findOne(id);
        if (updatedNote) {
          response.send(updatedNote);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteNote = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.noteRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }

    private createANote = async (request, response, next) => {
        const note = new Note()
        note.note = request.body.note
        var user = await getRepository(User).findOne(request.body.user_id)
        if(!user){
            next(new NotFoundException(`L'utilisateur aver ${request.body.user_id} `))
        }else{
            note.user = user
        }

        var document = await getRepository(Document).findOne(request.body.document_id)
        if(!document){
            next(new NotFoundException(`L'utilisateur aver ${request.body.document_id} `))
        }else{
            note.document = document
        }
        const newNote = this.noteRepository.create(note);
        await this.noteRepository.save(newNote);
        response.send(newNote);
    }

}

export default NoteController