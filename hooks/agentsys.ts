/**
 * mimocode-agentsys — File hook that routes agentsys slash commands to the agentsys runner.
 *
 * Since MiMoCode 0.38.9 doesn't support external plugins, this hook intercepts
 * bash commands starting with `/` and rewrites them to call the agentsys runner.
 *
 * Pattern matches rtk.ts: reads from output.args.command, writes to output.args.command.
 */

const AGENTSYS_RUNNER = "/home/murat/.config/mimocode/hooks/agentsys-runner.js"

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
}

function rewriteCommand(command: string): string | null {
    const lines = command.split("\n")
    const rewritten: string[] = []

    for (const line of lines) {
        const stripped = line.trim()
        if (!stripped || stripped.startsWith("#") || !stripped.startsWith("/")) {
            rewritten.push(line)
            continue
        }

        const parts = stripped.split(/\s+/)
        const cmd = parts[0]

        if (cmd in COMMAND_MAP) {
            const args = parts.slice(1).join(" ")
            const runnerCmd = args
                ? `node ${AGENTSYS_RUNNER} ${COMMAND_MAP[cmd]} ${args}`
                : `node ${AGENTSYS_RUNNER} ${COMMAND_MAP[cmd]}`
            rewritten.push(line.replace(stripped, runnerCmd, 1))
        } else {
            rewritten.push(line)
        }
    }

    return rewritten.join("\n")
}

export default {
    "tool.execute.before": async (input: { tool: string }, output: { args: any }) => {
        const tool = input.tool?.toLowerCase()
        if (tool !== "bash" && tool !== "shell") return
        const args = output.args
        if (!args || typeof args !== "object") return
        const command = args.command
        if (typeof command !== "string" || !command) return
        const rewritten = rewriteCommand(command)
        if (rewritten !== command) {
            args.command = rewritten
        }
    },
}
