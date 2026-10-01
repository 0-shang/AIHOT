import { spawn } from "node:child_process";

const children = [
  { name: "API", cmd: "npm", args: ["run", "dev:api"], color: "\x1b[36m" },
  { name: "WEB", cmd: "npm", args: ["run", "dev:web"], color: "\x1b[32m" },
];

const processes = children.map(({ name, cmd, args, color }) => {
  const p = spawn(cmd, args, {
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    env: process.env,
  });

  const prefix = `${color}[${name}]\x1b[0m `;

  p.stdout?.on("data", (data) => {
    process.stdout.write(prefix + data.toString().split("\n").join("\n" + prefix));
  });

  p.stderr?.on("data", (data) => {
    process.stderr.write(prefix + data.toString().split("\n").join("\n" + prefix));
  });

  return p;
});

function cleanup() {
  for (const p of processes) {
    p.kill();
  }
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
