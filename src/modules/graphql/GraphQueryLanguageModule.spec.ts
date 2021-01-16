import { Test, TestingModule } from '@nestjs/testing'
import { GraphQueryLanguageModule } from './GraphQueryLanguageModule'
import { DateScalar } from './scalars'

describe('GraphQueryLanguageModule', () => {
  let uut: TestingModule

  beforeEach(async () => {
    uut = await Test
      .createTestingModule({
        imports: [GraphQueryLanguageModule]
      })
      .compile()
  })

  afterEach(async () => {
    await uut.close()
  })

  it('gets DateScalar', () => {
    expect(uut.get(DateScalar)).toBeInstanceOf(DateScalar)
  })
})
