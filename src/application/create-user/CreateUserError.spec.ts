import { CreateUserError, CreateUserErrorCodes } from './CreateUserError'

describe('CreateUserError', () => {
  describe('.userCreatingFailed()', () => {
    it('creates an CreateUserError with code', () => {
      const error = CreateUserError.userCreatingFailed()

      expect(error).toBeInstanceOf(CreateUserError)
      expect(error.code).toBe(CreateUserErrorCodes.FAILED_TO_CREATE)
    })
  })
})
