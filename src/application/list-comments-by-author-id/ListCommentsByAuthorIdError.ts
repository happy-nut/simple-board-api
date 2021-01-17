import { UseCaseError } from '../../shared/ddd'

export enum ListCommentsByAuthorIdErrorCodes {
  NOT_FOUND
}

export class ListCommentsByAuthorIdError extends UseCaseError<ListCommentsByAuthorIdErrorCodes> {
  static authorNotFound (): ListCommentsByAuthorIdError {
    return new ListCommentsByAuthorIdError(ListCommentsByAuthorIdErrorCodes.NOT_FOUND)
  }
}
