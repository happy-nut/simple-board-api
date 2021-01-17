import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { GetPostError, GetPostUseCase } from '../../application/get-post'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { SavePostError, SavePostUseCase } from '../../application/save-post'
import { DeletePostError, DeletePostUseCase } from '../../application/delete-post'

interface PostViewModelProps {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: Date
}

@ObjectType('Post')
class PostViewModel implements PostViewModelProps {

  @Field()
  readonly id: string

  @Field()
  readonly authorId: string

  @Field()
  readonly authorName: string

  @Field()
  readonly title: string

  @Field()
  readonly content: string

  @Field(() => Date)
  readonly createdAt: Date

  constructor (props: PostViewModelProps) {
    this.id = props.id
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.title = props.title
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@InputType()
export class SavePostInput {
  @Field({ nullable: true })
  id?: string

  @Field()
  title: string

  @Field()
  content: string

  @Field()
  authorId: string
}

@Resolver(() => PostViewModel)
export class PostResolver {
  constructor (
    private readonly getPostUseCase: GetPostUseCase,
    private readonly savePostUseCase: SavePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly logger: Logger
  ) {
  }

  @Query(() => PostViewModel)
  async getPost (@Args('id') id: string): Promise<PostViewModel> {
    try {
      const post = await this.getPostUseCase.execute({ id })
      return new PostViewModel({
        id: post.id,
        authorName: post.authorName,
        authorId: post.authorId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt
      })
    } catch (error) {
      if (error instanceof GetPostError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
          case 'POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }

  @Mutation(() => PostViewModel)
  async savePost (@Args('input') input: SavePostInput): Promise<PostViewModel> {
    try {
      const { postId } = await this.savePostUseCase.execute({
        id: input.id,
        title: input.title,
        content: input.content,
        authorId: input.authorId
      })
      const post = await this.getPostUseCase.execute({ id: postId })
      return new PostViewModel({
        id: post.id,
        authorName: post.authorName,
        authorId: post.authorId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt
      })
    } catch (error) {
      if (error instanceof SavePostError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
          case 'POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
          case 'POST_UPDATING_FAILED':
            throw new GraphQLError('Failed to update post')
          case 'POST_CREATING_FAILED':
            throw new GraphQLError('Failed to create post')
        }
      } else if (error instanceof GetPostError) {
        switch (error.code) {
          case 'POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
          case 'AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }

  @Mutation(() => PostViewModel, { nullable: true })
  async removePost (@Args('id') id: string): Promise<null> {
    try {
      await this.deletePostUseCase.execute({ postId: id })
      return null
    } catch (error) {
      if (error instanceof DeletePostError) {
        switch (error.code) {
          case 'DeletePostError.POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
