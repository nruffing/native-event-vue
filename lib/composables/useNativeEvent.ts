import { ref, onBeforeUnmount } from 'vue'
import { useEnsure } from './useEnsure'
import { useDebounce } from './useDebounce'
import { log } from '../logger'

export function useNativeEvent(
  domEl: HTMLElement,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  debounceMs?: number,
  removeBeforeUnmount: boolean = true,
) {
  const ensure = useEnsure('useNativeEvent')
  ensure.ensureExists(domEl, 'domEl')
  ensure.ensureExists(event, 'event')
  ensure.ensureExists(listener, 'listener')

  if (debounceMs) {
    ensure.ensureNotNegative(debounceMs, 'debounceMs')
  }

  const listenerRef = ref(listener)

  const removeListener = () => {
    domEl.removeEventListener(event, listenerRef.value, options)
    log('useNativeEvent | event listener removed', { domEl, event, options, debounceMs })
  }

  if (removeBeforeUnmount) {
    onBeforeUnmount(removeListener)
  }

  if (debounceMs) {
    const debounced = useDebounce(listener, debounceMs)
    listenerRef.value = debounced
    log('useNativeEvent | event listener debounced', { domEl, event, options, debounceMs })
  }

  domEl.addEventListener(event, listenerRef.value, options)

  log('useNativeEvent | event listener added', { domEl, event, options, debounceMs })

  return { removeListener }
}
