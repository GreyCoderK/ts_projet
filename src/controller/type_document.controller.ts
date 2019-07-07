import * as express from 'express'
import { getRepository } from 'typeorm';
import controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware';
import {TypeDocument} from '../entity/TypeDocument'
import {TypeDocumentDto} from "../dto/type_document.dto"
import NotFoundException from '../exception/notFoundException';

class TypeDocumentController implements controller {
    
    public path = '/type_document';
    public router = express.Router();
    
    private TypeDocumentRepository = getRepository(TypeDocument);
    
    constructor() {
        this.intializeRoutes();
    }
    
    public intializeRoutes() {
        this.router.get(this.path, this.getAllTypeDocument);
        this.router.get(`${this.path}/:id`, this.getTypeDocumentById);
        this.router.put(`${this.path}/:id`, validationMiddleware(TypeDocumentDto, true),this.modifyTypeDocument);
        this.router.delete(`${this.path}/:id`, this.deleteTypeDocument);
        this.router.post(this.path, validationMiddleware(TypeDocumentDto),this.createATypeDocument);
    }
    
    private getAllTypeDocument = async (request: express.Request, response: express.Response) => {
        const typeDocuments = await this.TypeDocumentRepository.find()
        response.send(typeDocuments)
    }

    private getTypeDocumentById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const typeDocument = await this.TypeDocumentRepository.findOne(id);
        if (typeDocument) {
          response.send(typeDocument);
        } else {
          next(new NotFoundException(id));
        }
    }
    
    private createATypeDocument = async(request: express.Request, response: express.Response) => {
        const typeDocument: TypeDocument = request.body
        const newTypeDocument = this.TypeDocumentRepository.create(typeDocument);
        await this.TypeDocumentRepository.save(newTypeDocument);
        response.send(newTypeDocument);
    }

    private modifyTypeDocument = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const typeDocument: TypeDocument = request.body;
        await this.TypeDocumentRepository.update(id, typeDocument);
        const updatedTypeDocument = await this.TypeDocumentRepository.findOne(id);
        if (updatedTypeDocument) {
          response.send(updatedTypeDocument);
        } else {
          next(new NotFoundException(id));
        }
      }
     
    private deleteTypeDocument = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.TypeDocumentRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }
}

export default TypeDocumentController