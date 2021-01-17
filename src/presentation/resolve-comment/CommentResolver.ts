import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { SaveCommentError, SaveCommentUseCase } from '../../application/save-comment'
import { DeleteCommentError, DeleteCommentUseCase } from '../../application/delete-comment'

interface CommentViewModelProps {
  id: string
  postId?: string
  authorId?: string
  authorName?: string
  content?: string
  createdAt?: Date
}

@ObjectType('Comment')
class CommentViewModel implements CommentViewModelProps {

  @Field()
  readonly id: string

  @Field({ nullable: true })
  readonly postId?: string

  @Field({ nullable: true })
  readonly authorId?: string

  @Field({ nullable: true })
  readonly authorName?: string

  @Field({ nullable: true })
  readonly content?: string

  @Field({ nullable: true })
  readonly createdAt?: Date

  constructor (props: CommentViewModelProps) {
    this.id = props.id
    this.postId = props.postId
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.content = props.content
    this.createdAt = props.createdAt
  }
}

@InputType()
export class SaveCommentInput {
  @Field({ nullable: true })
  id?: string

  @Field()
  content: string

  @Field()
  authorId: string

  @Field()
  postId: string
}

@Resolver(() => CommentViewModel)
export class CommentResolver {
  constructor (
    private readonly saveCommentUseCase: SaveCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly logger: Logger
  ) {
  }

  @Query(() => CommentViewModel, { nullable: true })
  async getComment (@Args('input') input: SaveCommentInput): Promise<CommentViewModel> {
    throw new GraphQLError('Use list comments API instead')
  }

  @Mutation(() => CommentViewModel)
  async saveComment (@Args('input') input: SaveCommentInput): Promise<CommentViewModel> {
    try {
      const { commentId } = await this.saveCommentUseCase.execute({
        id: input.id,
        postId: input.postId,
        content: input.content,
        authorId: input.authorId
      })
      return new CommentViewModel({
        id: commentId
      })
    } catch (error) {
      if (error instanceof SaveCommentError) {
        switch (error.code) {
          case 'COMMENT_ERROR_COMMENT_NOT_FOUND':
            throw new GraphQLError('Comment not found')
          case 'COMMENT_ERROR_AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
          case 'COMMENT_ERROR_POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }

  @Mutation(() => CommentViewModel, { nullable: true })
  async removeComment (@Args('id') id: string): Promise<null> {
    try {
      await this.deleteCommentUseCase.execute({ commentId: id })
      return null
    } catch (error) {
      if (error instanceof DeleteCommentError) {
        switch (error.code) {
          case 'DeleteCommentError.COMMENT_NOT_FOUND':
            throw new GraphQLError('Comment not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
