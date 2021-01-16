import { GetUserError } from './GetUserError'

describe('GetUserError', () => {
  describe('.useNotFound()', () => {
    it('creates an GetUserError with code USER_NOT_FOUND', () => {
      const error = GetUserError.useNotFound()

      expect(error).toBeInstanceOf(GetUserError)
      expect(error.code).toBe('USER_NOT_FOUND')
    })
  })
})
