import { SavePostError } from './SavePostError'

describe('SaveUserError', () => {
  describe('.postCreatingFailed()', () => {
    it('creates an SavePostError with code POST_CREATING_FAILED', () => {
      const error = SavePostError.postCreatingFailed()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe('POST_CREATING_FAILED')
    })
  })

  describe('.postNotFound()', () => {
    it('creates an SavePostError with code POST_NOT_FOUND', () => {
      const error = SavePostError.postNotFound()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe('POST_NOT_FOUND')
    })
  })

  describe('.authorNotFound()', () => {
    it('creates an SavePostError with code AUTHOR_NOT_FOUND', () => {
      const error = SavePostError.authorNotFound()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe('AUTHOR_NOT_FOUND')
    })
  })

  describe('.postUpdatingFailed()', () => {
    it('creates an SavePostError with code POST_UPDATING_FAILED', () => {
      const error = SavePostError.postUpdatingFailed()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe('POST_UPDATING_FAILED')
    })
  })
})
