export class NativeEventVueError extends Error {
  parameter?: string
  method?: string

  constructor(message: string, parameter?: string, method?: string) {
    let fullMessage = message

    if (method) {
      fullMessage = `${fullMessage} | method: ${method}`
    }

    if (parameter) {
      fullMessage = `${fullMessage} | parameter: ${parameter}`
    }

    super(message)
    this.name = 'NativeEventVueError'
  }
}
