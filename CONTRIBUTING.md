# Contributing

Thanks for your interest in contributing!

## Development Setup

```bash
# Clone this repo
git clone https://github.com/Cipher208/mimocode-agentsys.git
cd mimocode-agentsys

# Clone agentsys library (dependency)
git clone https://github.com/agent-sh/agentsys.git ~/Projects/repos/agentsys
```

## Adding New Commands

1. Add the command to `COMMAND_MAP` in `hooks/agentsys.ts`
2. Add a handler in `hooks/agentsys-runner.js`
3. Test: `node hooks/agentsys-runner.js <command>`
4. Update README command table

## Hook Development

File hooks in MiMoCode are compiled with Bun.build. They must be:
- **Self-contained** — no external imports (Bun.build can't resolve them)
- **Synchronous** — async functions are supported but keep them simple
- **Defensive** — wrap in try/catch, log to `/tmp/` for debugging

## Testing

```bash
# Test the runner
node hooks/agentsys-runner.js repo-intel status

# Test hook rewrite logic
node -e "
const fs = require('fs');
const code = fs.readFileSync('hooks/agentsys.ts', 'utf8');
// ... test rewrite logic
"
```

## Pull Requests

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a PR with a clear description
