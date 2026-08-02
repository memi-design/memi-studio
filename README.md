<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/memi-icon-dark.png">
    <img src="docs/assets/memi-icon-light.png" width="140" alt="Memi Studio app icon">
  </picture>
</p>

# memi Studio

> Native macOS companion for supervised agent workflows and artifact review.

[![License: FSL-1.1-ALv2](https://img.shields.io/badge/license-FSL--1.1--ALv2-blue.svg)](./LICENSE)
[![Future License: Apache-2.0](https://img.shields.io/badge/future_license-Apache--2.0-green.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![macOS 11.0+](https://img.shields.io/badge/macOS-11.0%2B-lightgrey.svg)](#install)

memi Studio is the current macOS companion to the [memi engine](https://github.com/memi-design/memi). It supervises agent runs and keeps their traces, context, and artifacts together; it does not replace the memi CLI or MCP server. The engine ships as the `@memi-design/cli` npm package, while this repository ships the signed, notarized macOS DMG. Product documentation lives at [memoire.cv](https://memoire.cv).

## Status

**Status:** Available.

This repository is the **home** for the current memi Studio Tauri application. The macOS shell lives here; the npm engine, MCP server, harness runtime, and packaged sidecar assets live in [`memi-design/memi`](https://github.com/memi-design/memi).

Track engine release progress in the [memi changelog](https://github.com/memi-design/memi/blob/main/CHANGELOG.md).

The default product surface is a single workbench: workspace picker, Codex/Claude readiness, composer, run trace, artifacts, context, and settings. Scenario Lab, Mermaid Board, Figma driver, Automations, Marketplace Notes, and secondary harnesses remain available as advanced integrations.

### Canvas direction

The product direction includes a future transition to memi Canvas, where the supervised workbench can become part of the broader repository-backed canvas workflow. That transition depends on Canvas meeting its security, release, and effectful-workflow gates. No release date is being announced here; until those gates are met and a release is published, memi Studio remains the supported companion described in this repository.

## Install

DMG releases are published from this repository's GitHub Releases.

Install the latest release:

```bash
brew install --cask memi-design/memi/memi-studio
```

Direct DMG downloads are attached to [memi-studio releases](https://github.com/memi-design/memi-studio/releases/latest).

## What memi Studio is

- **One workbench** — pick a workspace, verify agent readiness, compose the task, watch the run trace, and review artifacts/context without switching products.
- **Codex primary, Claude supported** — Codex is the default harness; Claude Code is the supported alternate. Other harnesses are advanced integrations.
- **Explicit setup** — install/auth/model/effort/permission state is visible, with copyable commands and refresh actions.
- **Project memory** — indexed knowledge corpus per workspace; sessions accumulate design and engineering evidence.
- **Artifact panel** — diffs, screenshots, plans, transcripts, and work packets stay tied to the run.
- **Apple-platform workflow** — `/ios` and the Build SwiftUI starter route Codex or Claude through Memi briefs, approval-gated SwiftUI scaffolds, Xcode discovery, tests, and simulator evidence.
- **Advanced integrations** — Figma, Mermaid Board, IA, Scenario Lab, Automations, Marketplace Notes, and secondary harnesses are available from command palette/settings.

## Release compatibility

| Studio | Runtime | Memi package | Apple workflow |
| --- | --- | --- | --- |
| `2.5.0` | `0.20.0` | `@memi-design/cli@2.6.0` | SwiftUI brief, dry-run scaffold, approved writes, Swift typecheck, Xcode/simulator handoff |

Studio does not invent future platform support. Liquid Glass guidance is scoped to iOS 26+ with availability-gated fallbacks, and every build, test, preview, simulator, signing, or App Store claim must match evidence produced in the active workspace.

The packaged Apple workflow can be verified with:

```bash
npm run test:live-e2e -- --skip-live-agents
```

## Architecture

memi Studio is a Tauri 2 application:

- **Rust shell** (`src-tauri/`) — webview host, Tauri commands, secure subprocess management.
- **React/TypeScript frontend** (`src/`) — workbench UI, composer, manager view, surfaces.
- **Node.js sidecar** (`memi-studio-runtime`, fetched from engine releases) — harness drivers, MCP server, Figma bridge, project memory, all behind a local-loopback HTTP/WebSocket API on `127.0.0.1:8765`.

The sidecar is built and signed in the [memi engine repo](https://github.com/memi-design/memi) and downloaded by this repo's CI at the version pinned in `package.json`.

## License

**Functional Source License 1.1 with Apache-2.0 future license (FSL-1.1-ALv2).**

memi Studio is source-available today for any [Permitted Purpose](./LICENSE#permitted-purpose) — internal use, non-commercial education, non-commercial research, and professional services on behalf of licensees. The code is source-available, not open source, while it is under the FSL. **Competing commercial use is not permitted.**

On **2028-05-09** — the second anniversary of first publication — memi Studio automatically becomes available under the Apache License, Version 2.0.

See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE) for full terms.

## Contributing

By submitting a contribution, you agree that your contribution is licensed under the same terms as this repository (FSL-1.1-ALv2 with Apache-2.0 future license) and that you have the right to grant such a license. We use the Developer Certificate of Origin — sign your commits with `git commit -s`.

A `CONTRIBUTING.md` with the full guidelines lands alongside the application carve-out.

## Related projects

- [`memi-design/memi`](https://github.com/memi-design/memi) — memi engine, CLI, MCP server, and focused agent skills (MIT)
- [`memi-design/design-skills`](https://github.com/memi-design/design-skills) — curated product-design workflows for AI coding agents (MIT)
- [`memi-design/mermaid-jam`](https://github.com/memi-design/mermaid-jam) — local-only FigJam plugin for Mermaid diagrams

---

Copyright 2026 Humyn LLC.
