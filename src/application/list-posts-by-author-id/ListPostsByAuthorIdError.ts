import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'AUTHOR_NOT_FOUND'

export class ListPostsByAuthorIdError extends UseCaseError<ErrorCodes> {
  static authorNotFound (): ListPostsByAuthorIdError {
    return new ListPostsByAuthorIdError('AUTHOR_NOT_FOUND')
  }
}
