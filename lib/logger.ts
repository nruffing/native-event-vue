import { nativeEventVueOptions } from './NativeEventVue'

function shouldLog(): boolean {
  return nativeEventVueOptions.debugLog === true || import.meta.env['VITE_DEBUG_NATIVE_EVENT_VUE'] === 'true'
}

export function log(eventName: string, data: any) {
  if (shouldLog()) {
    console.groupCollapsed(`%c native-event-vue | ${eventName} | ${new Date().toISOString()}`, 'color: orange; font-weight: bold;')
    console.log({ eventName, ...data })
    console.groupEnd()
  }
}

export function logError(eventName: string, data: any) {
  if (shouldLog()) {
    console.groupCollapsed(`%c ERROR native-event-vue | ${eventName} | ${new Date().toISOString()}`, 'color: red; font-weight: bold;')
    console.error({ eventName, ...data })
    console.groupEnd()
  }
}
