import { UseCase } from '../../shared/ddd'
import _ from 'lodash'
import { PostRepository } from '../../domain/PostRepository'
import { PostId } from '../../domain/Post'
import { GetPostError } from './GetPostError'
import { UserRepository } from '../../domain'

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

export class GetPostUseCase implements UseCase<GetPostRequest, GetPostResponse> {
  constructor (
    private readonly postRepository: PostRepository,
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
