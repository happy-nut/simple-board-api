import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'typeorm'
import { DatabaseModule } from './DatabaseModule'

describe('DatabaseModule', () => {
  let uut: TestingModule

  beforeEach(async () => {
    uut = await Test
      .createTestingModule({
        imports: [DatabaseModule]
      })
      .compile()
  })

  afterEach(async () => {
    await uut.close()
  })

  it('gets Connection', () => {
    expect(uut.get(Connection)).toBeInstanceOf(Connection)
  })
})

