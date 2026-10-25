#!/usr/bin/env node
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const inputDir = path.join(root, 'data/research-map');
const outputDir = path.join(root, 'data/public/research-map');
const privateDir = path.join(root, '_private');
const removedFields = new Set(['source_path', 'source_sha256', 'basis', 'raw_line', 'historical_evidence_path']);
const requiredMarkers = ['D' + ':/', 'research' + '-assets-', '20' + '_DIRECTIONS'];
const internalString = /[DC]:[\\/]|\\/i;
const files = (await readdir(inputDir)).filter(name => name.endsWith('.jsonl')).sort();
const parse = text => text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim()).map(JSON.parse);
const source = new Map(await Promise.all(files.map(async name => [name, parse(await readFile(path.join(inputDir, name), 'utf8'))])));
const reportNodes = source.get('nodes.jsonl').filter(node => node.object_type === 'report');
if (reportNodes.length !== 20) throw new Error('Expected exactly 20 report nodes; review the public ID mapping before exporting.');
const reportIdMap = Object.fromEntries(reportNodes.map((node, index) => [node.node_id, 'reports:R' + String(index + 1).padStart(2, '0')]));
const replacements = Object.entries(reportIdMap).sort(([a], [b]) => b.length - a.length);

// Remove local file paths while keeping line/section locators and public URLs.
function sanitizeLocator(value) {
  return value.replace(/(?<![A-Za-z0-9])(?:[A-Za-z]:[\\/]|\\\\)[^，,;；·]*?(?=[:#](?:L\d|§|\w)|[，,;；·]|$)/g, '')
    .replace(/(^|[\s，,;；·])(?:\.{0,2}\/)?(?:[\w.-]+\/)+[\w.-]+\.(?:md|jsonl?|txt|csv|pdf)(?=[:#\s，,;；·]|$)/gi, '$1')
    .replace(/^[:#\s]+/, '').trim();
}

function sanitize(value, key = '') {
  if (Array.isArray(value)) return value.map(item => sanitize(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([name]) => !removedFields.has(name))
      .map(([name, item]) => [name, sanitize(item, name)]));
  }
  if (typeof value !== 'string') return value;
  let result = value;
  for (const [original, publicId] of replacements) result = result.split(original).join(publicId);
  if (key === 'locator') result = sanitizeLocator(result);
  return internalString.test(result) ? '[internal]' : result;
}

const readme = [
  '# Research map data fields',
  '',
  '## Fields',
  '',
  '- schema_version: record schema version.',
  '- node_id, edge_id, story_id: stable record identifiers; report nodes use reports:R01 through reports:R20.',
  '- object_type: paper, direction, route, theme, rq, experiment, or report.',
  '- title, title_ja, one_line: authored titles and descriptions.',
  '- one_line_ja, caption_ja (nodes.ja.jsonl, stories.ja.jsonl): Japanese sidecars translated by R; node_id / story_id + step_index key them to the originals.',
  '- status: one of the four states defined below, or null when no state is assigned.',
  '- public: the unchanged visibility flag; false does not grant permission to publish.',
  '- checked_at: the date of the recorded check, not evidence of full-text verification.',
  '- bib: authors, year, venue, identifiers, and verification_scope.',
  '- source_namespace: namespace used to distinguish identifiers.',
  '- from, to, relation_type: referenced nodes and the recorded relationship.',
  '- evidence: retained locators, quotations, roles, symbols, and verification qualifications.',
  '- locator: a line, section, record, or public reference locator without local file paths.',
  '- claim, limitation, confidence: relationship description, qualification, and stated/inferred confidence.',
  '- theme, themes, core_papers, steps: theme membership and reading order; steps contain node_id, caption, and depth.',
  '- key, ja, zh, en: lookup key and unchanged Japanese, Chinese, and English copy.',
  '- openalex_id, via, year, cited_by_count, referenced_works, match_title: bibliographic enrichment fields.',
  '- source, fetched_at: citation data provider and retrieval date.',
  '',
  '## 状态四级',
  '',
  '- 候选：保留的问题或方案，未启用实证工作。',
  '- 准备中：已有设计/输入，或仅技术尝试、提纲，尚无该问题的可用观察。',
  '- 有开发观察：已有有限开发结果或保存结果分析，仍非独立正式验证。',
  '- 正式结论：正式审查后才可使用；状态不表示文档是否完稿。',
  ''
].join('\n');

const outputs = new Map(files.map(name => [name, source.get(name).map(row => JSON.stringify(sanitize(row))).join('\n') + '\n']));
outputs.set('README.md', readme);
for (const [name, bytes] of outputs) {
  if (requiredMarkers.some(marker => bytes.includes(marker)) || /(?:^|[^A-Za-z0-9])[A-Z]:[\\/]|20_DIRECTIONS|research-control-[^"\s]*\//i.test(bytes)) {
    throw new Error('Additional internal information found in ' + name + '; review before publication.');
  }
}
await mkdir(privateDir, { recursive: true });
await writeFile(path.join(privateDir, 'report-id-map.json'), JSON.stringify(reportIdMap, null, 2) + '\n');
await mkdir(outputDir, { recursive: true });
const stale = (await readdir(outputDir)).filter(name => !outputs.has(name));
if (stale.length) throw new Error('Unexpected files in public output; review them before exporting.');
for (const [name, bytes] of outputs) await writeFile(path.join(outputDir, name), bytes, 'utf8');

// These checks have the same zero-match requirement as recursive fixed-string grep.
for (const marker of requiredMarkers) {
  let matches = 0;
  for (const name of await readdir(outputDir)) matches += (await readFile(path.join(outputDir, name), 'utf8')).split(marker).length - 1;
  console.log('Public self-check ' + marker + ': ' + matches);
  if (matches) process.exitCode = 1;
}
console.log('Exported ' + files.length + ' JSONL files; report IDs: ' + reportNodes.length + '.');
