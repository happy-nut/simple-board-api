import { Field, ObjectType } from '@nestjs/graphql'

interface CommentViewModelProps {
  id: string
  postId?: string
  authorId?: string
  authorName?: string
  content?: string
  createdAt?: Date
}

@ObjectType('Comment')
export class CommentViewModel implements CommentViewModelProps {

  @Field()
  readonly id: string

  @Field({ nullable: true })
  readonly postId?: string

  @Field({ nullable: true })
  readonly authorId?: string

  @Field({ nullable: true })
  readonly authorName?: string

  @Field({ nullable: true })
  readonly content?: string

  @Field({ nullable: true })
  readonly createdAt?: Date

  constructor (props: CommentViewModelProps) {
    this.id = props.id
    this.postId = props.postId
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.content = props.content
    this.createdAt = props.createdAt
  }
}
