import { Test, TestingModule } from '@nestjs/testing'
import { HealthzController } from './healthzController'
import request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'

describe('HealthzController', () => {
  let testingModule: TestingModule
  let app: INestApplication
  let uut: unknown

  beforeEach(async () => {
    testingModule = await Test
      .createTestingModule({
        controllers: [HealthzController]
      })
      .compile()
    app = await testingModule
      .createNestApplication()
      .init()
    uut = app.getHttpServer()
  })

  afterEach(async () => {
    await app.close()
    await testingModule.close()
  })

  it('responds 200 OK with nothing', async () => {
    const response = await request(uut)
      .get('/healthz')

    expect(response.status).toBe(HttpStatus.OK)
    expect(response.body).toEqual({})
  })
})
