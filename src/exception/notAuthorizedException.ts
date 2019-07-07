import HttpException from './httpException';

class NotAuthorizedException extends HttpException {
  constructor() {
    super(403, "Vous n'avez pas une autorisation d'acces");
  }
}

export default NotAuthorizedException;