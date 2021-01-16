import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'USER_CREATING_FAILED'

export class CreateUserError extends UseCaseError<ErrorCodes> {
  static userCreatingFailed (): CreateUserError {
    return new CreateUserError('USER_CREATING_FAILED')
  }
}
