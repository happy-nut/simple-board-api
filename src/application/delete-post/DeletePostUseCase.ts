import { UseCase } from '../../shared/ddd'
import { PostRepository } from '../../domain/PostRepository'
import { PostId } from '../../domain/Post'
import _ from 'lodash'
import { DeletePostError } from './DeletePostError'

interface DeletePostRequest {
  postId: string
}

type DeletePostResponse = void

export class DeletePostUseCase implements UseCase<DeletePostRequest, DeletePostResponse> {
  constructor (private readonly postRepository: PostRepository) {
  }

  async execute (request: DeletePostRequest): Promise<DeletePostResponse> {
    const { postId } = request
    const post = await this.postRepository.findOneById(new PostId(postId))
    if (_.isNil(post)) {
      throw DeletePostError.postNotFound()
    }

    await this.postRepository.removeOne(post)
  }
}
