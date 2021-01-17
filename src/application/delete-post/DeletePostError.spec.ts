import { DeletePostError } from './DeletePostError'

describe('DeletePostError', () => {
  describe('.postNotFound()', () => {
    it('creates an DeletePostError with code POST_NOT_FOUND', () => {
      const error = DeletePostError.postNotFound()

      expect(error).toBeInstanceOf(DeletePostError)
      expect(error.code).toBe('DeletePostError.POST_NOT_FOUND')
    })
  })
})
