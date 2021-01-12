import _ from 'lodash'
import { User, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { CreateUserError } from './CreateUserError'

interface CreateUserRequest {
  name: string
}

export interface CreateUserResponse {
  id: string
  name: string
  registeredAt: Date
}

export class CreateUserUseCase implements UseCase<CreateUserRequest, CreateUserResponse> {
  constructor (private readonly userRepository: UserRepository) {
  }

  async execute (params: CreateUserRequest): Promise<CreateUserResponse> {
    const user = User.createNew({ name: params.name })
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
