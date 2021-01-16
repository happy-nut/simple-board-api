import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  parseValue (value: string): Date {
    return new Date(value)
  }

  serialize (value: Date): string {
    return value.toISOString()
  }

  parseLiteral (ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }

    throw new Error(`[DateScalar] Invalid AST kind: ${ast.kind}`)
  }
}
