export interface ApiResponse<T = null> {
  data: T;
  error: string | null;
  status: number;
}

export interface MoveRequest extends EvaluateRequest {
  skillLevel: number;
}

export interface CommentRequest {
  type: string;
  lastMove: string;
  evaluatePosition: number;
  moveNumber: number;
  playerColor: string;
}

export interface EvaluateRequest {
  fen: string;
}
