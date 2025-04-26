<script setup lang="ts">
import type { PieceColor } from "vue3-chessboard";

const router = useRouter();

const selectedColor = ref("random");
const difficultyLevel = ref(10);
const chessBoard = useChessBoard();

const colors = [
  { label: "Aleatorio", value: "random" },
  { label: "Blancas", value: "white" },
  { label: "Negras", value: "black" },
];

const onSubmit = () => {
  let color: PieceColor;

  if (selectedColor.value === "random") {
    color = Math.random() < 0.5 ? "white" : "black";
  } else {
    color = selectedColor.value as PieceColor;
  }

  chessBoard.value.configGame = {
    color,
    difficulty: difficultyLevel.value,
  };

  router.push({ name: "Game" });
};
</script>

<template>
  <main
    class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4"
  >
    <h1 class="text-3xl font-bold text-white mb-6 text-center">Human Chess</h1>
    <section
      class="bg-slate-800/50 rounded-lg p-8 w-full max-w-md backdrop-blur-sm"
    >
      <h2 class="text-xl font-bold text-white mb-6 text-center">
        Nueva Partida
      </h2>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <fieldset class="space-y-2">
          <legend class="block text-white mb-2">Elegir color</legend>
          <div class="relative">
            <select
              id="color"
              v-model="selectedColor"
              class="w-full bg-slate-700 text-white rounded-md px-4 py-2 appearance-none cursor-pointer"
            >
              <option
                v-for="color in colors"
                :key="color.value"
                :value="color.value"
              >
                {{ color.label }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </div>
          </div>
        </fieldset>

        <fieldset class="space-y-2">
          <legend class="block text-white">
            Nivel de dificultad: {{ difficultyLevel }}
          </legend>
          <input
            id="difficulty"
            v-model="difficultyLevel"
            type="range"
            min="1"
            max="20"
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </fieldset>

        <button
          type="submit"
          class="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Iniciar partida
        </button>
      </form>
    </section>
  </main>
</template>
