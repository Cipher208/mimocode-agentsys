# mimocode-agentsys

> agentsys slash commands as MiMoCode file hooks — because plugins don't work yet.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## The Problem

MiMoCode 0.38.9 doesn't support external plugins (`plugin: [...]`). The `agentsys` toolkit has 24 powerful slash commands (`/repo-intel`, `/audit-project`, `/drift-detect`, etc.) but they can't be installed.

## The Solution

This fork converts agentsys plugins into **file hooks** — the mechanism that *does* work in MiMoCode. A single TypeScript hook intercepts `/slash` commands and routes them through a Node.js runner that calls the agentsys library directly.

**Key differentiator:** Zero changes to agentsys library code. The hook is a thin adapter that works alongside the existing RTK and Ponytail hooks.

## Quick Start

```bash
# 1. Clone agentsys (the library)
git clone https://github.com/agent-sh/agentsys.git ~/Projects/repos/agentsys

# 2. Clone this adapter
git clone https://github.com/Cipher208/mimocode-agentsys.git ~/.config/mimocode/hooks/agentsys-hooks

# 3. Install the hook
cp ~/.config/mimocode/hooks/agentsys-hooks/hooks/agentsys.ts ~/.config/mimocode/hooks/
cp ~/.config/mimocode/hooks/agentsys-hooks/hooks/agentsys-runner.js ~/.config/mimocode/hooks/

# 4. Restart MiMoCode
mimo
```

## Available Commands

| Command | What it does |
|---------|-------------|
| `/repo-intel` | Unified static analysis — git history, AST symbols, project metadata |
| `/audit-project` | Multi-agent iterative code review |
| `/drift-detect` | Compare plan vs implementation |
| `/deslop` | Clean AI slop patterns (console.logs, old TODOs) |
| `/agnix` | Config linter (423 rules) |
| `/perf` | Performance investigation with baselines |
| `/enhance` | Plugin/agent/prompt analyzers |
| `/ship` | PR creation, CI monitoring, merge |
| `/banthis` | Durable negative memory |
| `/learn` | Research topics, create learning guides |
| `/consult` | Cross-tool AI consultation |
| `/debate` | Structured debate between AI tools |
| `/onboard` | Codebase orientation for newcomers |
| `/can-i-help` | Match contributor skills to project needs |
| `/sync-docs` | Sync documentation with code changes |
| `/release` | Versioned release with ecosystem detection |
| `/skill-curator` | Create and improve reliable SKILL.md files |
| `/system-prompt-curator` | Create and improve system prompts |
| `/skillers` | Workflow pattern learning and automation |
| `/next-task` | Full workflow: discovery → implementation → PR → merge |
| `/prepare-delivery` | Pre-ship quality gates |
| `/gate-and-ship` | Quality gates then ship |

## How It Works

```
User types: /repo-intel
  ↓
MiMoCode bash tool → hook intercepts (tool.execute.before)
  ↓
Hook rewrites: /repo-intel → node agentsys-runner.js repo-intel
  ↓
Runner calls: agentsys/lib/repo-intel/index.js
  ↓
Results returned to agent
```

## Architecture

```
~/.config/mimocode/
├── hooks/
│   ├── rtk.ts              # RTK command rewriting
│   ├── ponytail.ts         # YAGNI enforcement
│   ├── agentsys.ts         # ← THIS: slash command routing
│   └── agentsys-runner.js  # ← THIS: agentsys library wrapper
└── mimocode.json           # MiMoCode config
```

## Requirements

- **Node.js 18+**
- **agentsys** library at `~/Projects/repos/agentsys`
- **MiMoCode** 0.38.9+ (file hooks system)

## License

MIT — see [LICENSE](LICENSE).

## Related

- [agent-sh/agentsys](https://github.com/agent-sh/agentsys) — Original toolkit
- [Cipher208/mimocode-rtk-hook](https://github.com/Cipher208/mimocode-rtk-hook) — RTK hook for MiMoCode
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — YAGNI enforcement
