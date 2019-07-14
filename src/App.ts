import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as fs from "fs"
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

import * as cors from "cors"

import * as cluster from 'cluster'
import * as os from 'os'
import * as cookieParser from 'cookie-parser';  
import { createServer, Server } from "https";
import * as socketIo from "socket.io";

class App {
    public app: express.Application
    public port: number
    public io: SocketIO.Server;
    public server: Server

    constructor (controllers: Controller[], port: number) {
        this.app = express()
        this.port = port

        this.initializedMiddlewares()
        this.initializedControllers(controllers)
        this.initializeErrorHandling();

        this.setUpServer()
        this.sockets()

    }

    private initializedMiddlewares(){
        this.app.use(morgan("dev"))
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use('/static', express.static(__dirname + '/public'));
        this.app.use('/uploads', express.static(__dirname + '/public/uploads'));
    }

    private initializedControllers(controllers: Controller[]){
        controllers.forEach((controller) => {
            this.app.use('/',controller.router)
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private sockets(): void {
        this.io = socketIo(this.server)
    }
    
    private setUpServer() {

        this.server = createServer({ 
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem'),
            passphrase: 'test' 
        }, this.app)
        //this.server = createServer(this.app)
    }

    public listen(){
        const numberOfCores = os.cpus().length;
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
            
            this.server.listen(this.port, () => {
                console.log(`L'application a demarre avec succes sur le port ${this.port}`)
            })

            this.io.on('connect', (socket: any) => {
                console.log('Connected client on port %s.', this.port);
    
                socket.on('disconnect', () => {
                    console.log('Client disconnected');
                });
            });
        }
    }
    
}

export default App