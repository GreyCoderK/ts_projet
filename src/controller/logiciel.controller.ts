import * as express from 'express'
import Controller from "interfaces/controller.interface";
import { getRepository } from 'typeorm';
import { logiciel } from 'entity/Logiciel';
import authMiddleware from 'middleware/auth.middleware';
import validationMiddleware from 'middleware/validation.middleware';
import { logicielDto } from 'dto/logiciel.dto';
import NotFoundException from 'exception/notFoundException';

class LogicielController implements Controller{
    public path = '/note';
    public router = express.Router();
    
    private logicielRepository = getRepository(logiciel);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllLogiciel)
        this.router.get(`${this.path}/:id`, this.getLogicielById);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(logicielDto, true),this.modifyLogiciel);
        this.router.delete(`${this.path}/:id`, authMiddleware,this.deleteNote);
        this.router.post(this.path, authMiddleware,validationMiddleware(logicielDto),this.createANote);
    }

    private getAllLogiciel = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logiciels = await this.logicielRepository.find()
        response.send(logiciels)
    }

    private getLogicielById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const logiciel = await this.logicielRepository.find(id);
        if (logiciel) {
          response.send(logiciel);
        } else {
          next(new NotFoundException(id));
        }
    }

    private modifyLogiciel = async (request, response, next) => {
        const id = request.params.id;
        const logiciel = await this.logicielRepository.findOne(id)
        
        logiciel. = request.body)
        
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