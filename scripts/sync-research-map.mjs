// Copy R's research-map snapshot into site-data/. Run: npm run sync:research
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
const src = process.env.RESEARCH_MAP_DIR;
if (!src?.trim()) throw new Error('RESEARCH_MAP_DIR must be provided; no default source directory is configured.');
const dst = resolve(import.meta.dirname, '../data/research-map');
mkdirSync(dst, { recursive: true });
// nodes.ja.jsonl / stories.ja.jsonl are R's Japanese sidecars (sidecars/<batch>/), copied beside the snapshot files.
for (const f of ['nodes.jsonl', 'edges.jsonl', 'lineage.jsonl', 'stories.jsonl', 'paper-themes.jsonl', 'copy.jsonl', 'README.zh-CN.md', 'nodes.ja.jsonl', 'stories.ja.jsonl']) {
  copyFileSync(resolve(src, f), resolve(dst, f));
  console.log(`${f}  ${statSync(resolve(dst, f)).size} bytes`);
}
