import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

@Controller()
export class HealthzController {

  @ApiTags('Health check')
  @Get('healthz')
  @ApiOkResponse()
  healthz (): unknown {
    return {}
  }
}
