import { Connection } from 'typeorm'
import { UserId } from '../../domain/UserId'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '../../modules/DatabaseModule'
import { Post, PostId } from '../../domain/Post'
import { TypeOrmPostRepository } from './TypeOrmPostRepository'
import _ from 'lodash'
import { PostEntity } from './entities'

describe('TypeOrmPostRepository', () => {
  let connection: Connection
  let testingModule: TestingModule
  let uut: TypeOrmPostRepository

  async function whenGivenNumberOfPostsSaved (numberOfPosts: number): Promise<void> {
     await Promise.all(_.times(numberOfPosts, async (i) => {
       const time = `${i}`.padStart(2, '0')
       const post = Post.create(
         {
           createdAt: new Date(`2021-01-16T${time}:00:00Z`),
           content: `test-content-${i}`,
           title: `test-title-${i}`,
           authorId: new UserId(`test-user-id-${i}`)
         },
         new PostId()
       )
       await uut.save(post)
     }))
  }

  beforeEach(async () => {
    testingModule = await Test
      .createTestingModule({
        imports: [DatabaseModule]
      })
      .compile()
    connection = await testingModule.resolve(Connection)
    uut = new TypeOrmPostRepository(connection)
  })

  afterEach(async () => {
    const repository = connection.getRepository(PostEntity)
    await repository.clear()
    await testingModule.close()
  })

  describe('.findAll', () => {
    it('finds nothing when take is equal or smaller than 0', async () => {
      const posts = await uut.findAll(0, 0)

      expect(posts).toEqual([])
    })

    it('finds nothing when skip is smaller than 0', async () => {
      const posts = await uut.findAll(-1, 1)

      expect(posts).toEqual([])
    })

    it('finds posts', async () => {
      await whenGivenNumberOfPostsSaved(10)

      const posts = await uut.findAll(5, 2)

      expect(posts.length).toBe(2)
      const post1 = posts[0]
      expect(post1.id.value).toBeString()
      expect(post1.content).toMatch(/5$/)
      expect(post1.title).toMatch(/5$/)
      expect(post1.authorId.value).toMatch(/5$/)
      expect(post1.createdAt).toBeInstanceOf(Date)
      const post2 = posts[1]
      expect(post2.id.value).toBeString()
      expect(post2.content).toMatch(/6$/)
      expect(post2.title).toMatch(/6$/)
      expect(post2.authorId.value).toMatch(/6$/)
      expect(post2.createdAt).toBeInstanceOf(Date)
    })

    it('finds posts when the whole number of data cannot cover given take', async () => {
      await whenGivenNumberOfPostsSaved(10)

      const posts = await uut.findAll(9, 2)

      expect(posts.length).toBe(1)
      const post1 = posts[0]
      expect(post1.id.value).toBeString()
      expect(post1.content).toMatch(/9$/)
      expect(post1.title).toMatch(/9$/)
      expect(post1.authorId.value).toMatch(/9$/)
      expect(post1.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('.findOneById', () => {
    it('finds undefined when there is no post that has given ID', async () => {
      const postId = new PostId()

      const post = await uut.findOneById(postId)

      expect(post).toBeUndefined()
    })

    it('finds a post when there is a post that has given ID', async () => {
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })
      await uut.save(post)

      const found = await uut.findOneById(post.id) as Post

      expect(found).toBeDefined()
      expect(found.id.equals(post.id)).toBeTrue()
      expect(found.authorId.equals(post.authorId)).toBeTrue()
      expect(found.title).toBe(post.title)
      expect(found.content).toBe(post.content)
      expect(found.createdAt).toEqual<Date>(post.createdAt)
    })
  })

  describe('.save', () => {
    it('crates a post', async () => {
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })

      const created = await uut.save(post) as Post

      expect(created.id.equals(post.id)).toBeTrue()
      expect(created.createdAt).toEqual<Date>(post.createdAt)
      expect(created.content).toBe(post.content)
      expect(created.title).toBe(post.title)
      expect(created.authorId.equals(post.authorId)).toBeTrue()
    })

    it('updates a post', async () => {
      const now = new Date()
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })
      await uut.save(post)
      const postWithSameId = Post.create(
        {
          createdAt: now,
          content: 'test-content-2',
          title: 'test-title-2',
          authorId: new UserId('test-user-id')
        },
        post.id
      )

      const updated = await uut.save(postWithSameId) as Post

      expect(updated.id.equals(post.id)).toBeTrue()
      expect(updated.createdAt).toEqual<Date>(now)
      expect(updated.content).toBe('test-content-2')
      expect(updated.title).toBe('test-title-2')
      expect(updated.authorId.equals(post.authorId)).toBeTrue()
    })
  })

  describe('.removeOneById', () => {
    it('removes nothing and resolves undefined' +
      ' when there is no post corresponding given ID', async () => {
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })
      const result = await uut.removeOne(post)

      expect(result).toBeUndefined()
    })

    it('removes a post', async () => {
      const post = Post.createNew({
        content: 'test-content',
        title: 'test-title',
        authorId: new UserId('test-user-id')
      })
      await uut.save(post)

      await uut.removeOne(post)

      const found = await uut.findOneById(post.id)
      expect(found).toBeUndefined()
    })
  })
})
