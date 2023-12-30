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
    log('native-event | beforeMount', { domEl, binding: binding.value })
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
    log('native-event | updated', { domEl, binding: binding.value })
  },
  beforeUnmount: (
    domEl: HTMLElement,
    binding: DirectiveBinding<NativeEventOptions>,
    vnode: VNode<any, HTMLElement>,
    prevVnode: VNode<any, HTMLElement> | null,
  ) => {
    removeEventListener(domEl, binding)
    log('native-event | beforeUnmount', { domEl, binding: binding.value })
  },
}

function addEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>, replaceExisting: boolean) {
  if (replaceExisting) {
    removeEventListener(domEl, binding)
  }

  const domAny = domEl as any
  const propKey = `${eventPropNamePrefix}${binding.value.event}`

  if (!replaceExisting && domAny[propKey]) {
    return
  }

  domAny[propKey] = useNativeEvent(domEl, binding.value.event, binding.value.listener, binding.value.options, binding.value.debounceMs)
  log('native-event | event listener added', { domEl, binding: binding.value, replaceExisting })
}

function removeEventListener(domEl: HTMLElement, binding: DirectiveBinding<NativeEventOptions>) {
  const domAny = domEl as any
  const propKey = `${eventPropNamePrefix}${binding.value.event}`
  const nativeEvent = domAny[propKey]
  if (nativeEvent) {
    nativeEvent?.destroy()
    domAny[propKey] = undefined
    log('native-event | event listener removed', { domEl, binding: binding.value })
  }
}
