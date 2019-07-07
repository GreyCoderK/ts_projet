import * as express from "express"
import * as multer from "multer"
import * as path from "path"
import HttpException from "../exception/HttpException";
import { getRepository } from "typeorm";
import { ExtensionAutoriser } from "../entity/ExtensionAutoriser";

export var storage = (table: string) => {
        multer.diskStorage({ //multers disk storage settings
        destination: function (req: express.Resquest, file: express.Response, cb: express.NextFunction) {
            cb(null, './public/uploads/'+table)
        },
        filename: function (req: express.Resquest, file: express.Response, cb: express.NextFunction) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
}

export var getExtentions = () : Array<ExtensionAutoriser> => {
    let extensions: Array<ExtensionAutoriser> = []
    async (req: express.Resquest, res: express.Response, callback: express.NextFunction) => {
        let extensionRepository = getRepository(ExtensionAutoriser)
        extensions = await extensionRepository.find()            
    }
    return extensions
}

export var upload = (table: string) => {
        multer({ //multer settings
        storage: storage(table),
        fileFilter: function (req: express.Resquest, file: express.Response, callback: express.NextFunction) {
            let ext = path.extname(file.originalname);
            let extensions = getExtentions()
            if(extensions.find(el => el.libelle == ext )){
                callback(null, true)
            }else{
                callback(new HttpException(400,"L'exntension que vous utilise n'est pas reconnue"))                
            }
        },
        limits:{
            fileSize: 1024 * 1024
        }
    }).single('profilepic');
}
