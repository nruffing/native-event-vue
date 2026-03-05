import { ref } from 'vue'
import { useEnsure } from './useEnsure'
import { useDebounce, type DebouncedFunction, DebounceMode } from './useDebounce'
import { log } from '../logger'
import { resolveEventPropNamePrefix } from '../NativeEventVue'

export type NativeEvent = { destroy: () => void } | undefined

/**
 * Composable to attach an HTML native event to an element.
 * @param target The event target (e.g. DOM element or window) to attach the event listener to.
 * @param event The name of the native event (e.g. `resize`).
 * @param listener The event handler function to attach. This is the same type as the browser
 * API [`addEventListener.listener` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback).
 * @param options Optional. This is the same type as the browser API [`addEventListener.options` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options).
 * @param debounceMs Optionally specify a debounce timeout.
 * @param debounceMode Specify the type of desired debounce behavior. Defaults to `Timeout`.
 * @param replaceExisting Optionally specify to replace any existing event handler that was attached using `native-event-vue`. Otherwise the new event listener will not be attached.
 * @param preventDefaultAllDebouncedEvents Optionally specify to call `preventDefault` on all events including ones that are debounced. For example. to ensure that the drop event always fires as
 * expected, you should always include a `preventDefault` call in the part of your code which handles the dragover event.
 * @returns {@link NativeEvent} object with a destroy method to remove the event listener.
 */
export function useNativeEvent(
  target: EventTarget,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  debounceMs?: number,
  debounceMode?: DebounceMode,
  replaceExisting?: boolean,
  preventDefaultAllDebouncedEvents?: boolean,
): NativeEvent {
  const ensure = useEnsure('useNativeEvent')
  ensure.ensureExists(target, 'target')
  ensure.ensureExists(event, 'event')
  ensure.ensureExists(listener, 'listener')

  if (debounceMs) {
    ensure.ensureNotNegative(debounceMs, 'debounceMs')
  }

  if (debounceMode) {
    ensure.ensureValidEnumValue(debounceMode, DebounceMode, 'debounceMode')
  }

  const eventPropNamePrefix = resolveEventPropNamePrefix(event)
  const existing = target[eventPropNamePrefix]
  if (existing) {
    if (replaceExisting) {
      log('useNativeEvent | replacing existing listener', { target, event, options, debounceMs, debounceMode, replaceExisting })
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
    target[eventPropNamePrefix] = undefined
    target.removeEventListener(event, listenerRef.value, options)
    log('useNativeEvent | event listener removed', { target, event, options, debounceMs, debounceMode, replaceExisting })
  }

  if (debounceMs) {
    const debounced = useDebounce(listener, debounceMs, debounceMode, preventDefaultAllDebouncedEvents)
    listenerRef.value = debounced
    log('useNativeEvent | event listener debounced', { target, event, options, debounceMs, debounceMode, replaceExisting })
  }

  target.addEventListener(event, listenerRef.value, options)

  const result = { destroy: removeListener }
  target[eventPropNamePrefix] = result

  log('useNativeEvent | event listener added', { target, event, options, debounceMs, debounceMode, replaceExisting })

  return result
}
