import { ListPostsError } from './ListPostsError'

describe('ListPostsError', () => {
  describe('authorNotFound', () => {
    it('creates an ListPostsError with code AUTHOR_NOT_FOUND', () => {
      const error = ListPostsError.authorNotFound()

      expect(error).toBeInstanceOf(ListPostsError)
      expect(error.code).toBe('AUTHOR_NOT_FOUND')
    })
  })
})
