import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'AUTHOR_NOT_FOUND'

export class ListPostsError extends UseCaseError<ErrorCodes> {
  static authorNotFound (): ListPostsError {
    return new ListPostsError('AUTHOR_NOT_FOUND')
  }
}
