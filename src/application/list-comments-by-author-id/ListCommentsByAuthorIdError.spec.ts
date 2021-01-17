import {
  ListCommentsByAuthorIdError,
  ListCommentsByAuthorIdErrorCodes
} from './ListCommentsByAuthorIdError'

describe('ListCommentsByAuthorIdError', () => {
  describe('.authorNotFound()', () => {
    it('creates an ListCommentsByAuthorIdError with code', () => {
      const error = ListCommentsByAuthorIdError.authorNotFound()

      expect(error).toBeInstanceOf(ListCommentsByAuthorIdError)
      expect(error.code).toBe(ListCommentsByAuthorIdErrorCodes.NOT_FOUND)
    })
  })
})
