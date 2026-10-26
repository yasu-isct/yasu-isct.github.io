#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dataDir = path.join(root, 'data/public/research-map');
const prototypeDir = path.join(root, 'public/prototype-lineage');
const forbiddenFields = new Set(['source_path', 'source_sha256', 'basis', 'raw_line', 'historical_evidence_path']);
const requiredMarkers = ['D' + ':/', 'research' + '-assets-', '20' + '_DIRECTIONS'];
const unsafe = /(?:^|[^A-Za-z0-9])[A-Z]:[\\/]|research-assets-|20_DIRECTIONS|research-control-[^"\s]*\/|job[-]finding|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/i;
const allowedPrototype = ['build-layout.mjs', 'd3.LICENSE', 'd3.v7.9.0.min.js', 'layout.json', 'map.embed.css', 'map.embed.js'].sort();
const layoutSources = ['nodes.jsonl', 'lineage.jsonl', 'citations.jsonl', 'openalex.jsonl', 'paper-themes.jsonl', 'stories.jsonl', 'copy.jsonl', 'edges.jsonl', 'README.md'];
// + R's Japanese sidecars (one_line_ja / title_ja / caption_ja), not part of the layout build
const sourceNames = [...layoutSources, 'nodes.ja.jsonl', 'stories.ja.jsonl'];
const parse = text => text.split(/\r?\n/).filter(line => line.trim()).map(JSON.parse);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function inspect(value, context) {
  if (typeof value === 'string') assert(!unsafe.test(value) && !value.includes('\\'), 'Internal value in ' + context);
  else if (Array.isArray(value)) value.forEach((item, index) => inspect(item, context + '[' + index + ']'));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      assert(!forbiddenFields.has(key), 'Internal field in ' + context + '.' + key);
      inspect(item, context + '.' + key);
    }
  }
}
function inspectText(text, context) {
  for (const marker of requiredMarkers) assert(!text.includes(marker), 'Internal marker in ' + context);
  assert(!unsafe.test(text), 'Internal text in ' + context);
}
const names = (await readdir(dataDir)).sort();
assert.deepEqual(names, [...sourceNames].sort(), 'Unexpected public data files');
const bytesByName = new Map(await Promise.all(names.map(async name => [name, await readFile(path.join(dataDir, name))])));
const rows = new Map();
for (const [name, bytes] of bytesByName) {
  inspectText(bytes.toString('utf8'), name);
  if (name.endsWith('.jsonl')) {
    rows.set(name, parse(bytes.toString('utf8')));
    inspect(rows.get(name), name);
  }
}
const nodes = rows.get('nodes.jsonl');
const ids = new Set(nodes.map(node => node.node_id));
assert.equal(ids.size, nodes.length, 'Duplicate node IDs');
assert.deepEqual(nodes.filter(node => node.object_type === 'report').map(node => node.node_id),
  Array.from({ length: 20 }, (_, index) => 'reports:R' + String(index + 1).padStart(2, '0')));
for (const name of ['edges.jsonl', 'lineage.jsonl', 'citations.jsonl']) {
  for (const edge of rows.get(name)) assert(ids.has(edge.from) && ids.has(edge.to), 'Unknown endpoint in ' + name);
}
for (const name of ['nodes.jsonl', 'edges.jsonl', 'lineage.jsonl', 'stories.jsonl', 'citations.jsonl']) {
  assert(rows.get(name).every(row => row.public === false), 'Visibility flag changed in ' + name);
}
const layoutBytes = await readFile(path.join(prototypeDir, 'layout.json'));
inspectText(layoutBytes.toString('utf8'), 'layout.json');
const layout = JSON.parse(layoutBytes);
inspect(layout, 'layout');
assert.deepEqual(layout.meta.sourceFiles.map(item => item.name), layoutSources);
for (const file of layout.meta.sourceFiles) {
  assert.deepEqual(Object.keys(file).sort(), ['name', 'sha256']);
  assert.equal(path.basename(file.name), file.name);
  assert.equal(file.sha256, sha256(bytesByName.get(file.name)), 'Layout input hash differs');
}
assert.deepEqual(layout.nodes.map(node => node.node_id), nodes.map(node => node.node_id));
assert.equal(layout.meta.validation.collisionPairs, 0);
assert.equal(layout.meta.validation.xMismatch, 0);
assert.deepEqual((await readdir(prototypeDir)).sort(), allowedPrototype, 'Private prototype assets remain public');
console.log('Public data and layout: clean; IDs, visibility, references, input hashes and prototype allowlist verified.');

if (process.argv.includes('--dist')) {
  let htmlPages = 0;
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        assert(!['_private', 'design-proposal', 'sketches', 'J-Grad-Admission-RAG'].includes(entry.name), 'Unexpected directory in dist');
        await walk(filename);
      } else if (/^d3./.test(entry.name)) {
        // vendored third-party library (D3, ISC licence beside it): not site text, so not scanned for internal markers
      } else if (/\.(?:html|css|js|mjs|json|svg|md|txt)$/i.test(entry.name)) {
        const text = await readFile(filename, 'utf8');
        inspectText(text, path.relative(root, filename));
        if (entry.name.endsWith('.json')) inspect(JSON.parse(text), path.relative(root, filename));
        if (entry.name.endsWith('.html')) {
          htmlPages++;
          assert(/<meta\s+name="robots"\s+content="noindex"\s*\/?>/.test(text), 'noindex missing');
        }
      }
    }
  }
  await walk(path.join(root, 'dist'));
  assert.equal(htmlPages, 12, 'Unexpected HTML page count');
  assert.deepEqual((await readdir(path.join(root, 'dist/prototype-lineage'))).sort(), allowedPrototype);
  assert.equal(sha256(await readFile(path.join(root, 'dist/prototype-lineage/layout.json'))), sha256(layoutBytes));
  assert((await readFile(path.join(root, 'dist/index.html'), 'utf8')).includes('内部プレビュー'), 'Preview footer missing');
  console.log('Built output: 12 noindex pages; preview footer retained; no private assets or forbidden markers.');
}
