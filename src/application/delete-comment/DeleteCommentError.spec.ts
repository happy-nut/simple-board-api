import { DeleteCommentError, DeleteCommentErrorCodes } from './DeleteCommentError'

describe('DeleteCommentError', () => {
  describe('.postNotFound()', () => {
    it('creates an DeleteCommentError with code', () => {
      const error = DeleteCommentError.commentNotFound()

      expect(error).toBeInstanceOf(DeleteCommentError)
      expect(error.code).toBe(DeleteCommentErrorCodes.NOT_FOUND)
    })
  })
})
