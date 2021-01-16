import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'POST_NOT_FOUND'

export class DeletePostError extends UseCaseError<ErrorCodes> {
  static postNotFound (): DeletePostError {
    return new DeletePostError('POST_NOT_FOUND')
  }
}
