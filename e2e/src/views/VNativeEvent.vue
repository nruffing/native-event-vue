<template>
  <main>
    <div class="input-just-directive">
      <input
        id="input"
        v-native-event="{ event: 'input', listener }"
      />
      <span id="input-value">{{ inputValue }}</span>
    </div>

    <div class="input-with-composable">
      <input
        id="input-with-composable"
        ref="inputWithComposable"
        v-native-event="{ event: 'input', listener: inputWithComposableListener }"
      />
      <span id="input-with-composable-value">{{ inputWithComposableValue }}</span>
    </div>

    <div class="input-replace-existing">
      <input
        id="input-replace-existing"
        ref="inputReplaceExisting"
        v-native-event="{ event: 'input', listener: inputReplaceExistingListener, replaceExisting: true }"
      />
      <span id="input-replace-existing-value">{{ inputReplaceExistingValue }}</span>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useNativeEvent } from '../../../lib/main'

const inputValue = ref('')
function listener(event: Event) {
  const input = event.target as HTMLInputElement
  inputValue.value = input.value
}

const inputWithComposable = ref<HTMLInputElement>()
const inputWithComposableValue = ref('')
function inputWithComposableListener(event: Event) {
  const input = event.target as HTMLInputElement
  inputWithComposableValue.value = input.value
}

const inputReplaceExisting = ref<HTMLInputElement>()
const inputReplaceExistingValue = ref('')
function inputReplaceExistingListener(event: Event) {
  const input = event.target as HTMLInputElement
  inputReplaceExistingValue.value = input.value
}

onMounted(() => {
  const added = useNativeEvent(inputWithComposable.value!, 'input', inputWithComposableListener)
  console.log(`input-with-composable ${added ? 'added' : 'DID NOT add'} event listener`)

  const replaced = useNativeEvent(inputReplaceExisting.value!, 'input', inputReplaceExistingListener, true)
  console.log(`input-replace-existing ${replaced ? 'added' : 'DID NOT add'} event listener`)
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
