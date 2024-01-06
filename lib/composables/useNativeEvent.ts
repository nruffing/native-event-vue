import { ref } from 'vue'
import { useEnsure } from './useEnsure'
import { useDebounce, type DebouncedFunction, DebounceMode } from './useDebounce'
import { log } from '../logger'
import { resolveEventPropNamePrefix } from '../NativeEventVue'

export type NativeEvent = { destroy: () => void } | undefined

/**
 * Composable to attach an HTML native event to an element.
 * @param domEl The DOM element or window to attach the event listener to.
 * @param event The name of the native event (e.g. `resize`).
 * @param listener The event handler function to attach. This is the same type as the browser
 * API [`addEventListener.listener` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback).
 * @param options Optional. This is the same type as the browser API [`addEventListener.options` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options).
 * @param debounceMs Optionally specify a debounce timeout.
 * @param debounceMode Specify the type of desired debounce behavior. Defaults to `Timeout`.
 * @param replaceExisting Optionally specify to replace any existing event handler that was attached using `native-event-vue`. Otherwise the new event listener will not be attached.
 * @returns {@link NativeEvent} object with a destroy method to remove the event listener.
 */
export function useNativeEvent(
  domEl: HTMLElement | (Window & typeof globalThis),
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  debounceMs?: number,
  debounceMode?: DebounceMode,
  replaceExisting?: boolean,
): NativeEvent {
  const ensure = useEnsure('useNativeEvent')
  ensure.ensureExists(domEl, 'domEl')
  ensure.ensureExists(event, 'event')
  ensure.ensureExists(listener, 'listener')

  if (debounceMs) {
    ensure.ensureNotNegative(debounceMs, 'debounceMs')
  }

  if (debounceMode) {
    ensure.ensureValidEnumValue(debounceMode, DebounceMode, 'debounceMode')
  }

  const eventPropNamePrefix = resolveEventPropNamePrefix(event)
  const existing = domEl[eventPropNamePrefix]
  if (existing) {
    if (replaceExisting) {
      log('useNativeEvent | replacing existing listener', { domEl, event, options, debounceMs, debounceMode, replaceExisting })
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
    log('useNativeEvent | event listener removed', { domEl, event, options, debounceMs, debounceMode, replaceExisting })
  }

  if (debounceMs) {
    const debounced = useDebounce(listener, debounceMs, debounceMode)
    listenerRef.value = debounced
    log('useNativeEvent | event listener debounced', { domEl, event, options, debounceMs, debounceMode, replaceExisting })
  }

  domEl.addEventListener(event, listenerRef.value, options)

  const result = { destroy: removeListener }
  domEl[eventPropNamePrefix] = result

  log('useNativeEvent | event listener added', { domEl, event, options, debounceMs, debounceMode, replaceExisting })

  return result
}
