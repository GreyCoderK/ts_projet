import * as express from 'express'
import { getRepository } from 'typeorm';
import validationMiddleware from '../middleware/validation.middleware';
import {UserDto} from "../dto/user.dto"
import NotFoundException from '../exception/notFoundException';
import Controller from '../interfaces/controller.interface';
import { User } from 'entity/User';
import { upload } from 'utils/functions.utils';
import { Image } from 'entity/Image';
import { TypeUser } from 'entity/TypeUser';
import UserWithThatEmailAlreadyExistsException from 'exception/UserWithThatEmailAlreadyExistsException';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import TokenData from 'interfaces/dataToken.interface';
import DataStoredInToken from 'interfaces/dataStoredInToken';
import WrongCredentialsException from 'exception/WrongCredentialsException';
import { LogInDto } from 'dto/log_in.dto';

class UserController implements Controller {
    public path = '/user';
    public router = express.Router();
    
    private userRepository = getRepository(User);
    
    constructor() {
        this.intializeRoutes();
    }

    private intializeRoutes() {
        this.router.get(`${this.path}`, this.getAllUser)
        this.router.get(`${this.path}/:id`, this.getUserById);
        this.router.put(`${this.path}/:id`, validationMiddleware(UserDto, true), upload.single('photo'),this.modifyUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
        this.router.post(this.path, validationMiddleware(UserDto), upload.single('photo'),this.createAUser);
        this.router.post(`${this.path}/auth/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/auth/logout`, this.loggingOut);
    }

    private getAllUser = async (request: express.Request, response: express.Response) => {
        const users = await this.userRepository.find()
        response.send(users)
    }

    private getUserById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const user = await this.userRepository.find(id);
        if (user) {
          response.send(user);
        } else {
          next(new NotFoundException(`L'utilisateur avec ${id} `));
        }
    }
    
    private createAUser = async (request, response, next) => {
        const user = new User() 
        user.birthday =  request.body.birthday
        user.contact = request.body.contact
        user.email = request.body.email
        user.nom = request.body.nom
        user.prenoms = request.body.prenoms
        
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        user.password = hashedPassword
        
        var getUser = await this.userRepository.find({"email": request.body.email})
        
        if(!getUser[0]) {
            next(new UserWithThatEmailAlreadyExistsException(request.body.email))
        }

        if(request.body.type_user_id){
            var [type_user, count] = await getRepository(TypeUser).findAndCount(request.body.type_user_id)
            if(count == 0){
                next(new NotFoundException(`Le type utilisateur avec ${request.body.type_user_id} `))
            }
            user.typeUser = type_user[0]
        }

        if(request.file.filename) {
            const image = new Image()
            image.libelle = request.file.filename
            image.path = '/public/uploads/'+request.file.filename
            var new_image = await getRepository(Image).save(image)
            user.images.push(new_image)
        }
        const newUser = this.userRepository.create(user);
        var n = await this.userRepository.save(newUser);
        
        try {
            const {
              cookie,
              userData,
            } = await this.register(n);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(userData);
        } catch (error) {
            next(error);
        }
    }

    private modifyUser = async (request, response, next) => {
        const id = request.params.id;
        const user = await this.userRepository.find(id)
        
        user[0].birthday =  request.body.birthday
        user[0].contact = request.body.contact
        user[0].email = request.body.email
        user[0].nom = request.body.nom
        user[0].prenoms = request.body.prenoms
        
        var [_, count] = await this.userRepository.findAndCount({"email": request.body.email})
        
        if(count >= 2) {
            next(new UserWithThatEmailAlreadyExistsException(request.body.email))
        }

        if(request.body.type_user_id){
            var [type_user, count] = await getRepository(TypeUser).findAndCount(request.body.type_user_id)
            if(count == 0){
                next(new NotFoundException(`Le type utilisateur avec ${request.body.type_user_id} `))
            }
            user[0].typeUser = type_user[0]
        }

        if(request.file.filename) {
            const image = new Image()
            image.libelle = request.file.filename
            image.path = '/public/uploads/'+request.file.filename
            var new_image = await getRepository(Image).save(image)
            user[0].images.push(new_image)
        }
        
        await this.userRepository.update(id, user[0]);
        const updatedUser = await this.userRepository.findOne(id);
        if (updatedUser) {
          response.send(updatedUser);
        } else {
          next(new NotFoundException(`L'utilisateur avec ${id} `));
        }
    }
     
    private deleteUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.userRepository.delete(id);
        if (deleteResponse.raw[1]) {
            response.sendStatus(200);
        } else {
            next(new NotFoundException(`L'utilisateur avec ${id} `));
        }
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
          _id: user.id,
        };
        return {
          expiresIn,
          token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }

    public async register(userData) {
        userData.password = undefined;
        const tokenData = this.createToken(userData);
        const cookie = this.createCookie(tokenData);
        return {
          cookie,
          userData,
        };
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        const user = await this.userRepository.findOne({ email: logInData.email });
        if (user) {
          const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
          if (isPasswordMatching) {
            user.password = undefined;
            const tokenData = this.createToken(user);
            response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            response.send(user);
          } else {
            next(new WrongCredentialsException());
          }
        } else {
          next(new WrongCredentialsException());
        }
    }
    
    private loggingOut = (request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        response.send(200);
    }
}

export default UserController