export type FunctionToDebounce = (...args: any[]) => unknown

export type DebouncedFunction = {
  (...args: any[]): unknown
  clear(): void
  flush(): void
}

export function useDebounce<TReturn>(func: FunctionToDebounce, timeoutMs: number): DebouncedFunction {
  let timeoutId: number | undefined = undefined
  let lastArgs: any[] | undefined = undefined

  const debounced = (...args: any[]) => {
    lastArgs = args
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      lastArgs = undefined
      timeoutId = undefined
      func(args)
    }, timeoutMs)
  }

  debounced.clear = () => {
    window.clearTimeout(timeoutId)
  }

  debounced.flush = () => {
    if (lastArgs) {
      func(lastArgs)
    }
  }

  return debounced
}
