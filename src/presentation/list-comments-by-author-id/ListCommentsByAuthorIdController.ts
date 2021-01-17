import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty,
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
import _ from 'lodash'
import {
  ListCommentsByAuthorIdError,
  ListCommentsByAuthorIdUseCase
} from '../../application/list-comments-by-author-id'

interface ListCommentsByAuthorIdViewModelProps {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
}

class ListCommentsByAuthorIdViewModel {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  postId: string

  @ApiProperty({ type: String })
  authorName: string

  @ApiProperty({ type: String })
  content: string

  @ApiProperty({ type: Date })
  createdAt: Date

  constructor (props: ListCommentsByAuthorIdViewModelProps) {
    this.id = props.id
    this.authorName = props.authorName
    this.postId = props.authorId
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@Controller()
export class ListCommentsByAuthorIdController {
  constructor (
    private readonly ListCommentsByAuthorIdUseCase: ListCommentsByAuthorIdUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @Get('users/:userId/comments')
  @ApiOkResponse({ type: [ListCommentsByAuthorIdViewModel] })
  @ApiNotFoundResponse({ description: 'author not found' })
  @ApiInternalServerErrorResponse()
  async list (@Param('userId') authorId: string): Promise<ListCommentsByAuthorIdViewModel[]> {
    try {
      const responses = await this.ListCommentsByAuthorIdUseCase.execute({ authorId })
      return _.map(responses, (response) => ({
        id: response.id,
        content: response.content,
        postId: response.postId,
        authorName: response.username,
        createdAt: response.createdAt
      }))
    } catch (error) {
      if (error instanceof ListCommentsByAuthorIdError) {
        switch (error.code) {
          case 'ListCommentsByAuthorIdError.AUTHOR_NOT_FOUND':
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
