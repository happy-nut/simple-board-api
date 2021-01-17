import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags
} from '@nestjs/swagger'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common'
import {
  SaveCommentError,
  SaveCommentErrorCodes,
  SaveCommentUseCase
} from '../../application/save-Comment'

export class SaveCommentBody {
  @ApiProperty()
  content: string

  @ApiProperty()
  postId: string

  @ApiProperty()
  authorId: string
}

interface SaveCommentViewModelProps {
  id: string
}

class SaveCommentViewModel implements SaveCommentViewModelProps {
  @ApiProperty()
  id: string

  constructor (props: SaveCommentViewModelProps) {
    this.id = props.id
  }
}

@Controller()
export class SaveCommentController {
  constructor (
    private readonly saveCommentUseCase: SaveCommentUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('Comment')
  @HttpCode(HttpStatus.OK)
  @Post('comments')
  @ApiOkResponse({ type: SaveCommentViewModel })
  @ApiNotFoundResponse({ description: 'author or post not found' })
  @ApiInternalServerErrorResponse()
  async create (@Body() body: SaveCommentBody): Promise<SaveCommentViewModel> {
    try {
      const response = await this.saveCommentUseCase.execute({
        authorId: body.authorId,
        content: body.content,
        postId: body.postId
      })
      return new SaveCommentViewModel({
        id: response.commentId
      })
    } catch (error) {
      if (error instanceof SaveCommentError) {
        switch (error.code) {
          case SaveCommentErrorCodes.AUTHOR_NOT_FOUND:
            throw new NotFoundException('Author not found')
          case SaveCommentErrorCodes.POST_NOT_FOUND:
            throw new NotFoundException('Post not found')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  @ApiTags('Comment')
  @HttpCode(HttpStatus.OK)
  @Put('comments/:commentId')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'author or post or comment not found' })
  @ApiInternalServerErrorResponse()
  async update (
    @Param('commentId') commentId: string,
    @Body() body: SaveCommentBody
  ): Promise<SaveCommentViewModel> {
    try {
      const response = await this.saveCommentUseCase.execute({
        id: commentId,
        postId: body.postId,
        authorId: body.authorId,
        content: body.content
      })

      return new SaveCommentViewModel({
        id: response.commentId
      })
    } catch (error) {
      if (error instanceof SaveCommentError) {
        switch (error.code) {
          case SaveCommentErrorCodes.AUTHOR_NOT_FOUND:
            throw new NotFoundException('Author not found')
          case SaveCommentErrorCodes.COMMENT_NOT_FOUND:
            throw new NotFoundException('Comment not found')
          case SaveCommentErrorCodes.POST_NOT_FOUND:
            throw new NotFoundException('Post not found')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
