import OpenAI from "openai";

import type { ApiResponse, CommentRequest } from "~/server/types/api";

export default defineEventHandler<Promise<ApiResponse<string | null>>>(
  async (event) => {
    try {
      const body = await readBody<CommentRequest>(event);
      const lastMove = body.lastMove;
      const moveNumber = body.moveNumber;
      const evaluatePosition = body.evaluatePosition;
      const playerColor = body.playerColor;
      const type = body.type;

      const colorText = playerColor === "w" ? "blancas" : "negras";
      const typeDescriptions: Record<string, string> = {
        move: "movimiento normal",
        capture: "captura",
        check: "jaque",
        checkmate: "jaque mate",
      };

      const eval1 = evaluatePosition;
      let evalDescription = "en una posición igualada";
      if (eval1 >= 0.3 && eval1 < 1.0)
        evalDescription = "con una ligera ventaja";
      else if (eval1 >= 1.0) evalDescription = "con una clara ventaja";
      else if (eval1 <= -0.3 && eval1 > -1.0)
        evalDescription = "en ligera desventaja";
      else if (eval1 <= -1.0) evalDescription = "en clara desventaja";

      const tone =
        eval1 >= 1.0
          ? "confiado y desafiante"
          : eval1 <= -1.0
          ? "irónico o provocador pero tenso"
          : "neutral, pero con personalidad";

      const prompt = `
        Estoy jugando una partida de ajedrez como ${colorText}.
        Acabo de hacer la jugada ${lastMove}, que fue un ${
        typeDescriptions[type]
      }.
        Estamos en el movimiento número ${moveNumber}.

        La evaluación de la posición es de ${eval1.toFixed(
          2
        )}, lo que indica que estoy ${evalDescription}.

        Escribe una frase breve que diga el bot tras esta jugada, en tono ${tone}, como si tuviera personalidad.
        No expliques la evaluación ni des contexto adicional. Solo responde la frase.
        `.trim();

      const client = new OpenAI();

      const response = await client.responses.create({
        model: "gpt-4.1-nano-2025-04-14",
        input: prompt,
      });

      return {
        data: response.output_text,
        error: null,
        status: 200,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : String(error),
        status: 500,
      };
    }
  }
);
