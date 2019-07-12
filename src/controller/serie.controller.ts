import * as express from 'express'
import Controller from "interfaces/controller.interface";
import { getRepository } from 'typeorm';
import validationMiddleware from 'middleware/validation.middleware';
import NotFoundException from 'exception/notFoundException';
import { Serie } from 'entity/Serie';
import { SerieDto } from 'dto/serie.dto';

class SerieController implements Controller{
    public path = '/serie';
    public router = express.Router();
    
    private serieRepository = getRepository(Serie);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllSerie)
        this.router.get(`${this.path}/:id`, this.getSerie);
        this.router.put(`${this.path}/:id`, validationMiddleware(SerieDto, true),this.modifySerie);
        this.router.delete(`${this.path}/:id`, this.deleteSerie);
        this.router.post(this.path, validationMiddleware(SerieDto),this.createASerie);
    }

    private getAllSerie = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const actualites = await this.serieRepository.find()
        response.send(actualites)
    }

    private getSerie = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const actualite = await this.findSerie(id);
        if (actualite) {
          response.send(actualite);
        } else {
          next(new NotFoundException(id));
        }
    }

    private modifySerie = async (request, response, next) => {
        const id = request.params.id;
        const serie = await this.serieRepository.findOne(id)
        
        serie.libelle =request.body.libelle
        
        await this.serieRepository.update(id, serie);
        const updatedSerie = await this.serieRepository.findOne(id);
        if (updatedSerie) {
          response.send(updatedSerie);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteSerie = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.serieRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }

    private createASerie = async (request, response, next) => {
        const serie = new Serie()
        serie.libelle =request.body.libelle
        const newSerie = this.serieRepository.create(serie);
        await this.serieRepository.save(newSerie);
        response.send(newSerie);
    }

    private findSerie = async (item) => {
        return await this.serieRepository.findOne(item) || this.serieRepository.findOne({libelle:item})
    }
}

export default SerieController