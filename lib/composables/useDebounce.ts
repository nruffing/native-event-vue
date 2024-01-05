import { ref } from 'vue'
import { log } from '../logger'
import { useEnsure } from './useEnsure'

export type FunctionToDebounce = (...args: any[]) => unknown

export type DebouncedFunction = {
  (...args: any[]): unknown
  clear(): void
  flush(): void
  destroy(): void
}

export enum DebounceMode {
  /**
   * Debounce using a timeout only. The function will not be called until it has not been called for the specified timeout.
   */
  Timeout = 'timeout',
  /**
   * Debounce using a timeout and immediate execution. The function will be called immediately and then not again until it has not been called for the specified timeout.
   */
  ImmediateAndTimeout = 'immediate-and-timeout',
  /**
   * Debounce using a maximum frequency. The function will be called immediately and then at most once every timeout. Debounced calls will always use the latest arguments.
   * The debounce function will be called even if its been called within the timeout.
   */
  MaximumFrequency = 'maximum-frequency',
}

export function useDebounce(
  func: FunctionToDebounce | EventListenerObject,
  timeoutMs: number,
  mode: DebounceMode = DebounceMode.Timeout,
): DebouncedFunction {
  const ensure = useEnsure('useDebounce')
  ensure.ensureExists(func, 'func')
  ensure.ensureNotNegative(timeoutMs, 'timeoutMs')
  ensure.ensureValidEnumValue(mode, DebounceMode, 'mode')

  const immediate = mode === DebounceMode.ImmediateAndTimeout || mode === DebounceMode.MaximumFrequency

  const lastCallTimestamp = ref<number | undefined>(undefined)
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
      lastCallTimestamp.value = Date.now()
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

    if (immediate) {
      /**
       * If this is the first call, execute immediately
       */
      if (!lastCallTimestamp.value) {
        log('useDebounce | first call', { args })
        lastArgs.value = args
        return execute()
      }

      /**
       * If this is a subsequent call, check if the timeout has been reached
       * and there are no pending calls
       */
      const elapsed = Date.now() - lastCallTimestamp.value
      if (!timeoutId.value && elapsed > timeoutMs) {
        log('useDebounce | subsequent call within timeout', { args, elapsed })
        lastArgs.value = args
        return execute()
      }
    }

    /**
     * If this is a subsequent call within the timeout or immediate execution is not
     * enabled, reset the timeout.
     * If maximum frequency mode is enabled we only want to update to the latest arguments
     * but not reset the timer.
     */
    lastArgs.value = args
    if (!timeoutId.value || mode === DebounceMode.Timeout || mode === DebounceMode.ImmediateAndTimeout) {
      window.clearTimeout(timeoutId.value)

      const timeout =
        mode === DebounceMode.MaximumFrequency && lastCallTimestamp.value ? timeoutMs - (Date.now() - lastCallTimestamp.value) : timeoutMs

      timeoutId.value = window.setTimeout(() => {
        execute()
        log('useDebounce | timeout reached', { args: lastArgs.value, lastCallTimestamp: lastCallTimestamp.value })
      }, timeout)

      log('useDebounce | timeout reset', { args: lastArgs.value, lastCallTimestamp: lastCallTimestamp.value, timeout })
    } else {
      log('useDebounce | maximum frequency mode skip', { args: lastArgs.value, lastCallTimestamp: lastCallTimestamp.value })
    }
  }

  debounced.clear = () => {
    log('useDebounce | clear', {})
    lastCallTimestamp.value = undefined
    clear()
  }

  debounced.flush = () => {
    log('useDebounce | flush', lastArgs.value)
    execute()
  }

  debounced.destroy = () => {
    log('useDebounce | destroy', {})
    window.clearTimeout(timeoutId.value)
    clear()
    lastCallTimestamp.value = undefined
    isDestroyed.value = true
  }

  return debounced
}
