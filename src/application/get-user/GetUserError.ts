import { UseCaseError } from '../../shared/ddd'

export enum GetUserErrorCodes {
  NOT_FOUND
}

export class GetUserError extends UseCaseError<GetUserErrorCodes> {
  static useNotFound (): GetUserError {
    return new GetUserError(GetUserErrorCodes.NOT_FOUND)
  }
}
