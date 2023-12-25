import { log } from './logger'

import { useDebounce, type FunctionToDebounce, type DebouncedFunction } from './composables/useDebounce'
import { useNativeEvent } from './composables/useNativeEvent'
import { useEnsure } from './composables/useEnsure'

import { nativeEvent, type NativeEventOptions } from './directives/nativeEvent'

import NativeEventVue, { type NativeEventVueOptions } from './NativeEventVue'

export {
  log,
  useDebounce,
  type FunctionToDebounce,
  type DebouncedFunction,
  useNativeEvent,
  useEnsure,
  nativeEvent,
  type NativeEventOptions,
  NativeEventVue,
  type NativeEventVueOptions,
}
