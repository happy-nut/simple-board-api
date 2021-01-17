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
  Param
} from '@nestjs/common'
import _ from 'lodash'
import {
  ListPostsByAuthorIdError,
  ListPostsByAuthorIdUseCase
} from '../../application/list-posts-by-author-id'

interface ListPostsByAuthorIdViewModelProps {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: Date
}

class ListPostsByAuthorIdViewModel {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  authorId: string

  @ApiProperty({ type: String })
  authorName: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  content: string

  @ApiProperty({ type: Date })
  createdAt: Date

  constructor (props: ListPostsByAuthorIdViewModelProps) {
    this.id = props.id
    this.authorName = props.authorName
    this.authorId = props.authorId
    this.title = props.title
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@Controller()
export class ListPostsByAuthorIdController {
  constructor (
    private readonly listPostsByAuthorIdUseCase: ListPostsByAuthorIdUseCase,
    private readonly logger: Logger
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('users/:userId/posts')
  @ApiOkResponse({ type: [ListPostsByAuthorIdViewModel] })
  @ApiNotFoundResponse({ description: 'author not found' })
  @ApiInternalServerErrorResponse()
  async list (@Param('userId') userId: string): Promise<ListPostsByAuthorIdViewModel[]> {
    try {
      const posts = await this.listPostsByAuthorIdUseCase.execute({ userId })
      return _.map(posts, (post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        authorName: post.username,
        createdAt: post.createdAt
      }))
    } catch (error) {
      if (error instanceof ListPostsByAuthorIdError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
