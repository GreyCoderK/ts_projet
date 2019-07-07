import * as express from 'express'
import { getRepository } from 'typeorm';
import controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware';
import {TypeUser} from '../entity/TypeUser'
import {TypeUserDto} from "../dto/type_user.dto"
import NotFoundException from '../exception/notFoundException';

class TypeUserController implements controller {
    
    public path = '/type_user';
    public router = express.Router();
    
    private TypeUserRepository = getRepository(TypeUser);
    
    constructor() {
        this.intializeRoutes();
    }
    
    public intializeRoutes() {
        this.router.get(this.path, this.getAllTypeUser);
        this.router.get(`${this.path}/:id`, this.getTypeUserById);
        this.router.put(`${this.path}/:id`, validationMiddleware(TypeUserDto, true),this.modifyTypeUser);
        this.router.delete(`${this.path}/:id`, this.deleteTypeUser);
        this.router.post(this.path, validationMiddleware(TypeUserDto),this.createATypeUser);
    }
    
    private getAllTypeUser = async (request: express.Request, response: express.Response) => {
        const typeUsers = await this.TypeUserRepository.find()
        response.send(typeUsers)
    }

    private getTypeUserById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const typeUser = await this.TypeUserRepository.findOne(id);
        if (typeUser) {
          response.send(typeUser);
        } else {
          next(new NotFoundException(id));
        }
    }
    
    private createATypeUser = async(request: express.Request, response: express.Response) => {
        const typeUser: TypeUser = request.body
        const newTypeUser = this.TypeUserRepository.create(typeUser);
        await this.TypeUserRepository.save(newTypeUser);
        response.send(newTypeUser);
    }

    private modifyTypeUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const typeUser: TypeUser = request.body;
        await this.TypeUserRepository.update(id, typeUser);
        const updatedTypeUser = await this.TypeUserRepository.findOne(id);
        if (updatedTypeUser) {
          response.send(updatedTypeUser);
        } else {
          next(new NotFoundException(id));
        }
      }
     
    private deleteTypeUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.TypeUserRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }
}

export default TypeUserController