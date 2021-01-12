import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'USER_ALREADY_CREATED'

export class CreateUserError extends UseCaseError<ErrorCodes> {
  static userAlreadyCreated (): CreateUserError {
    return new CreateUserError('USER_ALREADY_CREATED')
  }
}
