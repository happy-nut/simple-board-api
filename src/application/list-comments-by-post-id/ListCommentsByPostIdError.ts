import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'ListCommentsByPostIdError.POST_NOT_FOUND'

export class ListCommentsByPostIdError extends UseCaseError<ErrorCodes> {
  static postNotFound (): ListCommentsByPostIdError {
    return new ListCommentsByPostIdError('ListCommentsByPostIdError.POST_NOT_FOUND')
  }
}
