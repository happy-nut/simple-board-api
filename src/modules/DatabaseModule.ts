import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import { UserEntity } from '../infra/typeorm/entities'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get<ConnectionOptions>('typeorm'),
      entities: [
        UserEntity
      ]
    })
  ]
})
export class DatabaseModule {
}
