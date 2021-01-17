import { UseCaseError } from '../../shared/ddd'

export enum CreateUserErrorCodes {
  FAILED_TO_CREATE
}

export class CreateUserError extends UseCaseError<CreateUserErrorCodes> {
  static userCreatingFailed (): CreateUserError {
    return new CreateUserError(CreateUserErrorCodes.FAILED_TO_CREATE)
  }
}
