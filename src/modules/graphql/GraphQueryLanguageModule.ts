import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import path from 'path'
import { DateScalar } from './scalars'
import config from 'config'

@Module({
  exports: [
    DateScalar
  ],
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: path.join(__dirname, 'schema.gql'),
      ...config.get('graphql')
    })
  ],
  providers: [
    DateScalar
  ]
})
export class GraphQueryLanguageModule {
}
