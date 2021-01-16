import {
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param
} from '@nestjs/common'
import { DeletePostError, DeletePostUseCase } from '../../application/delete-post'

type DeletePostViewModel = void

@Controller()
export class DeletePostController {
  constructor (
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly logger: Logger
  ) {
  }

  @Delete('/posts/:postId')
  async delete (@Param() postId: string): Promise<DeletePostViewModel> {
    try {
      await this.deletePostUseCase.execute({ postId })
    } catch (error) {
      if (error instanceof DeletePostError) {
        switch (error.code) {
          case 'POST_NOT_FOUND':
            throw new NotFoundException()
        }
      }

      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }
}
