export function log(eventName: string, data: any) {
  // TODO: toggle with vite env variable?
  console.groupCollapsed(`%c native-event-vue | ${eventName} | ${new Date().toISOString()}`, 'color: orange; font-weight: bold;')
  console.log(data)
  console.groupEnd()
}
