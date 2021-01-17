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
import { SavePostError, SavePostUseCase } from '../../application/save-post'

export class SavePostBody {
  @ApiProperty()
  title: string

  @ApiProperty()
  content: string

  @ApiProperty()
  authorId: string
}

interface SavePostViewModelProps {
  id: string
}

class SavePostViewModel implements SavePostViewModelProps {
  @ApiProperty()
  id: string

  constructor (props: SavePostViewModelProps) {
    this.id = props.id
  }
}

@Controller()
export class SavePostController {
  constructor (
    private readonly savePostUseCase: SavePostUseCase,
    private readonly logger: Logger
  ) {
  }

  @ApiTags('Post')
  @HttpCode(HttpStatus.OK)
  @Post('posts')
  @ApiOkResponse({ type: SavePostViewModel })
  @ApiNotFoundResponse({ description: 'author not found' })
  @ApiInternalServerErrorResponse()
  async create (@Body() body: SavePostBody): Promise<SavePostViewModel> {
    try {
      const response = await this.savePostUseCase.execute({
        authorId: body.authorId,
        content: body.content,
        title: body.content
      })
      return new SavePostViewModel({
        id: response.postId
      })
    } catch (error) {
      if (error instanceof SavePostError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new NotFoundException('Author not found')
          case 'POST_CREATING_FAILED':
            throw new InternalServerErrorException('Cannot create a post')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  @ApiTags('Post')
  @HttpCode(HttpStatus.OK)
  @Put('posts/:postId')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'author or post not found' })
  @ApiInternalServerErrorResponse()
  async update (
    @Param('postId') postId: string,
    @Body() body: SavePostBody
  ): Promise<SavePostViewModel> {
    try {
      const response = await this.savePostUseCase.execute({
        id: postId,
        authorId: body.authorId,
        content: body.content,
        title: body.content
      })

      return new SavePostViewModel({
        id: response.postId
      })
    } catch (error) {
      if (error instanceof SavePostError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new NotFoundException('Author not found')
          case 'POST_NOT_FOUND':
            throw new NotFoundException('There is no post to update')
          case 'POST_UPDATING_FAILED':
            throw new InternalServerErrorException('Cannot update a post')
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
