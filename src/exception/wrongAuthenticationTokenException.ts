
import HttpException from './httpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Mauvais token d'authentification");
  }
}

export default WrongAuthenticationTokenException;