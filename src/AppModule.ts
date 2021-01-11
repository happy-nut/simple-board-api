import { Logger, Module } from '@nestjs/common'
import { HealthzController } from './presentation/healthz/healthzController'

@Module({
  imports: [],
  controllers: [
    HealthzController
  ],
  providers: [
    Logger
  ]
})
export class AppModule {}
