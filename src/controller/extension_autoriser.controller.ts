import * as express from 'express'
import { getRepository } from 'typeorm';
import controller from '../interfaces/controller.interface'
import validationMiddleware from '../middleware/validation.middleware';
import NotFoundException from '../exception/notFoundException';
import { ExtensionDto } from '../dto/extension_autoriser.dto';
import { ExtensionAutoriser } from '../entity/ExtensionAutoriser';

class ExtensionController implements controller {
    
  public path = '/extension';
  public router = express.Router();
  
  private extensionRepository = getRepository(ExtensionAutoriser);
  
  constructor() {
    this.intializeRoutes();
  }
  
  public intializeRoutes() {
    this.router.get(this.path, this.getAllExtension);
    this.router.get(`${this.path}/:id`, this.getExtension);
    this.router.put(`${this.path}/:id`, validationMiddleware(ExtensionDto, true),this.modifyExtension);
    this.router.delete(`${this.path}/:id`, this.deleteExtension);
    this.router.post(this.path, validationMiddleware(ExtensionDto),this.createAExtension);
  }
    
  private getAllExtension = async (request: express.Request, response: express.Response) => {
    const extensions = await this.extensionRepository.find()
    response.send(extensions)
  }

  private getExtension = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const extension = await this.findExtension(id)
    if (extension) {
      response.send(extension);
    } else {
      next(new NotFoundException(id));
    }
  }
    
  private createAExtension = async(request: express.Request, response: express.Response) => {
    const extension: ExtensionAutoriser = request.body
    const newExtension = this.extensionRepository.create(extension);
    await this.extensionRepository.save(newExtension);
    response.send(newExtension);
  }

  private modifyExtension = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const extension: ExtensionAutoriser = request.body;
    await this.extensionRepository.update(id, extension);
    const updatedExtension = await this.extensionRepository.findOne(id);
    if (updatedExtension) {
      response.send(updatedExtension);
    } else {
      next(new NotFoundException(id));
    }
  }
     
  private deleteExtension = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const deleteResponse = await this.extensionRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.sendStatus(200);
    } else {
      next(new NotFoundException(id));
    }
  }
  
  private findExtension = async (item) => {
    return await this.extensionRepository.findOne(item) || this.extensionRepository.findOne({libelle:item})
  }
}

export default ExtensionController