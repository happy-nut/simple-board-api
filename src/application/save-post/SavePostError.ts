import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'POST_CREATING_FAILED'
  | 'POST_NOT_FOUND'
  | 'AUTHOR_NOT_FOUND'
  | 'POST_UPDATING_FAILED'

export class SavePostError extends UseCaseError<ErrorCodes> {
  static postCreatingFailed (): SavePostError {
    return new SavePostError('POST_CREATING_FAILED')
  }

  static postNotFound (): SavePostError {
    return new SavePostError('POST_NOT_FOUND')
  }

  static authorNotFound (): SavePostError {
    return new SavePostError('AUTHOR_NOT_FOUND')
  }

  static postUpdatingFailed (): SavePostError {
    return new SavePostError('POST_UPDATING_FAILED')
  }
}
