<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

const { boardCreated, checkmate, stalemate, draw, check, promotion, move } =
  useEventsChessBoard();

const chessBoard = useChessBoard();

const nextMove = async (fen: string): Promise<string> => {
  const response = await $fetch("/api/next-move", {
    body: {
      fen,
      skillLevel: chessBoard.value.configGame.difficulty,
    },
    method: "POST",
  });
  if (response.status !== 200) return "";
  chessBoard.value.boardCreated?.move(response.data!);

  return response.data!;
};

onMounted(async () => {
  if (chessBoard.value.configGame.color === "black") {
    chessBoard.value.boardCreated?.setConfig({
      orientation: "black",
    });
    const move = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    await nextMove(move);
  }
});

watch(
  () => chessBoard.value.move,
  async (newValue) => {
    if (
      chessBoard.value.move?.color === "b" &&
      chessBoard.value.configGame.color === "black"
    ) {
      await nextMove(newValue?.after || "");
    }
    if (
      chessBoard.value.move?.color === "w" &&
      chessBoard.value.configGame.color === "white"
    ) {
      const bestMove = await nextMove(newValue?.after || "");

      const { data, error, status } = await $fetch("/api/evaluate-fen", {
        body: {
          fen: newValue?.after,
        },
        method: "POST",
      });

      if (status !== 200) return;

      const type = chessBoard.value.checkmate
        ? "checkmate"
        : chessBoard.value.check
        ? "check"
        : newValue?.flags === "c"
        ? "capture"
        : "move";

      const response = await $fetch("/api/generate-comment", {
        body: {
          type,
          fen: newValue?.after,
          lastMove: bestMove,
          evaluatePosition: data,
          moveNumber: chessBoard.value.boardCreated?.getHistory().length,
          playerColor: newValue?.color,
        },
        method: "POST",
      });

      console.log("response", response);
    }
  }
);

watch(
  () => chessBoard.value.checkmate,
  (newValue) => {
    console.log("checkmate", newValue);
  }
);

watch(
  () => chessBoard.value.stalemate,
  (newValue) => {
    console.log("stalemate", newValue);
  }
);
watch(
  () => chessBoard.value.draw,
  (newValue) => {
    console.log("draw", newValue);
  }
);
watch(
  () => chessBoard.value.check,
  (newValue) => {
    console.log("check", newValue);
  }
);
watch(
  () => chessBoard.value.promotion,
  (newValue) => {
    console.log("promotion", newValue);
  }
);

//TODO: generar alertas de checkmate, stalemate y draw
//TODO: reiniciar el juego
//TODO: chat + LLM
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <TheChessboard
      class="w-[50vh]"
      @board-created="boardCreated"
      @checkmate="checkmate"
      @stalemate="stalemate"
      @draw="draw"
      @check="check"
      @promotion="promotion"
      @move="move"
    />

    <ChatContainer class="w-[50vh]" />
  </div>
</template>
