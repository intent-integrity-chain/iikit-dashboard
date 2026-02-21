# IIKit Dashboard Premise

## What

A browser-based kanban dashboard that visualizes the progress of Intent Integrity Kit (IIKit) specification-driven development in real time. It reads IIKit artifacts (tasks.md, spec.md, plan.md, etc.) from the project directory and renders them as interactive views — kanban boards, architecture diagrams, quality gates, and traceability matrices.

## Who

Developers and teams using IIKit for specification-driven development who want visual feedback on feature progress, spec quality, and cross-artifact consistency without leaving their terminal workflow.

## Why

IIKit operates through markdown files and CLI commands. While powerful, tracking progress across multiple features, phases, and artifacts is hard to do by reading files alone. The dashboard closes this feedback gap — making the invisible state of a spec-driven workflow visible at a glance.

## Domain

- **IIKit workflow**: The 10-phase specification-driven development process (constitution → specify → clarify → plan → checklist → testify → tasks → analyze → implement → issues)
- **Artifacts**: Markdown files produced by each phase (spec.md, plan.md, tasks.md, checklists/, tests/, bugs.md)
- **Task states**: Pending (`[ ]`), in-progress, completed (`[x]`), with parallel markers (`[P]`) and story labels (`[USn]`)
- **Assertion integrity**: Cryptographic hashes that prevent test specification tampering

## Scope

- **In scope**: Read-only visualization of IIKit project state. Launched via `npx iikit-dashboard@latest` from the project directory. Dark/light theme. Auto-refresh on file changes.
- **Out of scope**: Editing artifacts, running IIKit commands, multi-project views, persistent storage, user authentication.
