import { SaveCommentError, SaveCommentErrorCodes } from './SaveCommentError'

describe('SaveCommentError', () => {
  describe('.authorNotFound()', () => {
    it('creates an SaveCommentError with code', () => {
      const error = SaveCommentError.authorNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe(SaveCommentErrorCodes.AUTHOR_NOT_FOUND)
    })
  })

  describe('.postNotFound()', () => {
    it('creates an SaveCommentError with code', () => {
      const error = SaveCommentError.postNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe(SaveCommentErrorCodes.POST_NOT_FOUND)
    })
  })

  describe('.commentNotFound()', () => {
    it('creates an SaveCommentError with code', () => {
      const error = SaveCommentError.commentNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe(SaveCommentErrorCodes.COMMENT_NOT_FOUND)
    })
  })
})
