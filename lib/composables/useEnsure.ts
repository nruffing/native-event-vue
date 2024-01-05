import { NativeEventVueError } from '../NativeEventVueError'
import { logError } from '../logger'

export function useEnsure(methodName: string) {
  function ensureExists(value: any, parameterName: string) {
    if (!value) {
      const message = 'Expected a value'
      logError(message, { value, parameterName, methodName })
      throw new NativeEventVueError(message, parameterName, methodName)
    }
  }

  function ensureNotNegative(number: number | null | undefined, parameterName: string) {
    ensureExists(number, parameterName)
    if (number! < 0) {
      const message = `Expected a positive number, received ${number}`
      logError(message, { number, parameterName, methodName })
      throw new NativeEventVueError(message, parameterName, methodName)
    }
  }

  function ensureValidEnumValue(value: any, enumType: any, parameterName: string) {
    ensureExists(value, parameterName)
    const values = Object.values(enumType)
    if (!values.includes(value)) {
      const message = `Expected a value from ${JSON.stringify(values)}, received "${value}"`
      logError(message, { value, parameterName, methodName })
      throw new NativeEventVueError(message, parameterName, methodName)
    }
  }

  return {
    ensureExists,
    ensureNotNegative,
    ensureValidEnumValue,
  }
}
