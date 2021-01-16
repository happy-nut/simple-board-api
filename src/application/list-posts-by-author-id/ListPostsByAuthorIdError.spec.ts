import { ListPostsByAuthorIdError } from './ListPostsByAuthorIdError'

describe('ListPostsByAuthorIdError', () => {
  describe('.authorNotFound()', () => {
    it('creates an ListPostsByAuthorIdError with code AUTHOR_NOT_FOUND', () => {
      const error = ListPostsByAuthorIdError.authorNotFound()

      expect(error).toBeInstanceOf(ListPostsByAuthorIdError)
      expect(error.code).toBe('AUTHOR_NOT_FOUND')
    })
  })
})
