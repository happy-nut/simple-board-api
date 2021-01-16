import { CreateUserError } from './CreateUserError'

describe('CreateUserError', () => {
  describe('.userCreatingFailed()', () => {
    it('creates an CreateUserError with code USER_CREATING_FAILED', () => {
      const error = CreateUserError.userCreatingFailed()

      expect(error).toBeInstanceOf(CreateUserError)
      expect(error.code).toBe('USER_CREATING_FAILED')
    })
  })
})
