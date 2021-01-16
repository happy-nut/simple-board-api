import { SavePostError } from './SavePostError'

describe('SaveUserError', () => {
  describe('.postSavingFailed()', () => {
    it('creates an SavePostError with code POST_SAVING_FAILED', () => {
      const error = SavePostError.postSavingFailed()

      expect(error).toBeInstanceOf(SavePostError)
      expect(error.code).toBe('POST_SAVING_FAILED')
    })
  })
})
