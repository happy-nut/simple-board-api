import { User } from './User'
import { UserId } from './UserId'

describe('User', () => {
  describe('.create', () => {
    it('creates a user with ID', () => {
      const name = 'test-name'
      const registeredAt = new Date()
      const props = {
        name,
        registeredAt
      }
      const id = new UserId()

      const uut = User.create(props, id)

      expect(uut.id.equals(id)).toBeTrue()
      expect(uut.name).toBe(name)
      expect(uut.registeredAt).toEqual<Date>(registeredAt)
    })
  })

  describe('.createNew', () => {
    it('creates a user', () => {
      const name = 'test-name'
      const props = {
        name
      }

      const uut = User.createNew(props)

      expect(uut.id.value).toBeString()
      expect(uut.name).toBe(name)
      expect(uut.registeredAt).toBeInstanceOf(Date)
    })
  })
})
