export interface Command<TParams, TResponse> {
  runAsync(params: TParams): Promise<TResponse>;
}
