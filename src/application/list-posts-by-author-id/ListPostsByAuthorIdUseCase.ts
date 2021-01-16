import { USER_REPOSITORY, UserRepository } from '../../domain'
import { UseCase } from '../../shared/ddd'
import { POST_REPOSITORY, PostRepository } from '../../domain/PostRepository'
import _ from 'lodash'
import { Inject, Injectable } from '@nestjs/common'
import { ListPostsByAuthorIdError } from './ListPostsByAuthorIdError'
import { UserId } from '../../domain/UserId'

interface ListPostsByAuthorIdRequest {
  userId: string
}

interface Post {
  id: string
  authorId: string
  username: string
  title: string
  content: string
  createdAt: Date
}

export type ListPostsByAuthorIdResponse = Post[]

@Injectable()
export class ListPostsByAuthorIdUseCase
implements UseCase<ListPostsByAuthorIdRequest, ListPostsByAuthorIdResponse> {
  constructor (
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository
  ) {
  }

  async execute (request: ListPostsByAuthorIdRequest): Promise<ListPostsByAuthorIdResponse> {
    const { userId: userIdString } = request
    const userId = new UserId(userIdString)
    const user = await this.userRepository.findOneById(userId)
    if (_.isNil(user)) {
      throw ListPostsByAuthorIdError.authorNotFound()
    }

    const posts = await this.postRepository.findAllByUserId(userId)
    return _.map(posts, (post) => ({
      id: post.id.value,
      authorId: user.id.value,
      username: user.name,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt
    }))
  }
}
