import { Logger, Module } from '@nestjs/common'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user'
import { CreateUserUseCase } from './application/create-user'
import { USER_REPOSITORY } from './domain'
import { TypeOrmUserRepository } from './infra/typeorm'
import { DatabaseModule } from './modules/DatabaseModule'
import { GetUserController } from './presentation/get-user'
import { GetUserUseCase } from './application/get-user'

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    HealthzController,
    CreateUserController,
    GetUserController
  ],
  providers: [
    Logger,
    CreateUserUseCase,
    GetUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    }
  ]
})
export class AppModule {}
