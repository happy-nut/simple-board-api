import { AppModule } from './AppModule'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user'
import { DatabaseModule } from './modules/DatabaseModule'
import { GetUserController } from './presentation/get-user'

describe('AppModule', () => {
  let uut: TestingModule

  beforeEach(async () => {
    uut = await Test
      .createTestingModule({
        imports: [AppModule]
      })
      .compile()
  })

  afterEach(async () => {
    await uut.close()
  })

  it('gets DatabaseModule', () => {
    expect(uut.get(DatabaseModule)).toBeInstanceOf(DatabaseModule)
  })

  it('gets HealthzController', () => {
    expect(uut.get(HealthzController)).toBeInstanceOf(HealthzController)
  })

  it('gets CreateUserController', () => {
    expect(uut.get(CreateUserController)).toBeInstanceOf(CreateUserController)
  })

  it('gets GetUserController', () => {
    expect(uut.get(GetUserController)).toBeInstanceOf(GetUserController)
  })
})
