import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty, ApiTags
} from '@nestjs/swagger'
import {
  Body,
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

  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @Post('users')
  @ApiOkResponse({ type: CreateUserViewModel })
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
          case 'USER_CREATING_FAILED':
            // TODO: Is this really needed?
            throw new InternalServerErrorException('Failed to create a user')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
