import { log } from '../logger'

export type FunctionToDebounce = (...args: any[]) => unknown

export type DebouncedFunction = {
  (...args: any[]): unknown
  clear(): void
  flush(): void
}

export function useDebounce(func: FunctionToDebounce, timeoutMs: number): DebouncedFunction {
  let timeoutId: number | undefined = undefined
  let lastArgs: any[] | undefined = undefined

  const debounced = (...args: any[]) => {
    lastArgs = args
    window.clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      log('useDebounce | timeout reached', lastArgs)
      func(lastArgs)
      lastArgs = undefined
      timeoutId = undefined
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
