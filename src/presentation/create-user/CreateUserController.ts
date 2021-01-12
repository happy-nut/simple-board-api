import { ApiConflictResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
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

export class CreateUserBody {
  @ApiProperty()
  name: string
}

interface CreateUserViewModelProps {
  id: string
  name: string
  registeredAt: Date
}

class CreateUserViewModel implements CreateUserViewModelProps {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Date })
  registeredAt: Date

  constructor (props: CreateUserViewModelProps) {
    this.id = props.id
    this.name = props.name
    this.registeredAt = props.registeredAt
  }
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
