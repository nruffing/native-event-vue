import type { App } from 'vue'
import { nativeEventDirective } from './directives/nativeEvent'
import { log } from './logger'

export enum DebugLogLevel {
  /**
   * Only errors are logged.
   */
  Error = 0,
  /**
   * Additional debugging information is logged when events are attached and detached.
   */
  Info = 1,
  /**
   * All additional debugging information is logged including when directive hooks fire and is certain situations in the debouncing logic.
   */
  Verbose = 2,
}

export interface NativeEventVueOptions {
  /**
   * Print additional debugging information to the console. By default a log level of `Error` is used.
   */
  debugLogLevel?: DebugLogLevel
  /**
   * Optionally specify what to register for the native-event directive. By default this is `native-event` and the directive would be `v-native-event`.
   */
  nativeEventDirectiveName?: string
  /**
   * When an event is attached using this library a reference to the the libraries event instance is stored on the attached element using a property
   * prefixed with this value and ending in the event name. This defaults to `native-event-vue-`.
   */
  propNamePrefix?: string
}

export const nativeEventVueOptions = {
  nativeEventDirectiveName: 'native-event',
  debugLogLevel: DebugLogLevel.Error,
  propNamePrefix: 'native-event-vue-',
} as NativeEventVueOptions

export default {
  install: (app: App, opts: NativeEventVueOptions = {}) => {
    Object.assign(nativeEventVueOptions, opts)

    app.directive(nativeEventVueOptions.nativeEventDirectiveName!, nativeEventDirective)
    log('installed', {})
  },
}

/**
 * Resolves the property name used to store the event instance on the element
 * based on the configured prefix and the event name.
 * @param event The event name.
 * @returns The resolved property name.
 * @see {@link NativeEventVueOptions.propNamePrefix}
 */
export function resolveEventPropNamePrefix(event: string) {
  return `${nativeEventVueOptions.propNamePrefix}${event}`
}
