import type { DirectiveBinding, VNode } from 'vue'
import { log } from '../logger'
import { useNativeEvent } from '../composables/useNativeEvent'

export interface NativeEventOptions {
  event: string
  listener: EventListenerOrEventListenerObject
  options?: boolean | AddEventListenerOptions
  debounceMs?: number
}

export const nativeEvent = {
  beforeMount: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions | false>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    if (binding.value === false) {
      return
    }

    useNativeEvent(domEl, binding.value.event, binding.value.listener, binding.value.options, binding.value.debounceMs)

    log('native-event | beforeMount', { domEl, options: binding.value })
  },
}
