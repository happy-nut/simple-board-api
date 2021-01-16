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
import { GetPostError, GetPostUseCase } from '../../application/get-post'

interface GetPostViewModelProps {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: Date
}

class GetPostViewModel implements GetPostViewModelProps {
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

  constructor (props: GetPostViewModelProps) {
    this.id = props.id
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.title = props.title
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@Controller()
export class GetPostController {
  constructor (
    private readonly getPostUseCase: GetPostUseCase,
    private readonly logger: Logger
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('posts/:postId')
  @ApiOkResponse({ type: GetPostViewModel })
  @ApiNotFoundResponse({ description: 'Post or author not found' })
  @ApiInternalServerErrorResponse()
  async get (@Param('postId') postId: string): Promise<GetPostViewModel> {
    try {
      const post = await this.getPostUseCase.execute({
        id: postId
      })
      return new GetPostViewModel({
        id: post.id,
        createdAt: post.createdAt,
        content: post.content,
        title: post.title,
        authorName: post.authorName,
        authorId: post.authorId
      })
    } catch (error) {
      if (error instanceof GetPostError) {
        switch (error.code) {
          case 'POST_NOT_FOUND':
            throw new NotFoundException('Post not found')
          case 'AUTHOR_NOT_FOUND':
            throw new NotFoundException('Author not found')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
