import { DateScalar } from './DateScalar'
import { Kind, ValueNode } from 'graphql'

describe('DateScalar', () => {
  describe('.parseValue()', () => {
    it('parses value', () => {
      const uut = new DateScalar()
      const date = new Date()

      const result = uut.parseValue(date.toISOString())

      expect(result).toEqual<Date>(date)
    })
  })

  describe('.serialize()', () => {
    it('serializes to string', () => {
      const uut = new DateScalar()
      const date = new Date()

      const result = uut.serialize(date)

      expect(result).toBe(date.toISOString())
    })
  })

  describe('.parseLiteral()', () => {
    it('parses literal when given AST type is STRING', () => {
      const uut = new DateScalar()
      const date = new Date()
      const ast: ValueNode = {
        kind: Kind.STRING,
        value: date.toISOString()
      }

      const result = uut.parseLiteral(ast)

      expect(result).toEqual<Date>(date)
    })

    it('throws an error given AST type is not STRING', () => {
      const uut = new DateScalar()
      const ast: ValueNode = {
        kind: Kind.INT,
        value: '10'
      }

      expect(() => uut.parseLiteral(ast)).toThrow()
    })
  })
})
