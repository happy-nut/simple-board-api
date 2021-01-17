import { Field, ObjectType } from '@nestjs/graphql'

interface PostViewModelProps {
  id: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: Date
}

@ObjectType('Post')
export class PostViewModel implements PostViewModelProps {

  @Field()
  readonly id: string

  @Field()
  readonly authorId: string

  @Field()
  readonly authorName: string

  @Field()
  readonly title: string

  @Field()
  readonly content: string

  @Field(() => Date)
  readonly createdAt: Date

  constructor (props: PostViewModelProps) {
    this.id = props.id
    this.authorId = props.authorId
    this.authorName = props.authorName
    this.title = props.title
    this.content = props.content
    this.createdAt = props.createdAt
  }
}
