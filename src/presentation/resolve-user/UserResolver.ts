import { Args, Field, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { GetUserError, GetUserUseCase } from '../../application/get-user'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'

interface UserViewModelProps {
  id: string
  name: string
  registeredAt: Date
}

@ObjectType('User')
class UserViewModel implements UserViewModelProps {

  @Field()
  readonly id: string

  @Field()
  readonly name: string

  @Field(() => Date)
  readonly registeredAt: Date

  constructor (props: UserViewModelProps) {
    this.id = props.id
    this.name = props.name
    this.registeredAt = props.registeredAt
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of: unknown) => UserViewModel)
export class UserResolver {
  constructor (
    private readonly getUserUseCase: GetUserUseCase,
    private readonly logger: Logger
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => UserViewModel)
  async user (@Args('id', { type: () => String }) id: string): Promise<UserViewModel> {
    try {
      const user = await this.getUserUseCase.execute({ id })
      return new UserViewModel({
        id: user.id,
        name: user.name,
        registeredAt: user.registeredAt
      })
    } catch (error) {
      if (error instanceof GetUserError) {
        switch (error.code) {
          case 'USER_NOT_FOUND':
            throw new GraphQLError(`User not found with ID: ${id}`)
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
