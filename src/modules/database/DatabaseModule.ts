import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import path from 'path'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get<ConnectionOptions>('typeorm'),
      entities: [
        path.join(__dirname, '../../**/entities/*Entity.ts')
      ]
    })
  ]
})
export class DatabaseModule {
}
