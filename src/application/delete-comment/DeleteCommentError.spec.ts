import { DeleteCommentError } from './DeleteCommentError'

describe('DeleteCommentError', () => {
  describe('.postNotFound()', () => {
    it('creates an DeleteCommentError with code COMMENT_NOT_FOUND', () => {
      const error = DeleteCommentError.commentNotFound()

      expect(error).toBeInstanceOf(DeleteCommentError)
      expect(error.code).toBe('DeleteCommentError.COMMENT_NOT_FOUND')
    })
  })
})
