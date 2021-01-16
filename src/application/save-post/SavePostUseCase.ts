import _ from 'lodash'
import { UseCase } from '../../shared/ddd'
import { Post, PostId } from '../../domain/Post'
import { UserId } from '../../domain/UserId'
import { PostRepository } from '../../domain/PostRepository'
import { SavePostError } from './SavePostError'
import { UserRepository } from '../../domain'

interface SavePostRequest {
  id?: string
  authorId: string
  title: string
  content: string
}

export type SavePostResponse = void

export class SavePostUseCase implements UseCase<SavePostRequest, SavePostResponse> {
  constructor (
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository
  ) {
  }

  async execute (request: SavePostRequest): Promise<SavePostResponse> {
    const { id, authorId, title, content } = request
    const userId = new UserId(authorId)
    const author = await this.userRepository.findOneById(userId)
    if (_.isNil(author)) {
      throw SavePostError.authorNotFound()
    }

    if (_.isNil(id)) {
      const created = await this.createPost(authorId, content, title)
      if (_.isNil(created)) {
        throw SavePostError.postCreatingFailed()
      }
      return
    }

    const updated = await this.updatePost(id, title, content, userId)
    if (_.isNil(updated)) {
      throw SavePostError.postUpdatingFailed()
    }
  }

  private async createPost (
    authorId: string,
    content: string,
    title: string
  ): Promise<Post | undefined> {
    const post = Post.createNew({
      authorId: new UserId(authorId),
      content: content,
      title: title
    })
    return await this.postRepository.save(post)
  }

  private async updatePost (
    id: string,
    title: string,
    content: string,
    userId: UserId
  ): Promise<Post | undefined> {
    const postId = new PostId(id)
    const foundPost = await this.postRepository.findOneById(postId)
    if (_.isNil(foundPost)) {
      throw SavePostError.postNotFound()
    }

    const post = Post.create(
      {
        title,
        content,
        authorId: userId,
        createdAt: foundPost.createdAt
      },
      postId
    )
    return await this.postRepository.save(post)
  }
}
