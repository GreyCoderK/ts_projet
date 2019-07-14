import * as express from 'express'
import Controller from "../interfaces/controller.interface";
import { getRepository } from "typeorm";
import { Commentaire } from "../entity/Commentaire";
import NotFoundException from '../exception/notFoundException';

class CommentaireController implements Controller {
    public path = '/commentaire';
    public router = express.Router();
    
    private commentaireRepository = getRepository(Commentaire);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes = () => {
        this.router.get(`${this.path}`, this.getAllCommentaire)
        this.router.get(`${this.path}/:id`, this.getCommentaireById);
        this.router.delete(`${this.path}/:id`, this.deleteCommentaire);
    }

    private getAllCommentaire = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const commentaires = await this.commentaireRepository.find()
        response.send(commentaires)
    }

    private getCommentaireById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const commentaire = await this.commentaireRepository.findOne(id);
        if (commentaire) {
          response.send(commentaire);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteCommentaire = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.commentaireRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }
}

export default CommentaireController