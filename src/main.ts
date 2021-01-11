import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import { INestApplication, Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const PORT = 8000
const SERVER_NAME = 'Simple board api server'
const VERSION = 'v1'

function setupDocument (app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SERVER_NAME)
    .setDescription(SERVER_NAME)
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(`${VERSION}/docs`, app, document)
}

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(VERSION)
  setupDocument(app)

  await app.listen(PORT)

  const logger = app.get(Logger)
  logger.log(`${SERVER_NAME} listening on port ${PORT}`)
}

bootstrap()
