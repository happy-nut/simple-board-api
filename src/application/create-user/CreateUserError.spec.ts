import { CreateUserError } from './CreateUserError'

describe('CreateUserError', () => {
  describe('userAlreadyCreated', () => {
    it('creates an CreateUserError with code USER_ALREADY_CREATED', () => {
      const error = CreateUserError.userAlreadyCreated()

      expect(error).toBeInstanceOf(CreateUserError)
      expect(error.code).toBe('USER_ALREADY_CREATED')
    })
  })
})
