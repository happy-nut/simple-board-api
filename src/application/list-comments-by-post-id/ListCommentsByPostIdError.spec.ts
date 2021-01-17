import {
  ListCommentsByPostIdError,
  ListCommentsByPostIdErrorCodes
} from './ListCommentsByPostIdError'

describe('ListCommentsByPostIdError', () => {
  describe('.postNotFound()', () => {
    it('creates an ListCommentsByPostIdError with code', () => {
      const error = ListCommentsByPostIdError.postNotFound()

      expect(error).toBeInstanceOf(ListCommentsByPostIdError)
      expect(error.code).toBe(ListCommentsByPostIdErrorCodes.NOT_FOUND)
    })
  })
})
