import { ref } from 'vue'
import { useEnsure } from './useEnsure'
import { useDebounce, type DebouncedFunction } from './useDebounce'
import { log } from '../logger'
import { resolveEventPropNamePrefix } from '../NativeEventVue'

export type NativeEvent = { destroy: () => void } | undefined

export function useNativeEvent(
  domEl: HTMLElement,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  debounceMs?: number,
  replaceExisting?: boolean,
): NativeEvent {
  const ensure = useEnsure('useNativeEvent')
  ensure.ensureExists(domEl, 'domEl')
  ensure.ensureExists(event, 'event')
  ensure.ensureExists(listener, 'listener')

  if (debounceMs) {
    ensure.ensureNotNegative(debounceMs, 'debounceMs')
  }

  const eventPropNamePrefix = resolveEventPropNamePrefix(event)
  const existing = domEl[eventPropNamePrefix]
  if (existing) {
    if (replaceExisting) {
      log('useNativeEvent | replacing existing listener', { domEl, event, options, debounceMs, replaceExisting })
      existing.destroy()
    } else {
      return
    }
  }

  const listenerRef = ref(listener)

  const removeListener = () => {
    if (debounceMs) {
      ;(listenerRef.value as DebouncedFunction).destroy()
    }
    domEl[eventPropNamePrefix] = undefined
    domEl.removeEventListener(event, listenerRef.value, options)
    log('useNativeEvent | event listener removed', { domEl, event, options, debounceMs, replaceExisting })
  }

  if (debounceMs) {
    const debounced = useDebounce(listener, debounceMs)
    listenerRef.value = debounced
    log('useNativeEvent | event listener debounced', { domEl, event, options, debounceMs, replaceExisting })
  }

  domEl.addEventListener(event, listenerRef.value, options)

  const result = { destroy: removeListener }
  domEl[eventPropNamePrefix] = result

  log('useNativeEvent | event listener added', { domEl, event, options, debounceMs, replaceExisting })

  return result
}
