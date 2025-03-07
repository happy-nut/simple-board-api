import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetUserError, GetUserErrorCodes, GetUserUseCase } from '../../application/get-user'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import {
  CreateUserError,
  CreateUserErrorCodes,
  CreateUserUseCase
} from '../../application/create-user'
import { UserViewModel } from './UserViewModel'

@InputType()
export class CreateUserInput {
  @Field()
  name: string
}

@Resolver(() => UserViewModel)
export class UserResolver {
  constructor (
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly logger: Logger
  ) {
  }

  @Query(() => UserViewModel)
  async getUser (@Args('id') id: string): Promise<UserViewModel> {
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
          case GetUserErrorCodes.NOT_FOUND:
            throw new GraphQLError(`User not found with ID: ${id}`)
        }
      }

      this.logger.error(error)
      throw error
    }
  }

  @Mutation(() => UserViewModel)
  async createUser (@Args('input') input: CreateUserInput): Promise<UserViewModel> {
    try {
      const user = await this.createUserUseCase.execute({ name: input.name })
      return new UserViewModel({
        id: user.id,
        name: user.name,
        registeredAt: user.registeredAt
      })
    } catch (error) {
      if (error instanceof CreateUserError) {
        switch (error.code) {
          case CreateUserErrorCodes.FAILED_TO_CREATE:
            throw new GraphQLError('Failed to create a user')
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
