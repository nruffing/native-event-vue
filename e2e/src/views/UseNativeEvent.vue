<template>
  <main>
    <div class="input-just-directive">
      <input
        id="input"
        ref="input"
      />
      <span id="input-value">{{ inputValue }}</span>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNativeEvent, type NativeEvent } from 'native-event-vue'

const input = ref<HTMLInputElement>()
const inputValue = ref('')
const nativeEvent = ref<NativeEvent>(undefined)

function listener(event: Event) {
  const input = event.target as HTMLInputElement
  inputValue.value = input.value
}

onMounted(() => {
  nativeEvent.value = useNativeEvent(input.value!, 'input', listener, undefined, 300)
})

onBeforeUnmount(() => {
  nativeEvent.value?.destroy()
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

main > div {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>
