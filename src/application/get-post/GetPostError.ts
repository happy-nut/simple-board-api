import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'POST_NOT_FOUND' | 'AUTHOR_NOT_FOUND'

export class GetPostError extends UseCaseError<ErrorCodes> {
  static postNotFound (): GetPostError {
    return new GetPostError('POST_NOT_FOUND')
  }

  static authorNotFound (): GetPostError {
    return new GetPostError('AUTHOR_NOT_FOUND')
  }
}
