
import HttpException from './httpException';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, "Token d'authentification manquant");
  }
}

export default AuthenticationTokenMissingException;