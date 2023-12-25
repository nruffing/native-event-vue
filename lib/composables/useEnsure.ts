import { NativeEventVueError } from '../NativeEventVueError'
import { log } from '../logger'

export function useEnsure(methodName: string) {
  function ensureExists(value: any, parameterName: string) {
    if (!value) {
      const message = 'Expected a value'
      log(message, { value, parameterName, methodName })
      throw new NativeEventVueError(message, parameterName, methodName)
    }
  }

  function ensureNotNegative(number: number | null | undefined, parameterName: string) {
    ensureExists(number, parameterName)
    if (number! < 0) {
      const message = 'Expected a positive number'
      log(message, { number, parameterName, methodName })
      throw new NativeEventVueError(message, parameterName, methodName)
    }
  }

  return {
    ensureExists,
    ensureNotNegative,
  }
}
