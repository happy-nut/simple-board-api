import { SaveCommentError } from './SaveCommentError'

describe('SaveCommentError', () => {
  describe('.authorNotFound()', () => {
    it('creates an SaveCommentError with code COMMENT_ERROR_AUTHOR_NOT_FOUND', () => {
      const error = SaveCommentError.authorNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe('COMMENT_ERROR_AUTHOR_NOT_FOUND')
    })
  })

  describe('.postNotFound()', () => {
    it('creates an SaveCommentError with code COMMENT_ERROR_POST_NOT_FOUND', () => {
      const error = SaveCommentError.postNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe('COMMENT_ERROR_POST_NOT_FOUND')
    })
  })

  describe('.commentNotFound()', () => {
    it('creates an SaveCommentError with code COMMENT_ERROR_COMMENT_NOT_FOUND', () => {
      const error = SaveCommentError.commentNotFound()

      expect(error).toBeInstanceOf(SaveCommentError)
      expect(error.code).toBe('COMMENT_ERROR_COMMENT_NOT_FOUND')
    })
  })
})
