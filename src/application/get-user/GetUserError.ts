import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'USER_NOT_FOUND'

export class GetUserError extends UseCaseError<ErrorCodes> {
  static useNotFound (): GetUserError {
    return new GetUserError('USER_NOT_FOUND')
  }
}
