import type { App } from 'vue'
import { nativeEvent } from './directives/nativeEvent'
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

    app.directive(opts.nativeEventDirectiveName!, nativeEvent)
    log('installed', { options: opts })
  },
}
