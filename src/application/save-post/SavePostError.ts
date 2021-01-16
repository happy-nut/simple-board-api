import { UseCaseError } from '../../shared/ddd'

type ErrorCodes = 'POST_SAVING_FAILED'

export class SavePostError extends UseCaseError<ErrorCodes> {
  static postSavingFailed (): SavePostError {
    return new SavePostError('POST_SAVING_FAILED')
  }
}
