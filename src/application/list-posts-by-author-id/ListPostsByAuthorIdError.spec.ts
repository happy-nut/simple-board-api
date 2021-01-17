import { ListPostsByAuthorIdError, ListPostsByAuthorIdErrorCodes } from './ListPostsByAuthorIdError'

describe('ListPostsByAuthorIdError', () => {
  describe('.authorNotFound()', () => {
    it('creates an ListPostsByAuthorIdError with code', () => {
      const error = ListPostsByAuthorIdError.authorNotFound()

      expect(error).toBeInstanceOf(ListPostsByAuthorIdError)
      expect(error.code).toBe(ListPostsByAuthorIdErrorCodes.NOT_FOUND)
    })
  })
})
