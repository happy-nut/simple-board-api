import { ApiNotFoundResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger'
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
import { ListPostsError, ListPostsUseCase } from '../../application/list-posts'
import _ from 'lodash'


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
  @ApiNotFoundResponse({ description: 'authors not found' })
  async get (
    @Param('skip') skip: number,
    @Param('take') take: number
  ): Promise<ListPostsViewModel[]> {
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
