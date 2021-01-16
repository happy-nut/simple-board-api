import { User, USER_REPOSITORY, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { POST_REPOSITORY, PostRepository } from '../../domain/PostRepository'
import _ from 'lodash'
import { ListPostsError } from './ListPostsError'
import { Inject, Injectable } from '@nestjs/common'

interface ListPostsRequest {
  skip: number
  take: number
}

interface PostSummary {
  id: string
  username: string
  title: string
  createdAt: Date
}

export type ListPostsResponse = PostSummary[]

@Injectable()
export class ListPostsUseCase implements UseCase<ListPostsRequest, ListPostsResponse> {
  constructor (
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {
  }

  async execute (request: ListPostsRequest): Promise<ListPostsResponse> {
    const { skip, take } = request
    const posts = await this.postRepository.findAll(skip, take)
    if (_.isEmpty(posts)) {
      return []
    }

    const ids = _.map(posts, (post) => post.id)
    const users = await this.userRepository.findAllByIds(ids)
    if (users.length !== posts.length) {
      throw ListPostsError.authorNotFound()
    }

    return _.map(posts, (post) => {
      const user = users.get(post.authorId) as User
      return ({
        id: post.id.value,
        username: user.name,
        title: post.title,
        createdAt: post.createdAt
      })
    })
  }
}
