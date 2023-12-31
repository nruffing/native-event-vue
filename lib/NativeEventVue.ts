import type { App } from 'vue'
import { nativeEventDirective } from './directives/nativeEvent'
import { log } from './logger'

export interface NativeEventVueOptions {
  nativeEventDirectiveName?: string
}

export const defaultOptions = {
  nativeEventDirectiveName: 'native-event',
} as NativeEventVueOptions

export default {
  install: (app: App, options: NativeEventVueOptions = {}) => {
    const opts = Object.assign({ ...defaultOptions }, options)

    app.directive(opts.nativeEventDirectiveName!, nativeEventDirective)
    log('installed', {})
  },
}

export function resolveEnvironmentVariable(varName: string) {
  return import.meta.env['varName'] ?? import.meta.env['VITE_' + varName]
}

export function resolveEventPropNamePrefix(event: string) {
  let prefix = 'native-event-vue-'
  if (resolveEnvironmentVariable('NATIVE_EVENT_VUE_PROP_NAME_PREFIX')) {
    prefix = resolveEnvironmentVariable('NATIVE_EVENT_VUE_PROP_NAME_PREFIX').trim()
  }
  return `${prefix}${event}`
}
