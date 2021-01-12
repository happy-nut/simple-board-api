import { Logger, Module } from '@nestjs/common'
import { HealthzController } from './presentation/healthz/healthzController'
import { CreateUserController } from './presentation/create-user/CreateUserController'
import { CreateUserUseCase } from './application/create-user'
import { USER_REPOSITORY } from './domain'
import { TypeOrmUserRepository } from './infra/typeorm'
import { DatabaseModule } from './modules/DatabaseModule'

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    HealthzController,
    CreateUserController
  ],
  providers: [
    Logger,
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository
    }
  ]
})
export class AppModule {}
