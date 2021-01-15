import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('post')
export class PostEntity {
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
    length: 200
  })
  title: string

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
