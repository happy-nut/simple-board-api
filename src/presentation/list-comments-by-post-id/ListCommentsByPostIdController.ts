import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiProperty
} from '@nestjs/swagger'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Query
} from '@nestjs/common'
import _ from 'lodash'
import {
  ListCommentsByPostIdError,
  ListCommentsByPostIdUseCase
} from '../../application/list-comments-by-post-id'
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator'

interface ListCommentsByPostIdViewModelProps {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
}

class ListCommentsByPostIdViewModel {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  authorId: string

  @ApiProperty({ type: String })
  authorName: string

  @ApiProperty({ type: String })
  content: string

  @ApiProperty({ type: Date })
  createdAt: Date

  constructor (props: ListCommentsByPostIdViewModelProps) {
    this.id = props.id
    this.authorName = props.authorName
    this.authorId = props.authorId
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@Controller()
export class ListCommentsByPostIdController {
  constructor (
    private readonly ListCommentsByPostIdUseCase: ListCommentsByPostIdUseCase,
    private readonly logger: Logger
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('posts/:postId/comments')
  @ApiImplicitQuery({
    name: 'skip',
    required: false,
    type: Number
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
    type: Number
  })
  @ApiOkResponse({ type: [ListCommentsByPostIdViewModel] })
  @ApiNotFoundResponse({ description: 'post not found' })
  @ApiInternalServerErrorResponse()
  async list (
    @Param('postId') postId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 100
  ): Promise<ListCommentsByPostIdViewModel[]> {
    try {
      const responses = await this.ListCommentsByPostIdUseCase.execute({ postId, skip, take })
      return _.map(responses, (response) => ({
        id: response.id,
        content: response.content,
        authorId: response.authorId,
        authorName: response.username,
        createdAt: response.createdAt
      }))
    } catch (error) {
      if (error instanceof ListCommentsByPostIdError) {
        switch (error.code) {
          case 'ListCommentsByPostIdError.POST_NOT_FOUND':
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
