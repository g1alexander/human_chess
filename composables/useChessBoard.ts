import type {
  BoardApi,
  MoveEvent,
  PieceColor,
  PromotionEvent,
} from "vue3-chessboard";

interface StateEvents {
  boardCreated: BoardApi | null;
  checkmate: PieceColor | null;
  stalemate: boolean | null;
  draw: boolean | null;
  check: PieceColor | null;
  promotion: PromotionEvent | null;
  move: MoveEvent | null;
}

export const useChessBoard = () =>
  useState<StateEvents>("chessBoard", () => ({
    boardCreated: null,
    checkmate: null,
    stalemate: null,
    draw: null,
    check: null,
    promotion: null,
    move: null,
  }));

export function useEventsChessBoard() {
  const chessBoard = useChessBoard();

  return {
    boardCreated: (boardApi: BoardApi) =>
      (chessBoard.value.boardCreated = boardApi),
    checkmate: (isMated: PieceColor) => (chessBoard.value.checkmate = isMated),
    stalemate: () => (chessBoard.value.stalemate = true),
    draw: () => (chessBoard.value.draw = true),
    check: (isInCheck: PieceColor) => (chessBoard.value.check = isInCheck),
    promotion: (promotion: PromotionEvent) =>
      (chessBoard.value.promotion = promotion),
    move: (move: MoveEvent) => (chessBoard.value.move = move),
  };
}
