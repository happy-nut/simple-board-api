import { CustomError } from 'ts-custom-error'

export class UseCaseError<C> extends CustomError {
  protected constructor (public readonly code: C) {
    super()
  }
}
