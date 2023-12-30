import { onBeforeUnmount, ref } from 'vue'
import { log } from '../logger'
import { useEnsure } from './useEnsure'
import type { MaybePromise } from '../types'

export type FunctionToDebounce<TReturn> = (...args: any[]) => TReturn

export type DebouncedFunction<TReturn> = {
  (...args: any[]): Promise<TReturn>
  clear(): void
  flush(): void
  destroy(): void
}

export function useDebounce<TReturn>(
  func: FunctionToDebounce<MaybePromise<TReturn>> | EventListenerObject,
  timeoutMs: number,
): DebouncedFunction<TReturn> {
  const ensure = useEnsure('useDebounce')
  ensure.ensureExists(func, 'func')
  ensure.ensureNotNegative(timeoutMs, 'timeoutMs')

  const timeoutId = ref<number | undefined>(undefined)
  const lastArgs = ref<any[] | undefined>(undefined)
  const isDestroyed = ref(false)

  const execute = () => {
    if (lastArgs.value) {
      clear()
      if ('handleEvent' in func) {
        return func.handleEvent(lastArgs.value[0])
      } else {
        return func(...lastArgs.value)
      }
    }
    throw new Error('useDebounce | execute called without lastArgs')
  }

  const clear = () => {
    lastArgs.value = undefined
    timeoutId.value = undefined
  }

  const debounced = (...args: any[]) =>
    new Promise<TReturn>((resolve, reject) => {
      {
        if (isDestroyed.value) {
          throw new Error('useDebounce | debounced function called after destroy')
        }

        lastArgs.value = args
        window.clearTimeout(timeoutId.value)

        timeoutId.value = window.setTimeout(() => {
          log('useDebounce | timeout reached', lastArgs.value)
          const result = execute()
          if (result instanceof Promise) {
            result.then(resolve).catch(reject)
          } else if (result) {
            resolve(result as TReturn)
          }
        }, timeoutMs)
      }
    })

  debounced.clear = () => {
    log('useDebounce | clear', {})
    clear()
  }

  debounced.flush = async () => {
    log('useDebounce | flush', lastArgs.value)
    await execute()
  }

  debounced.destroy = () => {
    log('useDebounce | destroy', {})
    clear()
    isDestroyed.value = true
  }

  onBeforeUnmount(() => {
    if (!isDestroyed.value) {
      debounced.destroy()
    }
  })

  return debounced
}
