export function log(eventName: string, data: any) {
  if (
    import.meta.env.NATIVE_EVENT_VUE_DEBUG_LOG?.toLocaleLowerCase() === 'true' ||
    import.meta.env.VITE_NATIVE_EVENT_VUE_DEBUG_LOG?.toLocaleLowerCase() === 'true'
  ) {
    console.groupCollapsed(`%c native-event-vue | ${eventName} | ${new Date().toISOString()}`, 'color: orange; font-weight: bold;')
    console.log(data)
    console.groupEnd()
  }
}
