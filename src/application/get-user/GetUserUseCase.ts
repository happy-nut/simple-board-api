import { USER_REPOSITORY, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { Inject, Injectable } from '@nestjs/common'
import { UserId } from '../../domain/UserId'
import _ from 'lodash'
import { GetUserError } from './GetUserError'

interface GetUserRequest {
  id: string
}

export interface GetUserResponse {
  id: string
  name: string
  registeredAt: Date
}

@Injectable()
export class GetUserUseCase implements UseCase<GetUserRequest, GetUserResponse> {
  constructor (@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {
  }

  async execute (request: GetUserRequest): Promise<GetUserResponse> {
    const userId = new UserId(request.id)
    const user = await this.userRepository.findOneById(userId)
    if (_.isNil(user)) {
      throw GetUserError.useNotFound()
    }

    return {
      id: user.id.value,
      name: user.name,
      registeredAt: user.registeredAt
    }
  }
}
