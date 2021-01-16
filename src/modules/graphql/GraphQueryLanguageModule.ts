import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import path from 'path'
import { DateScalar } from './scalars'

@Module({
  exports: [
    DateScalar
  ],
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: path.join(__dirname, 'schema.gql')
    })
  ],
  providers: [
    DateScalar
  ]
})
export class GraphQueryLanguageModule {
}
