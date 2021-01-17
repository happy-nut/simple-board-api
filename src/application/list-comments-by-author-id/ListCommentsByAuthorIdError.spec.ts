import { ListCommentsByAuthorIdError } from './ListCommentsByAuthorIdError'

describe('ListCommentsByAuthorIdError', () => {
  describe('.authorNotFound()', () => {
    it('creates an ListCommentsByAuthorIdError with code AUTHOR_NOT_FOUND', () => {
      const error = ListCommentsByAuthorIdError.authorNotFound()

      expect(error).toBeInstanceOf(ListCommentsByAuthorIdError)
      expect(error.code).toBe('AUTHOR_NOT_FOUND')
    })
  })
})
