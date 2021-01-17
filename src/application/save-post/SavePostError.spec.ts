import { SavePostError, SavePostErrorCodes } from './SavePostError'

describe('SaveUserError', () => {
  describe('.postCreatingFailed()', () => {
    it('creates an SavePostError with code', () => {
      const error = SavePostError.postCreatingFailed()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe(SavePostErrorCodes.FAILED_TO_CREATE)
    })
  })

  describe('.postNotFound()', () => {
    it('creates an SavePostError with code', () => {
      const error = SavePostError.postNotFound()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe(SavePostErrorCodes.POST_NOT_FOUND)
    })
  })

  describe('.authorNotFound()', () => {
    it('creates an SavePostError with code', () => {
      const error = SavePostError.authorNotFound()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe(SavePostErrorCodes.AUTHOR_NOT_FOUND)
    })
  })

  describe('.postUpdatingFailed()', () => {
    it('creates an SavePostError with code', () => {
      const error = SavePostError.postUpdatingFailed()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe(SavePostErrorCodes.FAILED_TO_UPDATE)
    })
  })
})
