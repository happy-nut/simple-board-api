import { CreateUserUseCase } from './CreateUserUseCase'

describe('CreateUserUseCase', () => {
  let uut: CreateUserUseCase

  beforeEach(() => {
    uut = new CreateUserUseCase()
  })

  it('responses with a user', () => {
    const name = 'test-name'
    const params = {
      name
    }

    const response = uut.execute(params)

    expect(response).toEqual({
      id: expect.any(String),
      name,
      registeredAt: expect.any(Date)
    })
  })
})
