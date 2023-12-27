import { onBeforeUnmount, ref } from 'vue'
import { log } from '../logger'
import { useEnsure } from './useEnsure'

export type FunctionToDebounce = (...args: any[]) => unknown

export type DebouncedFunction = {
  (...args: any[]): unknown
  clear(): void
  flush(): void
  destroy(): void
}

export function useDebounce(func: FunctionToDebounce | EventListenerObject, timeoutMs: number): DebouncedFunction {
  const ensure = useEnsure('useDebounce')
  ensure.ensureExists(func, 'func')
  ensure.ensureNotNegative(timeoutMs, 'timeoutMs')

  const timeoutId = ref<number | undefined>(undefined)
  const lastArgs = ref<any[] | undefined>(undefined)
  const isDestroyed = ref(false)

  const execute = () => {
    if (lastArgs.value) {
      if ('handleEvent' in func) {
        func.handleEvent(lastArgs.value[0])
      } else {
        func(...lastArgs.value)
      }
      clear()
    }
  }

  const clear = () => {
    lastArgs.value = undefined
    timeoutId.value = undefined
  }

  const debounced = (...args: any[]) => {
    if (isDestroyed.value) {
      return
    }

    lastArgs.value = args
    window.clearTimeout(timeoutId.value)

    timeoutId.value = window.setTimeout(() => {
      log('useDebounce | timeout reached', lastArgs.value)
      execute()
    }, timeoutMs)
  }

  debounced.clear = () => {
    log('useDebounce | clear', {})
    clear()
  }

  debounced.flush = () => {
    log('useDebounce | flush', lastArgs.value)
    execute()
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
