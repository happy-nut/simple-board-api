import {
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param
} from '@nestjs/common'
import {
  DeletePostError,
  DeletePostErrorCodes,
  DeletePostUseCase
} from '../../application/delete-post'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'

type DeletePostViewModel = void

@Controller()
export class DeletePostController {
  constructor (
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('Post')
  @Delete('posts/:postId')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async delete (@Param('postId') postId: string): Promise<DeletePostViewModel> {
    try {
      await this.deletePostUseCase.execute({ postId })
    } catch (error) {
      if (error instanceof DeletePostError) {
        switch (error.code) {
          case DeletePostErrorCodes.NOT_FOUND:
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
