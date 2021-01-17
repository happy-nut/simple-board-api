import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param
} from '@nestjs/common'
import { UserViewModel } from '../UserViewModel'
import { GetUserError, GetUserUseCase } from '../../application/get-user'


class GetUserViewModel extends UserViewModel {
}

@Controller()
export class GetUserController {
  constructor (
    private readonly getUserUseCase: GetUserUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @Get('users/:userId')
  @ApiOkResponse({ type: GetUserViewModel })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse()
  async get (@Param('userId') userId: string): Promise<GetUserViewModel> {
    try {
      const user = await this.getUserUseCase.execute({
        id: userId
      })
      return new GetUserViewModel({
        id: user.id,
        name: user.name,
        registeredAt: user.registeredAt
      })
    } catch (error) {
      if (error instanceof GetUserError) {
        switch (error.code) {
          case 'USER_NOT_FOUND':
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
