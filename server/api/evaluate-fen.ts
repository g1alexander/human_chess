import { spawn } from "child_process";
import type { ApiResponse, EvaluateRequest } from "~/server/types/api";

export default defineEventHandler<Promise<ApiResponse<number | null>>>(
  async (event) => {
    const body = await readBody<EvaluateRequest>(event);
    const fen = body.fen;

    return new Promise((resolve, reject) => {
      const engine = spawn("stockfish");

      engine.stdin.write("uci\n");
      engine.stdin.write(`position fen ${fen}\n`);
      engine.stdin.write("eval\n");

      let output = "";

      engine.stdout.on("data", (data) => {
        output += data.toString();
        const match = output.match(
          /Final evaluation\s+([+-]?[0-9.]+) \((white|black)/
        );
        if (match) {
          const evalValue = parseFloat(match[1]);
          const side = match[2]; // "white" o "black"
          const sign = side === "white" ? 1 : -1;
          const finalScore = evalValue * sign;

          resolve({
            data: finalScore,
            error: null,
            status: 200,
          });
          engine.kill();
        }
      });

      engine.stderr.on("data", (err) => {
        reject({
          data: output,
          error: err.toString(),
          status: 400,
        });
      });

      engine.on("close", (code) => {
        if (code !== 0) {
          reject({
            data: null,
            error: `Engine exited with code ${code}`,
            status: 400,
          });
        }
      });
    });
  }
);
