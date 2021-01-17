import { ListCommentsByPostIdError } from './ListCommentsByPostIdError'

describe('ListCommentsByPostIdError', () => {
  describe('.postNotFound()', () => {
    it('creates an ListCommentsByPostIdError with code POST_NOT_FOUND', () => {
      const error = ListCommentsByPostIdError.postNotFound()

      expect(error).toBeInstanceOf(ListCommentsByPostIdError)
      expect(error.code).toBe('ListCommentsByPostIdError.POST_NOT_FOUND')
    })
  })
})
