import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { UserId } from '../../domain/UserId'
import { GetUserError } from './GetUserError'
import { GetUserUseCase } from './GetUserUseCase'

describe('GetUserUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let uut: GetUserUseCase

  function givenRepositoryFindByIdResolvesUndefined () {
    userRepository.findOneById.mockResolvedValueOnce(undefined)
  }

  function givenRepositoryFindByIdResolvesUser (user: User) {
    userRepository.findOneById.mockResolvedValueOnce(user)
  }

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    uut = new GetUserUseCase(userRepository)
  })

  it('throws an error when given repository findById resolves undefined', async () => {
    givenRepositoryFindByIdResolvesUndefined()
    const id = new UserId().value

    const request = {
      id
    }
    await expect(uut.execute(request))
      .rejects
      .toThrowError(GetUserError.useNotFound())
    expect(userRepository.findOneById).toHaveBeenCalled()
  })

  it('responses with a user when given repository findById resolves a user', async () => {
    const id = new UserId()
    const name = 'test-name'
    const registeredAt = new Date()
    givenRepositoryFindByIdResolvesUser(User.create(
      {
        name,
        registeredAt
      },
      id
    ))

    const request = {
      id: id.value
    }
    const response = await uut.execute(request)

    expect(userRepository.findOneById).toHaveBeenCalled()
    expect(response).toEqual({
      id: id.value,
      name,
      registeredAt
    })
  })
})
