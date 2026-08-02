// SPDX-License-Identifier: FSL-1.1-ALv2
// Copyright 2026 Humyn LLC

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

test("active code and release operations use organization-owned repositories", async () => {
  const [packageSource, tauriSource, autoUpdater, credentials, memiCi, notice, appSource] = await Promise.all([
    read("package.json"),
    read("src-tauri/tauri.conf.json"),
    read("src/auto-updater.ts"),
    read("docs/CREDENTIALS.md"),
    read(".github/workflows/memi-ci.yml"),
    read("NOTICE"),
    read("src/App.tsx"),
  ]);
  const packageMetadata = JSON.parse(packageSource);
  const tauriConfig = JSON.parse(tauriSource);

  assert.equal(packageMetadata.homepage, "https://github.com/memi-design/memi-studio");
  assert.equal(packageMetadata.repository.url, "git+https://github.com/memi-design/memi-studio.git");
  assert.equal(packageMetadata.memoireRuntime.engineRepo, "memi-design/memi");
  assert.deepEqual(tauriConfig.plugins.updater.endpoints, [
    "https://github.com/memi-design/memi-studio/releases/latest/download/latest.json",
  ]);
  assert.match(autoUpdater, /memi-design\/memi-studio "latest" release/);
  assert.match(credentials, /gh secret list --repo memi-design\/memi-studio/);
  assert.doesNotMatch(credentials, /sarveshsea\/memi-studio/);
  assert.match(memiCi, /uses: memi-design\/memi@v2\.3\.0/);
  assert.match(notice, /https:\/\/github\.com\/memi-design\/memi/);
  assert.match(appSource, /https:\/\/github\.com\/memi-design\/memi#examples/);
});

test("README states the current companion role, source-available license, and undated Canvas direction", async () => {
  const readme = await read("README.md");

  assert.match(readme, /^# memi Studio$/m);
  assert.match(readme, /current macOS companion/);
  assert.match(readme, /does not replace the memi CLI or MCP server/);
  assert.match(readme, /source-available, not open source, while it is under the FSL/);
  assert.match(readme, /future transition to memi Canvas/);
  assert.match(readme, /No release date is being announced here/);
  assert.match(readme, /https:\/\/memoire\.cv/);
});
