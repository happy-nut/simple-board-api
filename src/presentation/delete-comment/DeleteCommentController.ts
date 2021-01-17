import {
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param
} from '@nestjs/common'
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger'
import {
  DeleteCommentError,
  DeleteCommentErrorCodes,
  DeleteCommentUseCase
} from '../../application/delete-comment'

type DeleteCommentViewModel = void

@Controller()
export class DeleteCommentController {
  constructor (
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('Comment')
  @Delete('comments/:commentId')
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async delete (@Param('commentId') commentId: string): Promise<DeleteCommentViewModel> {
    try {
      await this.deleteCommentUseCase.execute({ commentId })
    } catch (error) {
      if (error instanceof DeleteCommentError) {
        switch (error.code) {
          case DeleteCommentErrorCodes.NOT_FOUND:
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
