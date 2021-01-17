import { DeletePostError, DeletePostErrorCodes } from './DeletePostError'

describe('DeletePostError', () => {
  describe('.postNotFound()', () => {
    it('creates an DeletePostError with code', () => {
      const error = DeletePostError.postNotFound()

      expect(error).toBeInstanceOf(DeletePostError)
      expect(error.code).toBe(DeletePostErrorCodes.NOT_FOUND)
    })
  })
})
