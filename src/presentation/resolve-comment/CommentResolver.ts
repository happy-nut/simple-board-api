import { Args, Field, InputType, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { SaveCommentError, SaveCommentUseCase } from '../../application/save-comment'
import { DeleteCommentError, DeleteCommentUseCase } from '../../application/delete-comment'
import { CommentViewModel } from './CommentViewModel'
import {
  ListCommentsByAuthorIdError,
  ListCommentsByAuthorIdUseCase
} from '../../application/list-comments-by-author-id'
import _ from 'lodash'
import {
  ListCommentsByPostIdError,
  ListCommentsByPostIdUseCase
} from '../../application/list-comments-by-post-id'

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
    private readonly listCommentsByAuthorIdUseCase: ListCommentsByAuthorIdUseCase,
    private readonly listCommentsByPostIdUseCase: ListCommentsByPostIdUseCase,
    private readonly logger: Logger
  ) {
  }

  @Query(() => CommentViewModel, { nullable: true })
  async getComment (): Promise<CommentViewModel> {
    throw new GraphQLError('This is not allowed. Use comments listing API instead.')
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

  @Query(() => [CommentViewModel])
  async listCommentsByAuthorId (@Args('authorId') authorId: string): Promise<CommentViewModel[]> {
    try {
      const responses = await this.listCommentsByAuthorIdUseCase.execute({ authorId })
      return _.map(responses, (response) => ({
        id: response.id,
        authorName: response.username,
        postId: response.postId,
        content: response.content,
        createdAt: response.createdAt
      }))
    } catch (error) {
      if (error instanceof ListCommentsByAuthorIdError) {
        switch (error.code) {
          case 'ListCommentsByAuthorIdError.AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }

  @Query(() => [CommentViewModel])
  async listCommentsByPostId (
    @Args('postId') postId: string,
    @Args('skip', { type: () => Int, nullable: true }) skip = 0,
    @Args('take', { type: () => Int, nullable: true }) take = 100
  ): Promise<CommentViewModel[]> {
    try {
      const responses = await this.listCommentsByPostIdUseCase.execute({ postId, skip, take })
      return _.map(responses, (response) => ({
        id: response.id,
        authorName: response.username,
        authorId: response.authorId,
        content: response.content,
        createdAt: response.createdAt
      }))
    } catch (error) {
      if (error instanceof ListCommentsByPostIdError) {
        switch (error.code) {
          case 'ListCommentsByPostIdError.POST_NOT_FOUND':
            throw new GraphQLError('Post not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
