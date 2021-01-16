import { Logger, Module } from '@nestjs/common'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user'
import { CreateUserUseCase } from './application/create-user'
import { USER_REPOSITORY } from './domain'
import { TypeOrmUserRepository } from './infra/typeorm'
import { DatabaseModule } from './modules/DatabaseModule'
import { GetUserController } from './presentation/get-user'
import { GetUserUseCase } from './application/get-user'
import { ListPostsController } from './presentation/list-posts'
import { ListPostsUseCase } from './application/list-posts'
import { TypeOrmPostRepository } from './infra/typeorm/TypeOrmPostRepository'
import { POST_REPOSITORY } from './domain/PostRepository'
import { SavePostController } from './presentation/save-post'
import { SavePostUseCase } from './application/save-post'

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    HealthzController,
    CreateUserController,
    GetUserController,
    ListPostsController,
    SavePostController
  ],
  providers: [
    Logger,
    CreateUserUseCase,
    GetUserUseCase,
    ListPostsUseCase,
    SavePostUseCase,
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
