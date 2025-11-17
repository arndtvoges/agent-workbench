#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkClaudeVersion() {
  try {
    // Check if claude command exists
    const versionOutput = execSync('claude --version', { encoding: 'utf-8' }).trim();

    // Parse version number (expected format: "claude version X.Y.Z" or just "X.Y.Z")
    const versionMatch = versionOutput.match(/(\d+\.\d+\.\d+)/);

    if (!versionMatch) {
      log(`✗ Could not parse Claude version from: ${versionOutput}`, 'red');
      process.exit(1);
    }

    const currentVersion = versionMatch[1];

    // Load minimum required version from config
    const configPath = path.join(__dirname, 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const minVersion = config.minClaudeVersion;

    // Compare versions
    if (!isVersionValid(currentVersion, minVersion)) {
      log(`\n✗ Claude version ${currentVersion} is too old!`, 'red');
      log(`  Minimum required version: ${minVersion}`, 'yellow');
      log(`  Please update Claude CLI: https://code.claude.com/docs/en/install`, 'cyan');
      process.exit(1);
    }

    log(`✓ Claude version ${currentVersion} detected`, 'green');
    return currentVersion;

  } catch (error) {
    if (error.code === 'ENOENT' || error.message.includes('command not found')) {
      log('\n✗ Claude CLI is not installed!', 'red');
      log('  Install from: https://code.claude.com/docs/en/install', 'cyan');
      process.exit(1);
    }
    throw error;
  }
}

function isVersionValid(current, minimum) {
  const currentParts = current.split('.').map(Number);
  const minimumParts = minimum.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] > minimumParts[i]) return true;
    if (currentParts[i] < minimumParts[i]) return false;
  }

  return true; // Versions are equal
}

function backupExistingConfig(targetDir) {
  const agentsDir = path.join(targetDir, '.claude', 'agents');
  const commandsDir = path.join(targetDir, '.claude', 'commands');

  // Check if either directory exists
  const hasAgents = fs.existsSync(agentsDir);
  const hasCommands = fs.existsSync(commandsDir);

  if (!hasAgents && !hasCommands) {
    return null; // No backup needed
  }

  // Create backup with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = path.join(targetDir, `.claude.backup.${timestamp}`);

  fs.mkdirSync(backupDir, { recursive: true });

  if (hasAgents) {
    const backupAgentsDir = path.join(backupDir, 'agents');
    copyDirectory(agentsDir, backupAgentsDir);
  }

  if (hasCommands) {
    const backupCommandsDir = path.join(backupDir, 'commands');
    copyDirectory(commandsDir, backupCommandsDir);
  }

  return backupDir;
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installConfig() {
  const targetDir = process.cwd();
  const sourceDir = path.join(__dirname, '.claude');
  const targetClaudeDir = path.join(targetDir, '.claude');

  // Create target .claude directory if it doesn't exist
  fs.mkdirSync(targetClaudeDir, { recursive: true });

  // Backup existing config if present
  const backupPath = backupExistingConfig(targetDir);

  // Copy agents and commands
  const sourceAgents = path.join(sourceDir, 'agents');
  const sourceCommands = path.join(sourceDir, 'commands');
  const targetAgents = path.join(targetClaudeDir, 'agents');
  const targetCommands = path.join(targetClaudeDir, 'commands');

  copyDirectory(sourceAgents, targetAgents);
  copyDirectory(sourceCommands, targetCommands);

  // Count files
  const agentFiles = fs.readdirSync(targetAgents).length;
  const commandFiles = fs.readdirSync(targetCommands).length;
  const totalFiles = agentFiles + commandFiles;

  return {
    targetDir,
    backupPath,
    agentFiles,
    commandFiles,
    totalFiles
  };
}

function main() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║   Agent Workbench Installer            ║', 'cyan');
  log('╚════════════════════════════════════════╝\n', 'cyan');

  // Step 1: Check Claude version
  log('Checking Claude CLI...', 'blue');
  const version = checkClaudeVersion();

  // Step 2: Install configuration
  log('\nInstalling configuration...', 'blue');
  const result = installConfig();

  // Step 3: Display summary
  log('\n╔════════════════════════════════════════╗', 'green');
  log('║   Installation Complete!               ║', 'green');
  log('╚════════════════════════════════════════╝\n', 'green');

  log(`${colors.bold}Installation Summary:${colors.reset}`);
  log(`  • Location: ${result.targetDir}/.claude/`, 'cyan');
  log(`  • Files installed: ${result.totalFiles} (${result.agentFiles} agents + ${result.commandFiles} commands)`, 'cyan');

  if (result.backupPath) {
    log(`  • Backup created: ${path.basename(result.backupPath)}/`, 'yellow');
  }

  log(`\n${colors.bold}Next Steps:${colors.reset}`);
  log('  1. Run "claude" to start using your new agents', 'cyan');
  log('  2. Try "/create-standards" to set up engineering standards', 'cyan');
  log('  3. Use "/import-spec" to start building features', 'cyan');

  log(`\n${colors.bold}Available Agents:${colors.reset}`);
  log('  • product-spec-writer - Transform ideas into product specs', 'cyan');
  log('  • engineering-architect - Create implementation plans', 'cyan');
  log('  • senior-engineer - Implement features', 'cyan');

  log(`\n${colors.bold}Available Commands:${colors.reset}`);
  log('  • /create-standards - Generate engineering standards', 'cyan');
  log('  • /import-spec - Import and process specifications', 'cyan');
  log('  • /implement-engineering-spec - Execute implementation plans', 'cyan');
  log('  • /fix-bug - Fix bugs and update standards', 'cyan');
  log('  • /review-standards - Review and improve standards', 'cyan');

  log(`\n${colors.bold}To Update:${colors.reset}`);
  log('  Simply rerun: npx github:yourusername/agent-workbench\n', 'cyan');
}

main();
