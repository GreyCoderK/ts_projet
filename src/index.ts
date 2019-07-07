import "reflect-metadata";
import {createConnection} from "typeorm";
import App from "./App"
import ClasseController from "./controller/classe.controller";
import TypeUserController from "./controller/type_user.controller";
import TypeDocumentController from "./controller/type_document.controller";

(async () => {
    try {
      await createConnection();
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    const app = new App(
        [
            new ClasseController(),
            new TypeUserController(),
            new TypeDocumentController()
        ],
    7777);
    app.listen();
})();