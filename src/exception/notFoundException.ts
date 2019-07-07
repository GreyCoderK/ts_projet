import HttpException from "./HttpException";
 
class NotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `L'element avec l'identifiant ${id} n'a pas ete retrouve`);
  }
}
 
export default NotFoundException;