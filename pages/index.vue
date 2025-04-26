<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

const { boardCreated, checkmate, stalemate, draw, check, promotion, move } =
  useEventsChessBoard();

const chessBoard = useChessBoard();

watch(
  () => chessBoard.value.move,
  async (newValue) => {
    if (chessBoard.value.move?.color === "w") {
      const response = await $fetch("/api/next-move", {
        body: {
          fen: newValue?.after,
        },
        method: "POST",
      });

      if (response.status !== 200) return;
      chessBoard.value.boardCreated?.move(response.data!);
    }
  }
);
</script>

<template>
  <TheChessboard
    @board-created="boardCreated"
    @checkmate="checkmate"
    @stalemate="stalemate"
    @draw="draw"
    @check="check"
    @promotion="promotion"
    @move="move"
  />
</template>
