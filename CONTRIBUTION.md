# Contribution Guidelines — Open Browser

Welcome! This component is part of the BetoOS Datacore library. Please adhere to the following architectural standards.

## Codebase Architecture

The module utilizes a split-file structure to guarantee legibility, testability, and isolated execution scopes:

```text
OpenBrowser/
├── OPEN BROWSER.md        # Obsidian entry point
├── METADATA.md            # Component manifest
├── README.md              # Documentation
├── CONTRIBUTION.md        # This file
├── LICENSE.md             # MIT license
├── data/
│   └── mcp_commands.json  # External watch/reload trigger
├── assets/
│   ├── image/
│   │   └── preview_1.webp # Static preview image
│   └── videos/
│       └── preview.gif    # Interactive walkthrough GIF
└── src/
    ├── index.jsx          # Event-driven code watcher and bootstrapper
    └── App.jsx            # Main React layout and browser command center
```

## Developer Standards

1. **Strict Zero Emojis**: All UI elements, buttons, headers, and control indicators must use Lucide vector icons or plain text. Emojis are reserved strictly for documentation.
2. **Path Safety**: Do not hardcode absolute path strings (e.g. `/Volumes/` or `file:///`). Always resolve vault directories dynamically.
3. **Theme Parity**: Ensure that color choices reference CSS variables (e.g. `var(--interactive-accent)`) for native Obsidian compatibility.
4. **HMR Command System**: To force a code reload or command watch directory path change remotely via MCP agents, write the reload payload to `data/mcp_commands.json`.
