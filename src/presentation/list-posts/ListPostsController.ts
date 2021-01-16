import { ApiNotFoundResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Query
} from '@nestjs/common'
import { ListPostsError, ListPostsUseCase } from '../../application/list-posts'
import _ from 'lodash'
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator'

interface ListPostsViewModelProps {
  id: string
  authorName: string
  title: string
  createdAt: Date
}

class ListPostsViewModel {
  @ApiProperty({ type: String })
  id: string

  @ApiProperty({ type: String })
  authorName: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: Date })
  createdAt: Date

  constructor (props: ListPostsViewModelProps) {
    this.id = props.id
    this.authorName = props.authorName
    this.title = props.title
    this.createdAt = props.createdAt
  }
}

@Controller()
export class ListPostsController {
  constructor (
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly logger: Logger
  ) {
  }

  @HttpCode(HttpStatus.OK)
  @Get('posts')
  @ApiOkResponse({ type: [ListPostsViewModel] })
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
  @ApiNotFoundResponse({ description: 'authors not found' })
  async get (@Query('skip') skip = 0, @Query('take') take = 100): Promise<ListPostsViewModel[]> {
    try {
      const listPosts = await this.listPostsUseCase.execute({ skip, take })
      return _.map(listPosts, (summary) => ({
        id: summary.id,
        title: summary.title,
        authorName: summary.username,
        createdAt: summary.createdAt
      }))
    } catch (error) {
      if (error instanceof ListPostsError) {
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
