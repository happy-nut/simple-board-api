import { User } from './User'
import { Users } from './Users'

describe('Users', () => {
  describe('.length', () => {
    it('returns 0 when given list is empty', () => {
      const uut = new Users([])

      expect(uut.length).toBe(0)
    })

    it('returns length of given users', () => {
      const user1 = User.createNew({ name: 'test-name-1' })
      const user2 = User.createNew({ name: 'test-name-2' })

      const uut = new Users([user1, user2])

      expect(uut.length).toBe(2)
    })
  })

  describe('.get', () => {
    it('returns defined if given user not exist in the list', () => {
      const user1 = User.createNew({ name: 'test-name-1' })
      const user2 = User.createNew({ name: 'test-name-2' })

      const uut = new Users([user2])

      expect(uut.get(user1.id)).toBeUndefined()
    })

    it('returns a user if given user exist in the list', () => {
      const user1 = User.createNew({ name: 'test-name-1' })
      const user2 = User.createNew({ name: 'test-name-2' })

      const uut = new Users([user1, user2])

      expect(uut.get(user1.id)).toEqual<User>(user1)
    })
  })

  describe('.isEmpty', () => {
    it('returns ture if given list is empty', () => {
      const uut = new Users([])

      expect(uut.isEmpty).toBeTrue()
    })

    it('returns false if given list is not empty', () => {
      const user1 = User.createNew({ name: 'test-name-1' })
      const user2 = User.createNew({ name: 'test-name-2' })

      const uut = new Users([user1, user2])

      expect(uut.isEmpty).toBeFalse()
    })
  })
})
