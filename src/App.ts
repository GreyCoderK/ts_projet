import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
    public app: express.Application
    public port: number

    constructor (controllers: Controller[], port: number) {
        this.app = express()
        this.port = port

        this.initializedMiddlewares()
        this.initializedControllers(controllers)
        this.initializeErrorHandling();
    }

    private initializedMiddlewares(){
        this.app.use(morgan("dev"))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private initializedControllers(controllers: Controller[]){
        controllers.forEach((controller) => {
            this.app.use('/',controller.router)
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log(`L'application a demarre avec succes sur le port ${this.port}`)
        })
    }
}

export default App