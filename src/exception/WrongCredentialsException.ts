import HttpException from './httpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "Mauvaises informations d'identification fournies");
  }
}

export default WrongCredentialsException;