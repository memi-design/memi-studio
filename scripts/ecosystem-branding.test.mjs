// SPDX-License-Identifier: FSL-1.1-ALv2
// Copyright 2026 Humyn LLC

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function readBytes(relativePath) {
  return readFile(path.join(root, relativePath));
}

const sha256 = (contents) => createHash("sha256").update(contents).digest("hex");

test("vendors the exact revision-3 brand contract and rejects Studio identity drift", async () => {
  const [manifestSource, schemaSource, packageSource, readme, localIcon] = await Promise.all([
    readBytes("brand/brand-manifest.v1.json"),
    readBytes("brand/brand-manifest.v1.schema.json"),
    read("package.json"),
    read("README.md"),
    readBytes("docs/assets/memi-icon-dark.png"),
  ]);

  assert.equal(
    sha256(manifestSource),
    "8b7ca68e836ee0362fe1763b067dacb8e500d5037cd12791f6c5aaf0e80a2755",
  );
  assert.equal(
    sha256(schemaSource),
    "ef3eaed367e20c3d54ef8284d84c8195d40fb5916fcd525fcd77243a0353e473",
  );

  const manifest = JSON.parse(manifestSource);
  const packageMetadata = JSON.parse(packageSource);
  const studio = manifest.products.find((product) => product.id === "studio");
  assert.ok(studio, "Canonical Studio product is required");
  assert.equal(manifest.brandRevision, 3);
  assert.equal(studio.name, "memi Studio");
  assert.equal(studio.status, "available");
  assert.equal(studio.role, "Native macOS companion for supervised agent workflows and artifact review.");
  assert.deepEqual(studio.packages, []);

  assert.match(readme, /^# memi Studio$/m);
  assert.ok(readme.includes(studio.role));
  assert.match(readme, /\*\*Status:\*\* Available/);
  assert.ok(readme.includes(studio.urls.repository));
  assert.ok(readme.includes(studio.urls.download));
  assert.equal(packageMetadata.name, "memi-studio");
  assert.equal(packageMetadata.private, true);
  assert.equal(packageMetadata.homepage, studio.urls.repository);
  assert.equal(
    packageMetadata.repository.url.replace(/^git\+/, "").replace(/\.git$/, ""),
    studio.urls.repository,
  );
  assert.equal(packageMetadata.license, studio.license.spdx);
  assert.ok(readme.includes(studio.license.name));
  assert.ok(readme.includes(studio.license.futureLicense.effectiveDate));

  const appIcon = studio.icons.find((icon) => icon.purpose === "app");
  assert.ok(appIcon, "Canonical Studio app icon is required");
  assert.equal(appIcon.id, "studio-app-icon");
  assert.equal(sha256(localIcon), appIcon.sha256);
  assert.ok(readme.includes(appIcon.alt));
});

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
