import { GetUserError, GetUserErrorCodes } from './GetUserError'

describe('GetUserError', () => {
  describe('.useNotFound()', () => {
    it('creates an GetUserError with code', () => {
      const error = GetUserError.useNotFound()

      expect(error).toBeInstanceOf(GetUserError)
      expect(error.code).toBe(GetUserErrorCodes.NOT_FOUND)
    })
  })
})
