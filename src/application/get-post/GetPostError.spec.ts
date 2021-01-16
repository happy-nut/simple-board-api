import { GetPostError } from './GetPostError'

describe('GetPostError', () => {
  describe('.postNotFound()', () => {
    it('creates an GetPostError with code POST_NOT_FOUND', () => {
      const error = GetPostError.postNotFound()

      expect(error).toBeInstanceOf(GetPostError)
      expect(error.code).toBe('POST_NOT_FOUND')
    })
  })

  describe('.authorNotFound()', () => {
    it('creates an GetPostError with code AUTHOR_NOT_FOUND', () => {
      const error = GetPostError.authorNotFound()

      expect(error).toBeInstanceOf(GetPostError)
      expect(error.code).toBe('AUTHOR_NOT_FOUND')
    })
  })
})
