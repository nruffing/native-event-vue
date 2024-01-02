import type { App } from 'vue'
import { nativeEventDirective } from './directives/nativeEvent'
import { log } from './logger'

export interface NativeEventVueOptions {
  nativeEventDirectiveName?: string
  debugLog?: boolean
  propNamePrefix?: string
}

export const nativeEventVueOptions = {
  nativeEventDirectiveName: 'native-event',
  debugLog: false,
  propNamePrefix: 'native-event-vue-',
} as NativeEventVueOptions

export default {
  install: (app: App, opts: NativeEventVueOptions = {}) => {
    Object.assign(nativeEventVueOptions, opts)

    app.directive(nativeEventVueOptions.nativeEventDirectiveName!, nativeEventDirective)
    log('installed', {})
  },
}

export function resolveEventPropNamePrefix(event: string) {
  return `${nativeEventVueOptions.propNamePrefix}${event}`
}
