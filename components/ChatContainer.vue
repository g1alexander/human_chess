<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import type { Ref } from "vue";

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses = [
  "¡Bienvenido al chat de ajedrez! Estoy aquí para ayudarte con tus preguntas sobre ajedrez.",
  "El jaque mate más rápido posible se llama 'mate del pastor' y puede ocurrir en solo 4 movimientos.",
  "¿Sabías que hay más posibles posiciones de ajedrez que átomos en el universo observable?",
  "Te recomiendo practicar aperturas como la Española o la Siciliana para mejorar tu juego.",
  "El final de rey y dama contra rey es uno de los mates básicos que todo ajedrecista debe conocer.",
  "¡Buena pregunta! El movimiento especial 'en passant' permite a un peón capturar a otro peón que ha avanzado dos casillas.",
  "La estrategia es importante en ajedrez. Controla el centro, desarrolla tus piezas y protege a tu rey.",
];

const messages: Ref<Message[]> = ref([
  {
    id: 1,
    text: "¡Hola! Soy AjedrezBot. ¿En qué puedo ayudarte hoy?",
    isBot: true,
    timestamp: new Date(),
  },
]);

const isTyping = ref(false);
const scrollAreaRef = ref<HTMLDivElement>();

watch(
  messages,
  () => {
    nextTick(() => {
      if (scrollAreaRef.value) {
        scrollAreaRef.value.scrollTop = scrollAreaRef.value.scrollHeight;
      }
    });
  },
  { deep: true }
);

const handleSendMessage = (text: string) => {
  const userMessage: Message = {
    id: messages.value.length + 1,
    text,
    isBot: false,
    timestamp: new Date(),
  };

  messages.value.push(userMessage);
  isTyping.value = true;

  // Simular respuesta del bot después de un breve retraso
  setTimeout(() => {
    const randomResponse =
      botResponses[Math.floor(Math.random() * botResponses.length)];

    const botMessage: Message = {
      id: messages.value.length + 1,
      text: randomResponse,
      isBot: true,
      timestamp: new Date(),
    };

    messages.value.push(botMessage);
    isTyping.value = false;
  }, 1500);
};
</script>

<template>
  <main class="flex flex-col h-full">
    <!-- Encabezado del chat -->
    <header class="bg-background p-4 border-b">
      <h2 class="text-xl font-bold flex items-center gap-2">
        <Icon name="lucide:bot" class="h-5 w-5" />
        Chat de Ajedrez
      </h2>
    </header>

    <!-- Área de mensajes -->
    <section ref="scrollAreaRef" class="flex-1 p-4 overflow-y-auto">
      <ul class="flex flex-col gap-4">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message.text"
          :is-bot="message.isBot"
          :timestamp="message.timestamp"
        />

        <!-- Indicador de que el bot está escribiendo -->
        <li
          v-if="isTyping"
          class="flex items-start gap-3 p-4 rounded-lg bg-chess-bot/10 text-chess-bot self-start max-w-[80%]"
        >
          <div class="shrink-0 mt-1">
            <div class="bg-chess-bot/20 p-2 rounded-full">
              <Icon name="lucide:bot" class="h-5 w-5 text-chess-bot" />
            </div>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-chess-bot rounded-full animate-pulse" />
            <span
              class="w-2 h-2 bg-chess-bot rounded-full animate-pulse delay-150"
            />
            <span
              class="w-2 h-2 bg-chess-bot rounded-full animate-pulse delay-300"
            />
          </div>
        </li>
      </ul>
    </section>

    <!-- Entrada de mensaje -->
    <footer class="p-4 border-t">
      <ChatInput @send-message="handleSendMessage" />
    </footer>
  </main>
</template>
