import * as express from 'express'
import { getRepository } from 'typeorm';
import controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware';
import {Classe} from '../entity/Classe'
import {ClasseDto} from "../dto/classe.dto"
import NotFoundException from '../exception/notFoundException';
import { Serie } from '../entity/Serie';

class ClasseController implements controller {

    public path = '/classe';
    public router = express.Router();
    
    private classeRepository = getRepository(Classe);
    
    constructor() {
        this.intializeRoutes();
    }
    
    public intializeRoutes() {
        this.router.get(this.path, this.getAllClasse);
        this.router.get(`${this.path}/:id`, this.getClasse);
        this.router.put(`${this.path}/:id`, validationMiddleware(ClasseDto, true),this.modifyClasse);
        this.router.delete(`${this.path}/:id`, this.deleteClasse);
        this.router.post(this.path, validationMiddleware(ClasseDto),this.createAClasse);
    }
    
    private getAllClasse = async (request: express.Request, response: express.Response) => {
        const classes = await this.classeRepository.find()
        response.send(classes)
    }

    private getClasse = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const classe = await this.findClasse(id);
        if (classe) {
          response.send(classe);
        } else {
          next(new NotFoundException(id));
        }
    }
    
    private createAClasse = async(request: express.Request, response: express.Response,next: express.NextFunction) => {
      const classe = new Classe()
      classe.libelle = request.body.libelle
      if(request.body.series){
        request.body.series.forEach(async serie => {
          var new_serie = await getRepository(Serie).findOne(serie)
          if(!new_serie){
            next(new NotFoundException(`La serie avec ${serie} `))
          }
          classe.series.push(new_serie)
        });
      }
      const newClasse = this.classeRepository.create(classe);
      await this.classeRepository.save(newClasse);
      response.send(newClasse);
    }

    private modifyClasse = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const classe = new Classe()
        classe.libelle = request.body.libelle
        var series = []
        if(request.body.series){
          request.body.series.forEach(async serie => {
            var new_serie = await getRepository(Serie).findOne(serie)
            if(!new_serie){
              next(new NotFoundException(`La serie avec ${serie} `))
            }
            series.push(new_serie)
          });
        }

        classe.series = series
        await this.classeRepository.update(id, classe);
        const updatedClasse = await this.classeRepository.findOne(id);
        if (updatedClasse) {
          response.send(updatedClasse);
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

    private findClasse = async (item) => {
      return await this.classeRepository.findOne(item) || this.classeRepository.findOne({"libelle" :item})
    }
}

export default ClasseController