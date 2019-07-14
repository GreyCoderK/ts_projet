import * as express from 'express'
import Controller from "../interfaces/controller.interface";
import { getRepository } from 'typeorm';
import { Logiciel } from '../entity/Logiciel';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { logicielDto } from '../dto/logiciel.dto';
import NotFoundException from '../exception/notFoundException';
import { upload } from '../utils/functions.utils';
import { createWriteStream } from 'fs';
import { get } from 'http';

class LogicielController implements Controller{
    public path = '/logiciel';
    public router = express.Router();
    
    private logicielRepository = getRepository(Logiciel);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllLogiciel)
        this.router.get(`${this.path}/:id`, this.getLogicielById);
        this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(logicielDto, true), upload.single('logiciel'),this.modifyLogiciel);
        this.router.delete(`${this.path}/:id`, authMiddleware,this.deleteLogiciel);
        this.router.post(this.path, authMiddleware,validationMiddleware(logicielDto), upload.single('logiciel'),this.createALogiciel);
        this.router.post(`${this.path}/download/logiciel`, this.dowloadLogiciel);
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
        
        if(request.file.filename) {
            logiciel.libelle = request.file.filename
            logiciel.path = '/public/uploads/'+request.file.filename
        }

        logiciel.description = request.body.description

        await this.logicielRepository.update(id, logiciel);
        const updatedLogiciel = await this.logicielRepository.findOne(id);
        if (updatedLogiciel) {
          response.send(updatedLogiciel);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteLogiciel = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.logicielRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }

    private createALogiciel = async (request, response, next) => {
        const logiciel = new Logiciel()
        
        if(request.file.filename) {
            logiciel.libelle = request.file.filename
            logiciel.path = '/public/uploads/'+request.file.filename
            logiciel.description = request.body.description

            const newLogiciel = this.logicielRepository.create(logiciel);
            await this.logicielRepository.save(newLogiciel);
            response.send(newLogiciel)
        }
    }

    public dowloadLogiciel = async (request, response, next) => {
        var logiciel = await this.logicielRepository.findOne(Number(request.body.logiciel_id))
        const file = createWriteStream(logiciel.path)
        const req = get(`localhost:7777/logiciel/J---aiyznGQ/${logiciel.libelle}`,function(response) {
            response.pipe(file)
            file.on('finish', function() {
                file.close()
                next(this.incrementDownload(logiciel.id))
            })
        })
    }

    public incrementDownload = (item) => {
        async (request, response, next) => {
            const logiciel = await this.logicielRepository.findOne(item)
        
            logiciel.telechargement++

            await this.logicielRepository.update(item, logiciel);
            const updatedLogiciel = await this.logicielRepository.findOne(item);
            if (updatedLogiciel) {
                response.send(updatedLogiciel);
            } else {
                next(new NotFoundException(item));
            }
        }
    }
}

export default LogicielController