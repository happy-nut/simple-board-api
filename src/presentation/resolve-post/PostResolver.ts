import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetPostError, GetPostUseCase } from '../../application/get-post'
import { Logger } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { SavePostError, SavePostUseCase } from '../../application/save-post'
import { DeletePostError, DeletePostUseCase } from '../../application/delete-post'
import { PostViewModel } from './PostViewModel'
import {
  ListPostsByAuthorIdError,
  ListPostsByAuthorIdUseCase
} from '../../application/list-posts-by-author-id'
import _ from 'lodash'

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
    private readonly listPostsByAuthorIdUseCase: ListPostsByAuthorIdUseCase,
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

  @Query(() => [PostViewModel])
  async listPostsByAuthorId (@Args('authorId') authorId: string): Promise<PostViewModel[]> {
    try {
      const responses = await this.listPostsByAuthorIdUseCase.execute({ userId: authorId })
      return _.map(responses, (response) => ({
        id: response.id,
        authorId: response.authorId,
        authorName: response.username,
        title: response.title,
        content: response.content,
        createdAt: response.createdAt
      }))
    } catch (error) {
      if (error instanceof ListPostsByAuthorIdError) {
        switch (error.code) {
          case 'AUTHOR_NOT_FOUND':
            throw new GraphQLError('Author not found')
        }
      }

      this.logger.error(error)
      throw error
    }
  }
}
