<script setup lang="ts">
import {
  TheChessboard,
  type BoardApi,
  type MoveEvent,
  type PieceColor,
  type PromotionEvent,
} from "vue3-chessboard";
import "vue3-chessboard/style.css";

const information = ref({
  boardCreated: undefined as BoardApi | undefined,
  checkmate: undefined as PieceColor | undefined,
  stalemate: undefined as boolean | undefined,
  draw: undefined as boolean | undefined,
  check: undefined as PieceColor | undefined,
  promotion: undefined as PromotionEvent | undefined,
  move: undefined as MoveEvent | undefined,
});

const boardCreated = (boardApi: BoardApi) => {
  information.value.boardCreated = boardApi;
  console.log("boardCreated", boardApi);
};

const checkmate = (isMated: PieceColor) => {
  information.value.checkmate = isMated;
  console.log("checkmate", isMated);
};
const stalemate = () => {
  information.value.stalemate = true;
  console.log("stalemate");
};
const draw = () => {
  information.value.draw = true;
  console.log("draw");
};
const check = (isInCheck: PieceColor) => {
  information.value.check = isInCheck;
  console.log("check", isInCheck);
};
const promotion = (promotion: PromotionEvent) => {
  information.value.promotion = promotion;
  console.log("promotion", promotion);
};
const move = (move: MoveEvent) => {
  information.value.move = move;
  console.log("move", move);
};

watch(
  () => information.value.move,
  async (newValue) => {
    console.log("move", newValue);

    const { data } = await $fetch("/api/next-move", {
      body: {
        fen: newValue?.after,
      },
      method: "POST",
    });

    console.log("data", data);
  }
);
</script>

<template>
  <div>
    <!-- <div>{{ information }}</div> -->
    <TheChessboard
      @board-created="boardCreated"
      @checkmate="checkmate"
      @stalemate="stalemate"
      @draw="draw"
      @check="check"
      @promotion="promotion"
      @move="move"
    />
  </div>
</template>
