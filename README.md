# Agent Workbench

A powerful collection of Claude Code agents and commands for streamlined software development workflows.

## What's Included

### Agents
- **product-spec-writer** - Transform high-level feature ideas into comprehensive product specifications
- **engineering-architect** - Convert product specs into detailed engineering implementation plans
- **senior-engineer** - Implement features based on architectural specifications

### Commands
- **/create-standards** - Generate engineering standards from your existing codebase
- **/import-spec** - Import and process product specifications through the full workflow
- **/implement-engineering-spec** - Execute implementation plans with orchestrated agent collaboration
- **/fix-bug** - Fix bugs and update standards to prevent similar issues
- **/review-standards** - Review and improve existing engineering standards

## Installation

### Requirements
- Claude CLI version 2.0.42 or higher ([Install Claude](https://code.claude.com/docs/en/install))
- Node.js (for npx)

### One-Line Install

```bash
npx github:yourusername/agent-workbench
```

Replace `yourusername` with your GitHub username.

The installer will:
1. ✓ Check your Claude CLI version
2. ✓ Backup any existing `.claude/` configuration (if present)
3. ✓ Install 3 agents and 5 commands to your current directory
4. ✓ Display installation summary

### What Gets Installed

The installer copies the following to `./.claude/` in your current directory:

```
.claude/
├── agents/
│   ├── product-spec-writer.md
│   ├── engineering-architect.md
│   └── senior-engineer.md
└── commands/
    ├── create-standards.md
    ├── import-spec.md
    ├── implement-engineering-spec.md
    ├── fix-bug.md
    └── review-standards.md
```

## Getting Started

### 1. Create Engineering Standards

First, establish your project's engineering standards:

```bash
claude
/create-standards
```

This creates a `./standards/` directory with guidelines for your AI agents.

### 2. Build a Feature

Use the import-spec command to transform a product idea into working code:

```bash
claude
/import-spec path/to/your/feature-idea.md
```

This workflow:
1. Generates a product specification (product-spec-writer agent)
2. Creates an engineering implementation plan (engineering-architect agent)
3. Implements the feature (senior-engineer agents)

### 3. Fix Bugs with Context

When bugs arise, use the fix-bug command:

```bash
claude
/fix-bug "describe the bug"
```

The agent will not only fix the bug but also suggest updates to your standards to prevent similar issues.

## Workflow Overview

```
Product Idea
    ↓
/import-spec
    ↓
Product Spec (product-spec-writer)
    ↓
Engineering Plan (engineering-architect)
    ↓
Implementation (senior-engineer)
    ↓
Working Feature
```

## Updating

To get the latest version of agents and commands, simply rerun the install command:

```bash
npx github:yourusername/agent-workbench
```

Your existing configuration will be backed up automatically before updating.

## Configuration

### Minimum Claude Version

The minimum required Claude version is specified in `config.json`:

```json
{
  "minClaudeVersion": "2.0.42"
}
```

Update this value if you require newer Claude features.

### Project Structure

Agent Workbench expects/creates the following structure in your project:

```
your-project/
├── .claude/              # Installed by agent-workbench
│   ├── agents/
│   └── commands/
├── standards/            # Created by /create-standards
│   ├── global/
│   ├── backend/
│   ├── frontend/
│   └── business/
└── documentation/        # Created by agents
    └── YYMMDD-feature-name/
        ├── agent-written-product-spec.md
        ├── agent-written-implementation-spec.md
        └── implementation-summary.md
```

## How It Works

### The npx Trick

This installer uses `npx github:username/repo` to run directly from GitHub without publishing to npm:

1. npx downloads the repo
2. Runs the `install.js` script
3. Copies configuration to your project
4. Cleans up

### Backup Strategy

Before overwriting any existing configuration, the installer creates a timestamped backup:

```
.claude.backup.2025-11-17T09-30-00/
├── agents/
└── commands/
```

## Troubleshooting

### "Claude CLI is not installed"

Install Claude CLI from: https://code.claude.com/docs/en/install

### "Claude version X.Y.Z is too old"

Update your Claude CLI:

```bash
# Check current version
claude --version

# Update instructions at:
# https://code.claude.com/docs/en/install
```

### "/create-standards command not found"

Make sure you're running `claude` from a directory that contains the `.claude/` folder created by this installer.

## Contributing

Contributions welcome! Please ensure:
- Agent files follow the established YAML frontmatter format
- Commands include clear descriptions and argument hints
- All changes are tested with Claude CLI

## License

MIT
