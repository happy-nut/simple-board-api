import { CreateUserUseCase } from './CreateUserUseCase'
import { mock, MockProxy } from 'jest-mock-extended'
import { User, UserRepository } from '../../domain'
import { UserId } from '../../domain/UserId'
import { CreateUserError } from './CreateUserError'

describe('CreateUserUseCase', () => {
  let userRepository: MockProxy<UserRepository>
  let uut: CreateUserUseCase

  function givenRepositorySaveResolvesUndefined () {
    userRepository.save.mockResolvedValueOnce(undefined)
  }

  function givenRepositorySaveResolvesUser (user: User) {
    userRepository.save.mockResolvedValueOnce(user)
  }

  beforeEach(() => {
    userRepository = mock<UserRepository>()
    uut = new CreateUserUseCase(userRepository)
  })

  it('responses with a user', async () => {
    const name = 'test-name'
    givenRepositorySaveResolvesUser(User.create(
      {
        name,
        registeredAt: new Date()
      },
      new UserId()
    ))
    const request = {
      name
    }

    const response = await uut.execute(request)

    expect(userRepository.save).toHaveBeenCalled()
    expect(response).toEqual({
      id: expect.any(String),
      name,
      registeredAt: expect.any(Date)
    })
  })

  it('throws an error when given repository save resolves undefined', async () => {
    givenRepositorySaveResolvesUndefined()
    const name = 'test-name'
    const request = {
      name
    }

    await expect(uut.execute(request))
      .rejects
      .toThrowError(CreateUserError.userAlreadyCreated())
    expect(userRepository.save).toHaveBeenCalled()
  })
})
