import _ from 'lodash'
import { User, USER_REPOSITORY, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { CreateUserError } from './CreateUserError'
import { Inject, Injectable } from '@nestjs/common'

interface CreateUserRequest {
  name: string
}

export interface CreateUserResponse {
  id: string
  name: string
  registeredAt: Date
}

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserRequest, CreateUserResponse> {
  constructor (@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {
  }

  async execute (request: CreateUserRequest): Promise<CreateUserResponse> {
    const user = User.createNew({ name: request.name })
    const created = await this.userRepository.save(user)
    if (_.isNil(created)) {
      throw CreateUserError.userAlreadyCreated()
    }

    return {
      id: created.id.value,
      name: created.name,
      registeredAt: created.registeredAt
    }
  }
}
