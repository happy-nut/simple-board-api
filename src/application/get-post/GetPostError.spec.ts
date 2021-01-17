import { GetPostError, GetPostErrorCodes } from './GetPostError'

describe('GetPostError', () => {
  describe('.postNotFound()', () => {
    it('creates an GetPostError with code', () => {
      const error = GetPostError.postNotFound()

      expect(error).toBeInstanceOf(GetPostError)
      expect(error.code).toBe(GetPostErrorCodes.POST_NOT_FOUND)
    })
  })

  describe('.authorNotFound()', () => {
    it('creates an GetPostError with code', () => {
      const error = GetPostError.authorNotFound()

      expect(error).toBeInstanceOf(GetPostError)
      expect(error.code).toBe(GetPostErrorCodes.AUTHOR_NOT_FOUND)
    })
  })
})
