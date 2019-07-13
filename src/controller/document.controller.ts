import * as express from 'express'
import { getRepository } from 'typeorm';
import Controller from 'interfaces/controller.interface';
import { Document } from 'entity/Document';
import { resolve, join } from 'path';
import { createWriteStream } from 'fs';
import NotFoundException from 'exception/notFoundException';
import { User } from 'entity/User';
import { Abonnement } from 'entity/Abonnement';
import authMiddleware from 'middleware/auth.middleware';
import validationMiddleware from 'middleware/validation.middleware';
import { DocumentDto } from 'dto/document.dto';
import { get } from 'http';
import { Notification } from 'entity/Notification';
import HttpException from 'exception/HttpException';
import { TypeDocument } from 'entity/TypeDocument';

class DocumentController implements Controller {
    public path = '/document';
    public router = express.Router();
    
    private documentRepository = getRepository(Document);
    
    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(`${this.path}/lire_document`, this.readFile);
        this.router.get(`${this.path}`, this.getAllDocument)
        this.router.get(`${this.path}/:id`, this.getDocumentById);
        this.router.delete(`${this.path}/:id`, this.deleteDocument);
        this.router.post(`${this.path}/abonnement/document`, authMiddleware, this.abonnementDocument);
        this.router.post(this.path, authMiddleware, validationMiddleware(DocumentDto),this.createADocument);
        this.router.put(`${this.path}/:id`, authMiddleware,validationMiddleware(DocumentDto, true),this.modifyDocument);
        this.router.post(`${this.path}/download/document`, this.dowloadDocument);
    }

    public readFile = async (req, res, next) => {
        const id = req.params.id;
        const document = await this.documentRepository.findOne(id);

        var fileBase = 'public/uploads'
        var fileLoc = resolve(fileBase);
        fileLoc = join(fileLoc, document.libelle);

        get(`${fileLoc}`, function(res) {
            var data = []
            res.on("data", function(chunk) {
                data.push(chunk);
            })

            res.on("end", function() {
                var donnee = Buffer.concat(data);
                var myMessage = myMessage.decode(donnee);
            });
        })

        document.nombreVue++
        var newDoc = await this.documentRepository.update(id, document)
        res.send(newDoc)
    }

    private getAllDocument = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const documents = await this.documentRepository.find()
        response.send(documents)
    }

    private getDocumentById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const document = await this.documentRepository.findOne(id);
        if (document) {
          response.send(document);
        } else {
          next(new NotFoundException(id));
        }
    }

    private deleteDocument = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        var document = await this.documentRepository.findOne(id)
        document.abonnements.forEach( async abonnement => {
            var notification = new Notification()
            notification.user = abonnement.user
            notification.type = "Document"
            notification.message = `Le document avec le libelle: ${document.libelle} viens d'etre supprime`
            await getRepository(Notification).save(notification)
        })
        const deleteResponse = await this.documentRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(id));
        }
    }

    private abonnementDocument = async (request, response, next) => {
        var user = await getRepository(User).findOne(request.user._id)
        var document = await this.documentRepository.findOne(request.body.document_id)
        var abonnement = new Abonnement()
        
        abonnement.document = document
        abonnement.user = user

        var newAbonnement = await getRepository(Abonnement).save(abonnement)
        user.abonnements.push(newAbonnement)
        getRepository(User).save(user)
        response.send(newAbonnement)
    }

    private createADocument = async (request, response, next) => {
        if(request.file.filename){
            var document = new Document()
            document.libelle = request.file.filename
            document.classe = request.body.classe
            document.description = request.body.description
            document.path = `public/uploads/${request.file.filename}`
            document.typeDocument = await getRepository(TypeDocument).findOne(request.body.typeDocument)
            document.user = await getRepository(User).findOne(request.user._id)
            var newDoc = await this.documentRepository.save(document)
            response.send(newDoc)
        }else{
            throw new HttpException(403, "Aucun document")
        }
    }

    private modifyDocument =  async (request, response, next) => {
        const id = request.params.id;
        
        if(request.file.filename){
            var document = await getRepository(Document).findOne(id)
            document.libelle = request.file.filename
            document.classe = request.body.classe
            document.description = request.body.description
            document.path = `public/uploads/${request.file.filename}`
            document.typeDocument = await getRepository(TypeDocument).findOne(request.body.typeDocument)
            var updateDoc = await this.documentRepository.save(document)
            updateDoc.abonnements.forEach( async abonnement => {
                var notification = new Notification()
                notification.user = abonnement.user
                notification.type = "Document"
                notification.message = `Le document avec le libelle: ${document.libelle} viens d'etre modifie`
                await getRepository(Notification).save(notification)
            })
            response.send(updateDoc)
        }else{
            throw new HttpException(403, "Aucun document")
        }
    }

    public dowloadDocument = async (request, response, next) => {
        var document = await this.documentRepository.findOne(Number(request.body.document_id))
        const file = createWriteStream(document.path)
        const req = get(`localhost:7777/document/J---aiyznGQ/${document.libelle}`,function(response) {
            response.pipe(file)
            file.on('finish', function() {
                file.close()
                next(this.incrementDownload(document.id))
            })
        })
    }

    public incrementDownload = (item) => {
        async (request, response, next) => {
            const document = await this.documentRepository.findOne(item)
        
            document.telechargement++

            await this.documentRepository.update(item, document);
            const updatedDocument = await this.documentRepository.findOne(item);
            if (updatedDocument) {
                response.send(updatedDocument);
            } else {
                next(new NotFoundException(item));
            }
        }
    }
}

export default DocumentController