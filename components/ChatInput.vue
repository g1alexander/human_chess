<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  "send-message": [text: string];
}>();

const inputText = ref("");

const handleSubmit = () => {
  if (!inputText.value.trim()) return;

  emit("send-message", inputText.value);
  inputText.value = "";
};
</script>

<template>
  <form class="flex gap-2 w-full" @submit.prevent="handleSubmit">
    <input
      v-model="inputText"
      type="text"
      placeholder="Escribe tu mensaje aquí..."
      class="flex-1 bg-background border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
    <button
      type="submit"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
      :disabled="!inputText.trim()"
    >
      <Icon name="lucide:send" class="h-4 w-4" />
    </button>
  </form>
</template>
