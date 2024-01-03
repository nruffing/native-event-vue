# native-event-vue

Directives and composables for wiring up and debouncing native HTML events in Vue.

<p align="center">
  <a href="https://github.com/nruffing/native-event-vue/actions/workflows/ci_cd.yml">
    <img src="https://github.com/nruffing/native-event-vue/actions/workflows/ci_cd.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/native-event-vue" target="_blank" aria-label="npm">
    <img alt="npm" src="https://img.shields.io/npm/v/native-event-vue?logo=npm" />
  </a>
  <a href="https://github.com/nruffing/native-event-vue/blob/main/LICENSE" aria-label="MIT License">
    <img alt="GitHub" src="https://img.shields.io/github/license/nruffing/native-event-vue" />
  </a>
</p>

## Install

```
npm i native-event-vue
```

## Setup

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NativeEventVue } from 'dragon-drop-vue'

createApp(App).use(NativeEventVue)
```

### Plugin Options (i.e. NativeEventVueOptions)

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { NativeEventVue, type NativeEventVueOptions } from 'dragon-drop-vue'

const options = {
  debugLog: true,
} as NativeEventVueOptions

createApp(App).use(NativeEventVue, options)
```

| Property | Type | Description |
| --- | --- | --- |
| `debugLog` | `boolean` or `undefined` | Print additional debugging information to the console. |
| `nativeEventDirectiveName` | `string` or `undefined` | Optionally specify what to register for the native-event directive. By default this is `native-event` and the directive would be `v-native-event`. |
| `propNamePrefix` | `string` or `undefined` | When an event is attached using this library a reference to the the libraries event instance is stored on the attached element using a property prefixed with this value and ending in the event name. This defaults to `native-event-vue-`. |

## Usage

Native HTML events can be attached and debounced using either the `v-native-event` directive or the `useNativeEvent` composable depending on your situation.

When using the directive the event and debounce timeouts are automatically destroyed in the directive's `beforeUnmount` hook. When using the composable the destroy function needs to be called explicitly.

### Directive

The following example demonstrates how to use the `v-native-event` directive to wire-up a native html event. In this example the input event is used to show a simple and easy to follow example but you likely would not need this package for the input event unless you wanted to debounce it. If you can use the built-in native event handling of Vue or `v-model` that is the recommended approach.

```vue
<template>
  <main>
    <input
      id="input"
      v-native-event="{ event: 'input', listener, debounceMs: 300 }"
    />
    <span id="input-value">{{ inputValue }}</span>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const inputValue = ref('')

function listener(event: Event) {
  const input = event.target as HTMLInputElement
  inputValue.value = input.value
}
</script>
```

#### Directive Options (i.e. NativeEventOptions)

| Property | Type | Description |
| --- | --- | --- |
| `event` | `string` | The name of the native event (e.g. `resize`). |
| `listener` | `EventListenerOrEventListenerObject` | The event handler function to attach. This is the same type as the browser API [`addEventListener.listener` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback). |
| `options` | `boolean`, `AddEventListenerOptions` or `undefined` | Optional. This is the same type as the browser API [`addEventListener.options` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |
| `debounceMs` | `number` or `undefined` | Optionally specify a debounce timeout. |
| `disabled` | `boolean` or `undefined` | Optionally disable/remove the event handler. |

### Composable

```vue
<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNativeEvent, type NativeEvent } from 'native-event-vue'

const nativeEvent = ref<NativeEvent>(undefined)

function onWindowResize(event: Event) { ... }

onMounted(() => {
  nativeEvent.value = useNativeEvent(window, 'resize', onWindowResize, undefined, 300)
})

onBeforeUnmount(() => {
  nativeEvent.value?.destroy()
})
</script>
```

#### Composable Parameters

| Property | Type | Description |
| --- | --- | --- |
| `domEl` | `HTMLElement` | The DOM element to attach the event listener to. |
| `event` | `string` | The name of the native event (e.g. `resize`). |
| `listener` | `EventListenerOrEventListenerObject` | The event handler function to attach. This is the same type as the browser API [`addEventListener.listener` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback). |
| `options` | `boolean`, `AddEventListenerOptions` or `undefined` | Optional. This is the same type as the browser API [`addEventListener.options` parameter](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options). |
| `debounceMs` | `number` or `undefined` | Optionally specify a debounce timeout. |
| `replaceExisting` | `boolean` or `undefined` | Optionally specify to replace any existing event handler that was attached using `native-event-vue`. Otherwise the new event listener will not be attached. |

## Release Notes

### v1.0.0
  * Initial release
