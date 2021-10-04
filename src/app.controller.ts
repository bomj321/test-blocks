import { Controller, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './auth/guards/api-key.guard'

@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor() { }

}
