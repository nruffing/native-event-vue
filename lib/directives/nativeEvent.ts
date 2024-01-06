import type { DirectiveBinding, VNode } from 'vue'
import { log } from '../logger'
import { useNativeEvent } from '../composables/useNativeEvent'
import { DebugLogLevel, resolveEventPropNamePrefix } from '../NativeEventVue'
import type { DebounceMode } from '../composables/useDebounce'

export interface NativeEventOptions {
  /**
   * The name of the native event (e.g. `resize`).
   */
  event: string
  /**
   * The event handler function to attach. This is the same type as the browser
   * API [`addEventListener.listener` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback).
   */
  listener: EventListenerOrEventListenerObject
  /**
   * Optional. This is the same type as the browser API [`addEventListener.options` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options).
   */
  options?: boolean | AddEventListenerOptions
  /**
   * Optionally specify a debounce timeout.
   */
  debounceMs?: number
  /**
   * Specify the type of desired debounce behavior. Defaults to `Timeout`.
   */
  debounceMode?: DebounceMode
  /**
   * Optionally disable/remove the event handler.
   */
  disabled?: boolean | null | undefined
}

export const nativeEventDirective = {
  beforeMount: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    if (binding.value.disabled) {
      return
    }

    addEventListener(domEl, binding, true)
    log('native-event | beforeMount', { domEl, binding: binding.value }, DebugLogLevel.Verbose)
  },
  updated: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    if (binding.value.disabled) {
      return removeEventListener(domEl, binding)
    }
    addEventListener(domEl, binding, false)
    log('native-event | updated', { domEl, binding: binding.value }, DebugLogLevel.Verbose)
  },
  beforeUnmount: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    removeEventListener(domEl, binding)
    log('native-event | beforeUnmount', { domEl, binding: binding.value }, DebugLogLevel.Verbose)
  },
}

function addEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>, replaceExisting: boolean) {
  useNativeEvent(
    domEl,
    binding.value.event,
    binding.value.listener,
    binding.value.options,
    binding.value.debounceMs,
    binding.value.debounceMode,
    replaceExisting,
  )
  //log('native-event | event listener added', { domEl, binding: binding.value, replaceExisting })
}

function removeEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>) {
  const propKey = resolveEventPropNamePrefix(binding.value.event)
  domEl[propKey]?.destroy()
  //log('native-event | event listener removed', { domEl, binding: binding.value })
}
