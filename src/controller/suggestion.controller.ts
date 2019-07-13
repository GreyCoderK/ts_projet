import * as express from 'express'
import { getRepository } from 'typeorm';
import validationMiddleware from '../middleware/validation.middleware';
import NotFoundException from '../exception/notFoundException';
import Controller from '../interfaces/controller.interface';
import { Suggestion } from 'entity/Suggestion';
import { upload } from 'utils/functions.utils';
import { Document } from 'entity/Document';
import { SuggestionDto } from 'dto/suggestion.dto';
import { User } from 'entity/User';
import { Notification } from 'entity/Notification';

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
        this.router.put(`${this.path}/:id`, validationMiddleware(SuggestionDto, true), upload.single('suggestion'),this.modifySuggestion);
        this.router.delete(`${this.path}/:id`, this.deleteSuggestion);
        this.router.post(this.path, validationMiddleware(SuggestionDto), upload.single('suggestion'),this.createASuggestion);
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
        if(request.file.filename){
            var document = new Document()
            document.libelle = request.file.filename
            document.classe = getDocument[0].classe
            document.description = suggestion.description
            document.path = `public/uploads/${request.file.filename}`
            document.typeDocument = getDocument[0].typeDocument
            var user = await getRepository(User).findOne(request.user._id)
            document.user = user
            suggestion.document = await getRepository(Document).save(document)
            user.documents.push(suggestion.document)
            await getRepository(User).save(user)
        }

        const newSuggestion = this.suggestionRepository.create(suggestion);
        var sug = await this.suggestionRepository.save(newSuggestion);
        getDocument[0].suggestions.push(sug)
        getRepository(Document).save(getDocument[0])
        
        var notification = new Notification()
        notification.user = getDocument[0].user
        notification.type = "Suggestion"
        notification.message = `Le document avec le libelle: ${getDocument[0].libelle} viens de recevoir une suggestion`
        await getRepository(Notification).save(notification)
        response.send(newSuggestion);
    }

    private modifySuggestion = async (request, response, next) => {
        const id = request.params.id;
        const suggestion = await this.suggestionRepository.findOne(id);
        suggestion.libelle =  request.body.libelle
        suggestion.description = request.body.description
        
        var getDocument = await getRepository(Document).find(request.body.document_id)
        if(!getDocument[0]) {
            next(new NotFoundException(`Le document avec ${request.body.document_id} `))
        }
        if(request.file.filename){
            var document = new Document()
            document.libelle = request.file.filename
            document.classe = getDocument[0].classe
            document.description = suggestion.description
            document.path = `public/uploads/${request.file.filename}`
            document.typeDocument = getDocument[0].typeDocument
            suggestion.document = await getRepository(Document).save(document)
        }

        await this.suggestionRepository.update(id, suggestion);
        const updatedSuggestion = await this.suggestionRepository.findOne(id);
        if (updatedSuggestion) {
            var notification = new Notification()
            notification.user = getDocument[0].user
            notification.type = "Suggestion"
            notification.message = `La suggestion avec le libelle: ${updatedSuggestion.libelle} viens d'etre modifie document ${getDocument[0].libelle}`
            await getRepository(Notification).save(notification)
            response.send(updatedSuggestion);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteSuggestion = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.suggestionRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }
}

export default SuggestionController