import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const clientDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const executable = path.join(
  clientDirectory,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "cypress.cmd" : "cypress"
);
const environment = { ...process.env };

// VS Code/Codex may set this variable, which prevents Electron-based Cypress from starting.
delete environment.ELECTRON_RUN_AS_NODE;

const result = spawnSync(executable, process.argv.slice(2), {
  cwd: clientDirectory,
  env: environment,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
