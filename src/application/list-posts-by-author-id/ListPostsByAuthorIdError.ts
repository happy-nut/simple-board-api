import { UseCaseError } from '../../shared/ddd'

export enum ListPostsByAuthorIdErrorCodes {
  NOT_FOUND
}

export class ListPostsByAuthorIdError extends UseCaseError<ListPostsByAuthorIdErrorCodes> {
  static authorNotFound (): ListPostsByAuthorIdError {
    return new ListPostsByAuthorIdError(ListPostsByAuthorIdErrorCodes.NOT_FOUND)
  }
}
