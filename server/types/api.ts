export interface ApiResponse<T = null> {
  data: T;
  error: string | null;
  status: number;
}

export interface MoveRequest {
  fen: string;
  skillLevel: number;
}
