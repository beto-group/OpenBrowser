# 🛠️ Contributing to Open Browser

Welcome! This document outlines the developer standards, structure, and lifecycle guidelines for maintaining the Open Browser component.

---

## 🏛️ Core Architecture Pillars

1. **Host-Native Theme Compliance**:
   - Style components using Obsidian CSS variables exclusively. No hardcoded absolute background or text colors.
2. **Safe Watchdog Guard**:
   - Active safety watchdog polling `data/mcp_commands.json` ensures agent-directed reloads function even if the main workspace crashes.
3. **Zero-Dependency Runtime**:
   - Rely strictly on standard react hooks provided by the `dc` host environment leaf.

---

## 🚀 Local Compilation & Reload Loop

- **Hot Reload Trigger**: During development, update `data/mcp_commands.json` with `{"action":"reload","timestamp":<timestamp>,"executed":false}` to trigger a view reload instantly.
