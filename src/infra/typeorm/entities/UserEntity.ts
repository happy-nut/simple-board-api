import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 100
  })
  id: string

  @Column({
    type: 'varchar',
    length: 100
  })
  name: string

  @Column({
    precision: 6,
    type: 'timestamp'
  })
  registeredAt: Date
}
