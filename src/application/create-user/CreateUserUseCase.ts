import { User } from '../../domain'
import { UseCase } from '../../shared/ddd'

interface Params {
  name: string
}

interface Result {
  id: string
  name: string
  registeredAt: Date
}

export class CreateUserUseCase implements UseCase<Params, Result> {
  execute (params: Params): Promise<Result> | Result {
    const user = User.createNew({ name: params.name })
    return {
      id: user.id.value,
      name: user.name,
      registeredAt: user.registeredAt
    }
  }
}
