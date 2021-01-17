import { Connection, Repository } from 'typeorm'
import _ from 'lodash'
import { CommentRepository } from '../../domain/CommentRepository'
import { Comment } from '../../domain/Comment'
import { CommentEntity } from './entities'
import { CommentEntityMapper } from './mappers'
import { CommentId } from '../../domain/CommentId'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TypeOrmCommentRepository implements CommentRepository {
  private readonly repository: Repository<CommentEntity>

  constructor (private readonly connection: Connection) {
    this.repository = this.connection.getRepository(CommentEntity)
  }

  async findOneById (id: CommentId): Promise<Comment | undefined> {
    const entity = await this.repository.findOne(id.value)
    if (_.isNil(entity)) {
      return undefined
    }

    return CommentEntityMapper.toDomain(entity)
  }

  async save (comment: Comment): Promise<Comment> {
    const entity = CommentEntityMapper.fromDomain(comment)
    const saved = await this.repository.save(entity)
    return CommentEntityMapper.toDomain(saved)
  }
}
