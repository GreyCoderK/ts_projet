import * as express from 'express'
import Controller from "interfaces/controller.interface";
import { Actualite } from "entity/Actualite";
import { getRepository } from 'typeorm';
import validationMiddleware from 'middleware/validation.middleware';
import { upload } from 'utils/functions.utils';
import authMiddleware from 'middleware/auth.middleware';
import { ActualiteDto } from 'dto/actualite.dto';
import NotFoundException from 'exception/notFoundException';
import { Image } from 'entity/Image';

class ActualiteController implements Controller{
    public path = '/actualite';
    public router = express.Router();
    
    private actualiteRepository = getRepository(Actualite);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllActualite)
        this.router.get(`${this.path}/:id`, this.getActualiteById);
        this.router.put(`${this.path}/:id`, authMiddleware,validationMiddleware(ActualiteDto, true), upload.array('photos',12),this.modifyActualite);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteActualite);
        this.router.post(this.path, authMiddleware,validationMiddleware(ActualiteDto), upload.array('photos',12),this.createAActualite);
    }

    private getAllActualite = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const actualites = await this.actualiteRepository.find()
        response.send(actualites)
    }

    private getActualiteById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const actualite = await this.actualiteRepository.find(id);
        if (actualite) {
          response.send(actualite);
        } else {
          next(new NotFoundException(id));
        }
    }

    private modifyActualite = async (request, response, next) => {
        const id = request.params.id;
        const actualite = await this.actualiteRepository.findOne(id)
        
        actualite.new =request.body.new
        actualite.libelle =request.body.libelle
        actualite.date =request.body.date
        actualite.description =request.body.description
        
        var images = []

        if(request.files){
            request.files.array.forEach( async file => {
                if(file.filename) {
                    const image = new Image()
                    image.libelle = file.filename
                    image.path = '/public/uploads/'+file.filename
                    var new_image = await getRepository(Image).save(image)
                    images.push(new_image)
                }
            });
        }
        actualite.images = images
        await this.actualiteRepository.update(id, actualite);
        const updatedActualite = await this.actualiteRepository.findOne(id);
        if (updatedActualite) {
          response.send(updatedActualite);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteActualite = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.actualiteRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }

    private createAActualite = async (request, response, next) => {
        const actualite = new Actualite()
        actualite.new =request.body.new
        actualite.libelle =request.body.libelle
        actualite.date =request.body.date
        actualite.description =request.body.description
        if(request.files){
            request.files.array.forEach( async file => {
                if(file.filename) {
                    const image = new Image()
                    image.libelle = file.filename
                    image.path = '/public/uploads/'+file.filename
                    var new_image = await getRepository(Image).save(image)
                    actualite.images.push(new_image)
                }
            });
        }

        const newActualite = this.actualiteRepository.create(actualite);
        await this.actualiteRepository.save(newActualite);
        response.send(newActualite);
    }
}

export default ActualiteController