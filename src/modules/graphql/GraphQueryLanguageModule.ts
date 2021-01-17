import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { DateScalar } from './scalars'
import config from 'config'

@Module({
  exports: [
    DateScalar
  ],
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      ...config.get('graphql')
    })
  ],
  providers: [
    DateScalar
  ]
})
export class GraphQueryLanguageModule {
}
