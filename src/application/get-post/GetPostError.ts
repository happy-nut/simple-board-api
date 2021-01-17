import { UseCaseError } from '../../shared/ddd'

export enum GetPostErrorCodes {
  POST_NOT_FOUND,
  AUTHOR_NOT_FOUND
}

export class GetPostError extends UseCaseError<GetPostErrorCodes> {
  static postNotFound (): GetPostError {
    return new GetPostError(GetPostErrorCodes.POST_NOT_FOUND)
  }

  static authorNotFound (): GetPostError {
    return new GetPostError(GetPostErrorCodes.AUTHOR_NOT_FOUND)
  }
}
