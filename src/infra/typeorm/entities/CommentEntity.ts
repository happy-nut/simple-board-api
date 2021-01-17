import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('comment')
export class CommentEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 100
  })
  id: string

  @Column({
    type: 'varchar',
    length: 100
  })
  authorId: string

  @Column({
    type: 'varchar',
    length: 100
  })
  postId: string

  // See https://dev.mysql.com/doc/refman/5.7/en/blob.html
  @Column({
    type: 'text'
  })
  content: string

  @Column({
    precision: 6,
    type: 'timestamp'
  })
  createdAt: Date
}
