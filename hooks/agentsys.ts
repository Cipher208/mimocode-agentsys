/**
 * mimocode-agentsys — File hook that routes agentsys slash commands to the agentsys CLI.
 *
 * Since MiMoCode 0.38.9 doesn't support external plugins, this hook intercepts
 * bash commands starting with `/` and rewrites them to call the agentsys CLI.
 *
 * Works like rtk.ts — self-contained, no external imports, line-by-line rewrite.
 */

const AGENTSYS_CLI = "/home/murat/Projects/repos/agentsys/bin/cli.js";
const AGENTSYS_LIB = "/home/murat/Projects/repos/agentsys/lib";

// Map of slash commands to agentsys CLI subcommands
const COMMAND_MAP: Record<string, string> = {
  "/repo-intel": "repo-intel",
  "/drift-detect": "drift-detect",
  "/audit-project": "audit-project",
  "/deslop": "deslop",
  "/agnix": "agnix",
  "/perf": "perf",
  "/enhance": "enhance",
  "/ship": "ship",
  "/banthis": "banthis",
  "/learn": "learn",
  "/consult": "consult",
  "/debate": "debate",
  "/onboard": "onboard",
  "/can-i-help": "can-i-help",
  "/sync-docs": "sync-docs",
  "/release": "release",
  "/skill-curator": "skill-curator",
  "/system-prompt-curator": "system-prompt-curator",
  "/skillers": "skillers",
  "/next-task": "next-task",
  "/prepare-delivery": "prepare-delivery",
  "/gate-and-ship": "gate-and-ship",
};

function rewriteCommand(command: string): string {
  const lines = command.split("\n");
  const rewritten: string[] = [];

  for (const line of lines) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith("#") || !stripped.startsWith("/")) {
      rewritten.push(line);
      continue;
    }

    // Extract command name (first token)
    const parts = stripped.split(/\s+/);
    const cmd = parts[0];

    if (cmd in COMMAND_MAP) {
      const args = parts.slice(1).join(" ");
      const cliCmd = args
        ? `node ${AGENTSYS_CLI} ${COMMAND_MAP[cmd]} ${args}`
        : `node ${AGENTSYS_CLI} ${COMMAND_MAP[cmd]}`;
      rewritten.push(line.replace(stripped, cliCmd, 1));
    } else {
      rewritten.push(line);
    }
  }

  return rewritten.join("\n");
}

export default {
  "tool.execute.before": async (input: any, output: any) => {
    if (input && input.command && typeof input.command === "string") {
      const original = input.command;
      const rewritten = rewriteCommand(original);
      if (rewritten !== original) {
        input.command = rewritten;
      }
    }
    return input;
  },
};
