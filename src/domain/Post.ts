import { AggregateRoot, EntityId } from '../shared/ddd'
import { UserId } from './UserId'

export class PostId extends EntityId {
}

interface PostProps {
  authorId: UserId
  title: string
  content: string
  createdAt: Date
}

export class Post extends AggregateRoot<PostProps> {
  static create (props: PostProps, id: PostId): Post {
    return new Post({ ...props }, id)
  }

  static createNew (props: PostProps): Post {
    return new Post({ ...props }, new PostId())
  }

  get authorId (): UserId {
    return this.props.authorId
  }

  get title (): string {
    return this.props.title
  }

  get content (): string {
    return this.props.content
  }

  get createdAt (): Date {
    return this.props.createdAt
  }
}
