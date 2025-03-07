import { Post } from '../../../src/domain/Post'
import { UserId } from '../../../src/domain/UserId'
import _ from 'lodash'
import { PostId } from '../../../src/domain/PostId'

export function createDummyPostsOrderByCreatedAt (count: number, userId?: UserId): Post[] {
  return _.times(count, (i) => {
    const time = `${count - i}`.padStart(2, '0')
    return Post.create(
      {
        createdAt: new Date(`2021-01-16T${time}:00:00Z`),
        content: `test-content-${i}`,
        title: `test-title-${i}`,
        authorId: userId ?? new UserId(`test-user-id-${i}`)
      },
      new PostId()
    )
  })
}
