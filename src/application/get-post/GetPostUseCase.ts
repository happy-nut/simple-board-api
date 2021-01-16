import { UseCase } from '../../shared/ddd'
import _ from 'lodash'
import { POST_REPOSITORY, PostRepository } from '../../domain/PostRepository'
import { PostId } from '../../domain/Post'
import { GetPostError } from './GetPostError'
import { USER_REPOSITORY, UserRepository } from '../../domain'
import { Inject, Injectable } from '@nestjs/common'

interface GetPostRequest {
  id: string
}

export interface GetPostResponse {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: Date
}

@Injectable()
export class GetPostUseCase implements UseCase<GetPostRequest, GetPostResponse> {
  constructor (
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {
  }

  async execute (request: GetPostRequest): Promise<GetPostResponse> {
    const postId = new PostId(request.id)
    const post = await this.postRepository.findOneById(postId)
    if (_.isNil(post)) {
      throw GetPostError.postNotFound()
    }

    const author = await this.userRepository.findOneById(post.authorId)
    if (_.isNil(author)) {
      throw GetPostError.authorNotFound()
    }

    return {
      id: post.id.value,
      authorId: author.id.value,
      authorName: author.name,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt
    }
  }
}
