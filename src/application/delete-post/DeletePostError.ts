import { UseCaseError } from '../../shared/ddd'

export enum DeletePostErrorCodes {
  NOT_FOUND
}

export class DeletePostError extends UseCaseError<DeletePostErrorCodes> {
  static postNotFound (): DeletePostError {
    return new DeletePostError(DeletePostErrorCodes.NOT_FOUND)
  }
}
