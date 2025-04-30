<script setup lang="ts">
defineProps<{
  message: string;
  isBot: boolean;
  timestamp: Date;
}>();

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
</script>

<template>
  <article
    class="flex items-start gap-3 p-4 rounded-lg max-w-[80%]"
    :class="[
      isBot
        ? 'bg-chess-bot/10 text-chess-bot self-start'
        : 'bg-chess-user/10 text-chess-user self-end',
    ]"
  >
    <!-- Avatar -->
    <figure class="shrink-0 mt-1">
      <div
        :class="[
          'p-2 rounded-full',
          isBot ? 'bg-chess-bot/20' : 'bg-chess-user/20',
        ]"
      >
        <Icon
          :name="isBot ? 'lucide:bot' : 'lucide:user'"
          class="h-5 w-5"
          :class="isBot ? 'text-chess-bot' : 'text-chess-user'"
        />
      </div>
    </figure>

    <!-- Contenido del mensaje -->
    <section class="flex flex-col">
      <header class="text-sm font-medium">
        {{ isBot ? "AjedrezBot" : "Tú" }}
      </header>
      <p class="mt-1 text-sm text-foreground">{{ message }}</p>
      <p class="mt-1 text-xs text-muted-foreground" :datetime="timestamp">
        {{ formatTime(timestamp) }}
      </p>
    </section>
  </article>
</template>
