import HttpException from './httpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `l'utilisateur avec cet ${email} existe deja`);
  }
}

export default UserWithThatEmailAlreadyExistsException;