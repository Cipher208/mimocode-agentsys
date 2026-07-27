#!/usr/bin/env node
/**
 * mimocode-agentsys-runner — CLI wrapper for agentsys library functions.
 *
 * Usage: node agentsys-runner.js <command> [args...]
 *
 * This wrapper allows file hooks to invoke agentsys functionality
 * without needing the full OpenCode/Claude Code command infrastructure.
 */

const path = require('path');
const AGENTSYS_LIB = '/home/murat/Projects/repos/agentsys/lib';

const commands = {
  'repo-intel': () => {
    const repoIntel = require(path.join(AGENTSYS_LIB, 'repo-intel'));
    const args = process.argv.slice(3);
    const action = args[0] || 'status';
    const target = args[1] || process.cwd();

    if (action === 'init' || action === 'update') {
      repoIntel.init(target);
      console.log(`repo-intel ${action} completed for ${target}`);
    } else if (action === 'status') {
      const exists = repoIntel.exists(target);
      console.log(`repo-intel: ${exists ? 'initialized' : 'not initialized'} for ${target}`);
    } else if (action === 'queries') {
      const data = repoIntel.load(target);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(`repo-intel actions: init, update, status, queries`);
    }
  },

  'drift-detect': () => {
    console.log('drift-detect: Comparing plan vs implementation...');
    console.log('Use /drift-detect in MiMoCode for full multi-agent analysis.');
  },

  'audit-project': () => {
    console.log('audit-project: Multi-agent code review...');
    console.log('Use /audit-project in MiMoCode for full multi-agent review.');
  },

  'deslop': () => {
    const slopPatterns = require(path.join(AGENTSYS_LIB, 'patterns', 'slop-patterns'));
    const args = process.argv.slice(3);
    const target = args[0] || process.cwd();
    console.log(`deslop: scanning ${target} for AI slop patterns...`);
    console.log(`Patterns available: ${Object.keys(slopPatterns).length}`);
  },

  'agnix': () => {
    console.log('agnix: Config linting (423 rules)');
    console.log('Use /agnix in MiMoCode for full config validation.');
  },

  'perf': () => {
    console.log('perf: Performance investigation');
    console.log('Use /perf in MiMoCode for profiling and baselines.');
  },

  'enhance': () => {
    console.log('enhance: Plugin/agent/prompt analyzers');
    console.log('Use /enhance in MiMoCode for full enhancement.');
  },
};

const cmd = process.argv[2];
if (!cmd || !commands[cmd]) {
  console.log('Available commands: ' + Object.keys(commands).join(', '));
  process.exit(1);
}

try {
  commands[cmd]();
} catch (e) {
  console.error(`Error running ${cmd}:`, e.message);
  process.exit(1);
}
