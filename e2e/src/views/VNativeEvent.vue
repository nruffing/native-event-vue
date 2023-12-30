<template>
  <main>
    <input
      id="input"
      v-native-event="{ event: 'input', listener }"
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
