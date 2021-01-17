import { UseCaseError } from '../../shared/ddd'

export enum SavePostErrorCodes {
  FAILED_TO_CREATE,
  POST_NOT_FOUND,
  AUTHOR_NOT_FOUND,
  FAILED_TO_UPDATE
}

export class SavePostError extends UseCaseError<SavePostErrorCodes> {
  static postCreatingFailed (): SavePostError {
    return new SavePostError(SavePostErrorCodes.FAILED_TO_CREATE)
  }

  static postNotFound (): SavePostError {
    return new SavePostError(SavePostErrorCodes.POST_NOT_FOUND)
  }

  static authorNotFound (): SavePostError {
    return new SavePostError(SavePostErrorCodes.AUTHOR_NOT_FOUND)
  }

  static postUpdatingFailed (): SavePostError {
    return new SavePostError(SavePostErrorCodes.FAILED_TO_UPDATE)
  }
}
