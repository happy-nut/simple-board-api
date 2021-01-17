import _ from 'lodash'
import { UseCase } from '../../shared/ddd'
import { Comment } from '../../domain/Comment'
import { UserId } from '../../domain/UserId'
import { SaveCommentError } from './SaveCommentError'
import { UserRepository } from '../../domain'
import { PostId } from '../../domain/PostId'
import { CommentRepository } from '../../domain/CommentRepository'
import { PostRepository } from '../../domain/PostRepository'
import { CommentId } from '../../domain/CommentId'

interface SaveCommentRequest {
  id?: string
  postId: string
  authorId: string
  content: string
}

export interface SaveCommentResponse {
  commentId: string
}

export class SaveCommentUseCase implements UseCase<SaveCommentRequest, SaveCommentResponse> {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository
  ) {
  }

  async execute (request: SaveCommentRequest): Promise<SaveCommentResponse> {
    const { id, postId, authorId, content } = request
    const userId = new UserId(authorId)
    const author = await this.userRepository.findOneById(userId)
    if (_.isNil(author)) {
      throw SaveCommentError.authorNotFound()
    }

    const post = await this.postRepository.findOneById(new PostId(postId))
    if (_.isNil(post)) {
      throw SaveCommentError.postNotFound()
    }

    if (_.isNil(id)) {
      const newComment = Comment.createNew(
        {
          authorId: new UserId(authorId),
          postId: new PostId(postId),
          content: content
        }
      )
      const created = await this.commentRepository.save(newComment)
      return {
        commentId: created.id.value
      }
    }

    const found = await this.commentRepository.findOneById(new CommentId(id))
    if (_.isNil(found)) {
      throw SaveCommentError.commentNotFound()
    }
    found.setContent(content)
    const updated = await this.commentRepository.save(found)
    return {
      commentId: updated.id.value
    }
  }
}
