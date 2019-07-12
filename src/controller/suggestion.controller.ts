import * as express from 'express'
import { getRepository } from 'typeorm';
import validationMiddleware from '../middleware/validation.middleware';
import NotFoundException from '../exception/notFoundException';
import Controller from '../interfaces/controller.interface';
import { Suggestion } from 'entity/Suggestion';
import { upload } from 'utils/functions.utils';
import { Document } from 'entity/Document';

class SuggestionController implements Controller {
    public router = express.Router()
    public path = '/suggestion'

    private suggestionRepository = getRepository(Suggestion)

    constructor(){
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllSuggestion)
        this.router.get(`${this.path}/:id`, this.getSuggestionById);
        this.router.put(`${this.path}/:id`, validationMiddleware(SuggestionDto, true), upload.single('photo'),this.modifySuggestion);
        this.router.delete(`${this.path}/:id`, this.deleteSuggestion);
        this.router.post(this.path, validationMiddleware(SuggestionDto), upload.single('photo'),this.createASuggestion);
    }

    private getAllSuggestion = async (request: express.Request, response: express.Response) => {
        const suggestions = await this.suggestionRepository.find()
        response.send(suggestions)
    }

    private getSuggestionById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const suggestion = await this.suggestionRepository.find(id);
        if (suggestion) {
          response.send(suggestion);
        } else {
          next(new NotFoundException(id));
        }
    }
    
    private createASuggestion = async (request, response, next) => {
        const suggestion = new Suggestion() 
        suggestion.libelle =  request.body.libelle
        suggestion.description = request.body.description
        
        var getDocument = await getRepository(Document).find(request.body.document_id)
        if(!getDocument[0]) {
            next(new NotFoundException(`Le document avec ${request.body.document_id} `))
        }
        suggestion.document = getDocument[0]

        const newSuggestion = this.suggestionRepository.create(suggestion);
        var sug = await this.suggestionRepository.save(newSuggestion);
        getDocument[0].suggestions.push(sug)
        getRepository(Document).save(getDocument[0])
        
        response.send(newSuggestion);
    }
}