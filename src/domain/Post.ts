import { AggregateRoot } from '../shared/ddd'
import { UserId } from './UserId'
import { PostId } from './PostId'

export interface PostProps {
  authorId: UserId
  title: string
  content: string
  createdAt: Date
}

interface PostCreateNewProps {
  authorId: UserId
  title: string
  content: string
}

export class Post extends AggregateRoot<PostProps> {
  static create (props: PostProps, id: PostId): Post {
    return new Post({ ...props }, id)
  }

  static createNew (props: PostCreateNewProps): Post {
    return new Post({
      ...props,
      createdAt: new Date()
    }, new PostId())
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
