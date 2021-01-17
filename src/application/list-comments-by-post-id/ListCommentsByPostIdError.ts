import { UseCaseError } from '../../shared/ddd'

export enum ListCommentsByPostIdErrorCodes {
  NOT_FOUND
}

export class ListCommentsByPostIdError extends UseCaseError<ListCommentsByPostIdErrorCodes> {
  static postNotFound (): ListCommentsByPostIdError {
    return new ListCommentsByPostIdError(ListCommentsByPostIdErrorCodes.NOT_FOUND)
  }
}
