import { AppModule } from './AppModule'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user'
import { GetUserController } from './presentation/get-user'
import { ListPostsController } from './presentation/list-posts'
import { SavePostController } from './presentation/save-post'
import { DeletePostController } from './presentation/delete-post'
import { DatabaseModule, GraphQueryLanguageModule } from './modules'
import { UserResolver } from './presentation/resolve-user'
import { ListPostsByAuthorIdController } from './presentation/list-posts-by-author-id'
import { GetPostController } from './presentation/get-post'
import { SaveCommentController } from './presentation/save-comment'
import { ListCommentsByAuthorIdController } from './presentation/list-comments-by-author-id'
import { ListCommentsByPostIdController } from './presentation/list-comments-by-post-id'
import { DeleteCommentController } from './presentation/delete-comment'
import { PostResolver } from './presentation/resolve-post'
import { CommentResolver } from './presentation/resolve-comment'

describe('AppModule', () => {
  let uut: TestingModule

  beforeEach(async () => {
    uut = await Test
      .createTestingModule({
        imports: [AppModule]
      })
      .compile()
  })

  afterEach(async () => {
    await uut.close()
  })

  it('gets DatabaseModule', () => {
    expect(uut.get(DatabaseModule)).toBeInstanceOf(DatabaseModule)
  })

  it('gets GraphQueryLanguageModule', () => {
    expect(uut.get(GraphQueryLanguageModule)).toBeInstanceOf(GraphQueryLanguageModule)
  })

  it('gets HealthzController', () => {
    expect(uut.get(HealthzController)).toBeInstanceOf(HealthzController)
  })

  it('gets CreateUserController', () => {
    expect(uut.get(CreateUserController)).toBeInstanceOf(CreateUserController)
  })

  it('gets GetUserController', () => {
    expect(uut.get(GetUserController)).toBeInstanceOf(GetUserController)
  })

  it('gets ListPostsController', () => {
    expect(uut.get(ListPostsController)).toBeInstanceOf(ListPostsController)
  })

  it('gets SavePostController', () => {
    expect(uut.get(SavePostController)).toBeInstanceOf(SavePostController)
  })

  it('gets DeletePostController', () => {
    expect(uut.get(DeletePostController)).toBeInstanceOf(DeletePostController)
  })

  it('gets ListPostsByAuthorIdController', () => {
    expect(uut.get(ListPostsByAuthorIdController)).toBeInstanceOf(ListPostsByAuthorIdController)
  })

  it('gets GetPostController', () => {
    expect(uut.get(GetPostController)).toBeInstanceOf(GetPostController)
  })

  it('gets SaveCommentController', () => {
    expect(uut.get(SaveCommentController)).toBeInstanceOf(SaveCommentController)
  })

  it('gets ListCommentsByAuthorIdController', () => {
    expect(uut.get(ListCommentsByAuthorIdController))
      .toBeInstanceOf(ListCommentsByAuthorIdController)
  })

  it('gets ListCommentsByPostIdController', () => {
    expect(uut.get(ListCommentsByPostIdController))
      .toBeInstanceOf(ListCommentsByPostIdController)
  })

  it('gets DeleteCommentController', () => {
    expect(uut.get(DeleteCommentController)).toBeInstanceOf(DeleteCommentController)
  })

  it('gets UserResolver', () => {
    expect(uut.get(UserResolver)).toBeInstanceOf(UserResolver)
  })

  it('gets PostResolver', () => {
    expect(uut.get(PostResolver)).toBeInstanceOf(PostResolver)
  })

  it('gets CommentResolver', () => {
    expect(uut.get(CommentResolver)).toBeInstanceOf(CommentResolver)
  })
})
