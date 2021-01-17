import { UserId } from './UserId'
import { AggregateRoot } from '../shared/ddd'
import { CommentId } from './CommentId'
import { PostId } from './PostId'

export interface CommentProps {
  authorId: UserId
  postId: PostId
  createdAt: Date
  content: string
}

interface CommentCreateNewProps {
  authorId: UserId
  postId: PostId
  content: string
}

export class Comment extends AggregateRoot<CommentProps> {
  static create (props: CommentProps, id: CommentId): Comment {
    return new Comment({ ...props }, id)
  }

  static createNew (props: CommentCreateNewProps): Comment {
    return new Comment(
      {
        ...props,
        createdAt: new Date()
      },
      new CommentId()
    )
  }

  get authorId (): UserId {
    return this.props.authorId
  }

  get postId (): PostId {
    return this.props.postId
  }

  get content (): string {
    return this.props.content
  }

  get createdAt (): Date {
    return this.props.createdAt
  }
}
