export function stateGetter<T>(module: any, getStateFunc: (s: any) => T) {
  return getStateFunc(module.store.state);
}
