import * as multer from "multer"
import * as path from "path"
import * as crypto from "crypto"
import HttpException from "../exception/HttpException";
import { getRepository } from "typeorm";
import { ExtensionAutoriser } from "../entity/ExtensionAutoriser";

var algorithm = 'aes-256-ctr'
var password = 'd6F3Efeq'

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

export var getExtentions = () : Array<ExtensionAutoriser> => {
    let extensions: Array<ExtensionAutoriser> = []
    async (req, res, callback) => {
        let extensionRepository = getRepository(ExtensionAutoriser)
        extensions = await extensionRepository.find()            
    }
    return extensions
}

export var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
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
});

export var encrypt = (buffer) => {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = Buffer.concat([cipher.update(buffer),cipher.final()])
    return crypted
}

export var decrypt = (buffer) => {
    var decipher = crypto.createDecipher(algorithm,password)
    var crypted = Buffer.concat([decipher.update(buffer),decipher.final()])
    return crypted
}