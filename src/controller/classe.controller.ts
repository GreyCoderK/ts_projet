import * as express from 'express'
import { getRepository } from 'typeorm';
import controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware';
import {Classe} from '../entity/Classe'
import {ClasseDto} from "../dto/classe.dto"
import NotFoundException from '../exception/notFoundException';

class ClasseController implements controller {

    public path = '/classe';
    public router = express.Router();
    
    private classeRepository = getRepository(Classe);
    
    constructor() {
        this.intializeRoutes();
    }
    
    public intializeRoutes() {
        this.router.get(this.path, this.getAllClasse);
        this.router.get(`${this.path}/:id`, this.getClasseById);
        this.router.put(`${this.path}/:id`, validationMiddleware(ClasseDto, true),this.modifyClasse);
        this.router.delete(`${this.path}/:id`, this.deleteClasse);
        this.router.post(this.path, validationMiddleware(ClasseDto),this.createAClasse);
    }
    
    private getAllClasse = async (request: express.Request, response: express.Response) => {
        const classes = await this.classeRepository.find()
        response.send(classes)
    }

    private getClasseById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const classe = await this.classeRepository.findOne(id);
        if (classe) {
          response.send(classe);
        } else {
          next(new NotFoundException(id));
        }
    }
    
    private createAClasse = async(request: express.Request, response: express.Response) => {
        const classe: Classe = request.body
        const newClasse = this.classeRepository.create(classe);
        await this.classeRepository.save(newClasse);
        response.send(newClasse);
    }

    private modifyClasse = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const classe: Classe = request.body;
        await this.classeRepository.update(id, classe);
        const updatedPost = await this.classeRepository.findOne(id);
        if (updatedPost) {
          response.send(updatedPost);
        } else {
          next(new NotFoundException(id));
        }
      }
     
    private deleteClasse = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.classeRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }
}

export default ClasseController