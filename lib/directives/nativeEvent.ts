import type { DirectiveBinding, VNode } from 'vue'
import { log } from '../logger'
import { useNativeEvent } from '../composables/useNativeEvent'

export interface NativeEventOptions {
  event: string
  listener: EventListenerOrEventListenerObject
  options?: boolean | AddEventListenerOptions
  debounceMs?: number
  disabled?: boolean | null | undefined
}

const eventPropNamePrefix = 'native-event-vue-'

export const nativeEvent = {
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
    log('native-event | beforeMount', { domEl, options: binding.value })
  },
  updated: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    if (binding.value.disabled) {
      removeEventListener(domEl, binding)
    } else if (el.getAttribute('draggable') !== 'true') {
      setupDrag(el, binding.value)
    }
    log('native-event | updated', { domEl, options: binding.value })
  },
  beforeUnmount: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    // remove drag events
    removeEventHandler(el, 'dragstart', opts)
    removeEventHandler(el, 'dragend', opts)
    log({ eventName: 'drag | beforeUnmount', domEl: el, dragOpts: binding.value, opts })
  },
}

function addEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>, replaceExisting: boolean) {
  if (replaceExisting) {
    removeEventListener(domEl, binding)
  }
  const domAny = domEl as any
  const propKey = `${eventPropNamePrefix}${binding.value.event}`
  domAny[propKey] = useNativeEvent(domEl, binding.value.event, binding.value.listener, binding.value.options, binding.value.debounceMs)
  log('native-event | event listener added', { domEl, options: binding.value })
}

function removeEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>) {
  const domAny = domEl as any
  const propKey = `${eventPropNamePrefix}${binding.value.event}`
  const nativeEvent = domAny[propKey]
  if (nativeEvent) {
    nativeEvent?.destroy()
    domAny[propKey] = undefined
    log('native-event | event listener removed', { domEl, options: binding.value })
  }
}
