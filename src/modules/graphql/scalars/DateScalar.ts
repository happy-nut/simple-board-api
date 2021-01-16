import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Scalar('Date', (type: unknown) => Date)
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
