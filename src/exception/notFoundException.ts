import HttpException from "./HttpException";
 
class NotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `${id} n'a pas ete retrouve`);
  }
}
 
export default NotFoundException;