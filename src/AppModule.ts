import { Logger, Module } from '@nestjs/common'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user'
import { CreateUserUseCase } from './application/create-user'
import { USER_REPOSITORY } from './domain'
import { TypeOrmUserRepository } from './infra/typeorm'
import { GetUserController } from './presentation/get-user'
import { GetUserUseCase } from './application/get-user'
import { ListPostsController } from './presentation/list-posts'
import { ListPostsUseCase } from './application/list-posts'
import { TypeOrmPostRepository } from './infra/typeorm/TypeOrmPostRepository'
import { POST_REPOSITORY } from './domain/PostRepository'
import { SavePostController } from './presentation/save-post'
import { SavePostUseCase } from './application/save-post'
import { DeletePostController } from './presentation/delete-post'
import { DeletePostUseCase } from './application/delete-post'
import { DatabaseModule, GraphQueryLanguageModule } from './modules'
import { UserResolver } from './presentation/resolve-user'
import { ListPostsByAuthorIdController } from './presentation/list-posts-by-author-id'
import { ListPostsByAuthorIdUseCase } from './application/list-posts-by-author-id'

@Module({
  imports: [
    DatabaseModule,
    GraphQueryLanguageModule,
  ],
  controllers: [
    HealthzController,
    CreateUserController,
    GetUserController,
    ListPostsController,
    SavePostController,
    DeletePostController,
    ListPostsByAuthorIdController
  ],
  providers: [
    Logger,
    CreateUserUseCase,
    GetUserUseCase,
    ListPostsUseCase,
    SavePostUseCase,
    DeletePostUseCase,
    ListPostsByAuthorIdUseCase,
    UserResolver,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    },
    {
      provide: POST_REPOSITORY,
      useClass: TypeOrmPostRepository
    }
  ]
})
export class AppModule {}
