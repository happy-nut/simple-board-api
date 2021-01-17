import { Comment } from '../../../src/domain/Comment'
import { UserId } from '../../../src/domain/UserId'
import _ from 'lodash'
import { PostId } from '../../../src/domain/PostId'
import { CommentId } from '../../../src/domain/CommentId'

export function createDummyCommentsOrderByCreatedAt (
  count: number,
  userId?: UserId,
  postId?: PostId,
  commentId?: CommentId
): Comment[] {
  return _.times(count, (i) => {
    const time = `${i}`.padStart(2, '0')
    return Comment.create(
      {
        createdAt: new Date(`2021-01-16T${time}:00:00Z`),
        content: `test-content-${i}`,
        postId: postId ?? new PostId(`test-post-id-${i}`),
        authorId: userId ?? new UserId(`test-user-id-${i}`)
      },
      commentId ?? new CommentId()
    )
  })
}

