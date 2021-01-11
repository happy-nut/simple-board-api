export interface UseCase<Params, Result> {
  execute(params: Params): Result | Promise<Result>
}
