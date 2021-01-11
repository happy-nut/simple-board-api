import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

@Controller()
export class HealthzController {

  @Get('healthz')
  @ApiOkResponse()
  healthz (): unknown {
    return {}
  }
}
