import "reflect-metadata"
import {createConnection} from "typeorm"
import App from "./App"
import ClasseController from "./controller/classe.controller"
import TypeUserController from "./controller/type_user.controller"
import TypeDocumentController from "./controller/type_document.controller"
import ActualiteController from "controller/actualite.controller";
import LogicielController from "controller/logiciel.controller";
import NoteController from "controller/note.controller";
import SerieController from "controller/serie.controller";
import UserController from "controller/user.controller";
import ExtensionController from "controller/extension_autoriser.controller";
import DocumentController from "controller/document.controller";
import SuggestionController from "controller/suggestion.controller";

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
        new TypeDocumentController(),
        new ActualiteController(),
        new LogicielController(),
        new NoteController(),
        new SerieController(),
        new UserController(),
        new ExtensionController(),
        new DocumentController(),
        new SuggestionController()
      ],
      7777
    );
    await app.listen();
})();