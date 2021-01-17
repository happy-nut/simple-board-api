import { Connection, Repository } from 'typeorm'
import { UserId } from '../../domain/UserId'
import _ from 'lodash'
import { PostRepository } from '../../domain/PostRepository'
import { Post } from '../../domain/Post'
import { PostEntity } from './entities'
import { PostEntityMapper } from './mappers'
import { Injectable } from '@nestjs/common'
import { PostId } from '../../domain/PostId'

@Injectable()
export class TypeOrmPostRepository implements PostRepository {
  private readonly repository: Repository<PostEntity>

  constructor (private readonly connection: Connection) {
    this.repository = this.connection.getRepository(PostEntity)
  }

  async findAll (skip: number, take: number): Promise<Post[]> {
    if (skip < 0 || take <= 0) {
      return []
    }
    const postEntities = await this.repository.find({ skip, take, order: { createdAt: 'DESC' } })
    return _.map(postEntities, PostEntityMapper.toDomain)
  }

  async findOneById (id: PostId): Promise<Post | undefined> {
    const entity = await this.repository.findOne(id.value)
    if (_.isNil(entity)) {
      return undefined
    }

    return PostEntityMapper.toDomain(entity)
  }

  async findAllByUserId (userId: UserId): Promise<Post[]> {
    const postEntities = await this.repository.find({
      where: { authorId: userId.value },
      order: { createdAt: 'DESC' }
    })
    return _.map(postEntities, PostEntityMapper.toDomain)
  }

  async save (post: Post): Promise<Post | undefined> {
    const entity = PostEntityMapper.fromDomain(post)
    const saved = await this.repository.save(entity)
    return PostEntityMapper.toDomain(saved)
  }

  async removeOne (post: Post): Promise<void> {
    const entity = PostEntityMapper.fromDomain(post)
    await this.repository.remove(entity)
  }
}
