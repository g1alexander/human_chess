import { spawn } from "child_process";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const fen = body.fen;

  return new Promise((resolve, reject) => {
    const engine = spawn("stockfish");

    engine.stdin.write("uci\n");
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write("go depth 10\n");

    engine.stdout.on("data", (data) => {
      const output = data.toString();
      const match = output.match(/bestmove\s(\S+)/);
      if (match) {
        resolve({ move: match[1] });
        engine.kill(); // cerrar el proceso una vez obtienes la jugada
      }
    });

    engine.stderr.on("data", (err) => {
      console.error("Error en Stockfish:", err.toString());
      reject(err.toString());
    });

    engine.on("close", (code) => {
      if (code !== 0) {
        reject(`Stockfish salió con código ${code}`);
      }
    });
  });
});
