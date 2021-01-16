import _ from 'lodash'
import { UseCase } from '../../shared/ddd'
import { Post } from '../../domain/Post'
import { UserId } from '../../domain/UserId'
import { PostRepository } from '../../domain/PostRepository'
import { SavePostError } from './SavePostError'

interface SaveUserRequest {
  authorId: string
  title: string
  content: string
}

export type SaveUserResponse = void

export class SavePostUseCase implements UseCase<SaveUserRequest, SaveUserResponse> {
  constructor (private readonly postRepository: PostRepository) {
  }

  async execute (request: SaveUserRequest): Promise<SaveUserResponse> {
    const { authorId, title, content } = request
    const post = Post.createNew({
      authorId: new UserId(authorId),
      content: content,
      title: title
    })
    const created = await this.postRepository.save(post)
    if (_.isNil(created)) {
      throw SavePostError.postSavingFailed()
    }
  }
}
