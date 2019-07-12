import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as https from "https"
import * as fs from "fs"
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

import * as cors from "cors"

import * as cluster from 'cluster'
import * as os from 'os'
import { createServer } from "tls";

class App {
    public app: express.Application
    public port: number
    private server

    constructor (controllers: Controller[], port: number) {
        this.app = express()
        this.port = port

        this.initializedMiddlewares()
        this.initializedControllers(controllers)
        this.initializeErrorHandling();
    }

    private initializedMiddlewares(){
        this.app.use(morgan("dev"))
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
    }

    private initializedControllers(controllers: Controller[]){
        controllers.forEach((controller) => {
            this.app.use('/',controller.router)
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    /*
    private async createServer() {
        const [key, cert] = await Promise.all([
            fs.readFileSync('./key.pem'),
            fs.readFileSync('./certificate.pem')
        ])
        this.server = https.createServer({ key, cert }, this.app)
    }
    */

    private async nbreCluster() {
        const numberOfCores = os.cpus().length;
        //await this.createServer()
        if (cluster.isMaster) {
            console.log(`Master ${process.pid} started`);
            for (let i = 0; i < numberOfCores; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker) => {
                console.log(`worker ${worker.process.pid} stopped working`);
                cluster.fork();
            })
            cluster.on('fork', (worker) => {
                console.log(`Worker ${worker.process.pid} started`);
            })
        } else {
            console.log(`Worker ${process.pid} started`)
            this.app.listen(this.port, () => {
                console.log(`L'application a demarre avec succes sur le port ${this.port}`)
            })
        }
    }

    public async listen(){
        /**
         const [key, cert] = await Promise.all([
            fs.readFileSync('../key.pem'),
            fs.readFileSync('../certificate.pem')
        ]);
        console.log(`Worker ${process.pid} started`);
        https.createServer({ key, cert }, this.app).listen(this.port, () => {
            console.log(`L'application a demarre avec succes sur le port ${this.port} en https`)
        })  
         */
        await this.nbreCluster()
    }
    
}

export default App