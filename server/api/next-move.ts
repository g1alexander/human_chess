import { spawn } from "child_process";
import type { ApiResponse, MoveRequest } from "~/server/types/api";

export default defineEventHandler<Promise<ApiResponse<string | null>>>(
  async (event) => {
    const body = await readBody<MoveRequest>(event);
    const fen = body.fen;
    const skillLevel = body.skillLevel;

    return new Promise((resolve, reject) => {
      const engine = spawn("stockfish");

      engine.stdin.write("uci\n");
      engine.stdin.write(`setoption name Skill Level value ${skillLevel}\n`);
      engine.stdin.write(`position fen ${fen}\n`);
      engine.stdin.write("go depth 10\n");

      engine.stdout.on("data", (data) => {
        const output = data.toString();
        const match = output.match(/bestmove\s(\S+)/);
        if (match) {
          resolve({
            data: match[1],
            error: null,
            status: 200,
          });
          engine.kill();
        }
      });

      engine.stderr.on("data", (err) => {
        reject({
          data: null,
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
