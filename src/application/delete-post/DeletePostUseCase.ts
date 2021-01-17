import { UseCase } from '../../shared/ddd'
import { POST_REPOSITORY, PostRepository } from '../../domain/PostRepository'
import _ from 'lodash'
import { DeletePostError } from './DeletePostError'
import { Inject, Injectable } from '@nestjs/common'
import { PostId } from '../../domain/PostId'

interface DeletePostRequest {
  postId: string
}

type DeletePostResponse = void

@Injectable()
export class DeletePostUseCase implements UseCase<DeletePostRequest, DeletePostResponse> {
  constructor (
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository
  ) {
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
