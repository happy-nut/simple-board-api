import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty
} from '@nestjs/swagger'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common'
import { CreateUserError, CreateUserUseCase } from '../../application/create-user'
import { UserViewModel } from '../UserViewModel'

export class CreateUserBody {
  @ApiProperty()
  name: string
}

class CreateUserViewModel extends UserViewModel {
}

@Controller()
export class CreateUserController {
  constructor (
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly logger: Logger
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Post('users')
  @ApiOkResponse({ type: CreateUserViewModel })
  @ApiConflictResponse({ description: 'user already created' })
  @ApiInternalServerErrorResponse()
  async create (@Body() body: CreateUserBody): Promise<CreateUserViewModel> {
    try {
      const user = await this.createUserUseCase.execute({
        name: body.name
      })
      return new CreateUserViewModel({
        id: user.id,
        name: user.name,
        registeredAt: user.registeredAt
      })
    } catch (error) {
      if (error instanceof CreateUserError) {
        switch (error.code) {
          case 'USER_ALREADY_CREATED':
            throw new ConflictException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
