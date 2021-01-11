import { AppModule } from './AppModule'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthzController } from './presentation/healthz/healthzController'

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

  it('gets HealthzController', () => {
    expect(uut.get(HealthzController)).toBeInstanceOf(HealthzController)
  })
})
