#!/usr/bin/env node
/**
 * Research lineage prototype — deterministic, read-only JSONL → precomputed D3 layout.
 *
 * From this directory after handoff:
 *   node build-layout.mjs
 *   node build-layout.mjs --serve --port 8791
 *
 * Explicit inputs / output / offline D3 bundle:
 *   node build-layout.mjs --data-dir "../../data/public/research-map" --out layout.json
 *   node build-layout.mjs --d3 "/absolute/path/to/d3.min.js"
 *
 * D3 7.9.0 is fetched once into the operating system temporary cache when needed.
 * No npm install, framework, graph-layout package, or runtime simulation is used.
 * The browser loads its independent D3 UMD bundle from the same CDN version.
 */
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${flag} requires a value`);
  return args[i + 1];
};
if (args.includes('--help')) {
  console.log('node build-layout.mjs [--data-dir PATH] [--out PATH] [--d3 PATH] [--serve] [--port 8791]');
  process.exit(0);
}
const known = new Set(['--data-dir', '--out', '--d3', '--serve', '--port']);
for (const arg of args.filter(v => v.startsWith('--'))) {
  if (!known.has(arg)) throw new Error(`Unknown option: ${arg}`);
}
const dataDir = path.resolve(value('--data-dir', path.resolve(here, '../../data/public/research-map')));
const outPath = path.resolve(value('--out', path.join(here, 'layout.json')));
const sourceNames = ['nodes.jsonl', 'lineage.jsonl', 'citations.jsonl', 'openalex.jsonl', 'paper-themes.jsonl', 'stories.jsonl', 'copy.jsonl', 'edges.jsonl', 'README.md'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceBytes = new Map(await Promise.all(sourceNames.map(async name => [name, await readFile(path.join(dataDir, name))])));
const jsonl = name => sourceBytes.get(name).toString('utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(line => line.trim()).map((line, i) => {
  try { return JSON.parse(line); } catch (error) { throw new Error(`${name}:${i + 1}: ${error.message}`); }
});
const rawNodes = jsonl('nodes.jsonl');
const lineage = jsonl('lineage.jsonl');
const citations = jsonl('citations.jsonl');
const openalex = jsonl('openalex.jsonl');
const paperThemes = jsonl('paper-themes.jsonl');
const rawStories = jsonl('stories.jsonl');
const copy = jsonl('copy.jsonl');
const edges = jsonl('edges.jsonl');
const associations = edges.filter(edge => edge.relation_type === 'experiment_answers_rq');
const themeRelations = edges.filter(edge => edge.relation_type === 'rq_under_theme');
const nodeById = new Map(rawNodes.map(node => [node.node_id, node]));
if (nodeById.size !== rawNodes.length) throw new Error('Duplicate node_id');
for (const edge of [...lineage, ...citations, ...associations, ...themeRelations]) {
  if (!nodeById.has(edge.from) || !nodeById.has(edge.to)) throw new Error(`Missing endpoint on ${edge.edge_id}`);
}

const d3Version = '7.9.0';
const d3URL = `https://cdnjs.cloudflare.com/ajax/libs/d3/${d3Version}/d3.min.js`;
const cachePath = path.join(tmpdir(), `research-lineage-d3-${d3Version}.min.js`);
const suppliedD3 = value('--d3', null);
let d3Code;
if (suppliedD3) d3Code = await readFile(path.resolve(suppliedD3), 'utf8');
else {
  try { d3Code = await readFile(cachePath, 'utf8'); }
  catch {
    let response;
    try { response = await fetch(d3URL); }
    catch (error) { throw new Error(`Cannot download D3. Supply a local UMD bundle with --d3 PATH. ${error.message}`); }
    if (!response.ok) throw new Error(`D3 download failed: HTTP ${response.status}`);
    d3Code = await response.text();
    await writeFile(cachePath, d3Code, 'utf8');
  }
}
const sandbox = {setTimeout, clearTimeout, setInterval, clearInterval, performance};
vm.runInNewContext(d3Code, sandbox, {filename: 'd3.min.js', timeout: 10000});
const d3 = sandbox.d3;
if (!d3?.forceCollide || d3.version !== d3Version) throw new Error(`Expected D3 ${d3Version} UMD bundle`);

const oaById = new Map(openalex.map(row => [row.node_id, row]));
const maxCitations = Math.max(1, ...openalex.map(row => Number(row.cited_by_count) || 0));
const parseYear = raw => {
  if (typeof raw === 'number') return Number.isInteger(raw) && raw >= 1800 && raw <= 2200 ? raw : null;
  const match = String(raw ?? '').match(/\b(?:18|19|20|21)\d{2}\b/);
  return match ? Number(match[0]) : null;
};
const round = n => Math.round(n * 1000) / 1000;
const nodes = rawNodes.map(node => {
  const oa = oaById.get(node.node_id);
  const oaYear = parseYear(oa?.year);
  const bibYear = parseYear(node.bib?.year);
  const cited = oa?.cited_by_count == null ? null : Math.max(0, Number(oa.cited_by_count) || 0);
  const isPaper = node.object_type === 'paper';
  return {
    ...node,
    year: isPaper ? oaYear ?? bibYear : null,
    yearBasis: isPaper ? oaYear != null ? 'openalex.year' : bibYear != null ? 'bib.year' : 'unavailable' : 'undated',
    yearRaw: isPaper ? node.bib?.year ?? null : null,
    cited_by_count: isPaper ? cited : null,
    citationCountBasis: isPaper ? cited == null ? 'unavailable' : 'openalex.cited_by_count' : null,
    radius: isPaper ? round(4 + 14 * Math.log1p(cited ?? 0) / Math.log1p(maxCitations)) : 8
  };
});
const enrichedById = new Map(nodes.map(node => [node.node_id, node]));
const yearDomain = d3.extent(nodes.filter(node => node.object_type === 'paper' && node.year != null), node => node.year);
const plot = {left: 320, right: 1100};
const undatedX = 1240;
const experimentX = 1360;
const collapsedHeight = 100;
// Piecewise (polylinear) year axis: 43 of 65 papers are 2024–2026, so the years before the break
// get a compressed share of the width. Same stops are published in meta for the renderer.
const yearBreak = 2020;
const xDomain = yearDomain[0] < yearBreak && yearDomain[1] > yearBreak ? [yearDomain[0], yearBreak, yearDomain[1]] : yearDomain;
const xRange = xDomain.length === 3 ? [plot.left, plot.left + 0.28 * (plot.right - plot.left), plot.right] : [plot.left, plot.right];
const xTicks = xDomain.length === 3 ? [...new Set([yearDomain[0], 2010, 2015, yearBreak, 2022, 2024, yearDomain[1]])].filter(y => y >= yearDomain[0] && y <= yearDomain[1]) : null;
const xScale = d3.scaleLinear().domain(xDomain).range(xRange);

// These exact existing edge IDs are the twelve entries in advice suggestion 2.
const trunkEdgeIds = [
  'lineage:P021->P026:extends',
  'lineage:P026->T1-RQ1:motivates_rq',
  'lineage:P022->P024:extends',
  'lineage:P024->P025:extends',
  'lineage:P025->T1-RQ4:motivates_rq',
  'lineage:P008->P009:extends',
  'lineage:P009->P011:addresses_limitation',
  'lineage:P011->P012:extends',
  'lineage:P012->P013:addresses_limitation',
  'lineage:P013->T2-RQ1:motivates_rq',
  'lineage:P038->T3-RQ1:motivates_rq',
  'lineage:P047->T4-RQ1:motivates_rq'
];
const lineageIds = new Set(lineage.map(edge => edge.edge_id));
for (const edgeId of trunkEdgeIds) if (!lineageIds.has(edgeId)) throw new Error(`Missing trunk edge: ${edgeId}`);

const themes = nodes.filter(node => node.object_type === 'theme').sort((a, b) => a.node_id.localeCompare(b.node_id)).map(theme => {
  const paperIds = paperThemes.filter(row => row.themes.includes(theme.node_id)).map(row => row.node_id)
    .sort((a, b) => (enrichedById.get(a).year ?? Infinity) - (enrichedById.get(b).year ?? Infinity) || a.localeCompare(b));
  const rqIds = themeRelations.filter(edge => edge.to === theme.node_id).map(edge => edge.from).sort();
  const experimentIds = [...new Set(associations.filter(edge => rqIds.includes(edge.to)).map(edge => edge.from))].sort();
  const ids = [...paperIds, ...rqIds, ...experimentIds];
  if (ids.some(id => !enrichedById.has(id))) throw new Error(`Unknown lane member in ${theme.node_id}`);
  const groups = d3.group(paperIds, id => enrichedById.get(id).year);
  const initial = new Map();
  // Sorting is chronological; vertical order within a year is stable by namespaced ID.
  for (const group of groups.values()) group.forEach((id, i) => initial.set(id, (i - (group.length - 1) / 2) * 28));
  rqIds.forEach((id, i) => initial.set(id, (i - (rqIds.length - 1) / 2) * 48));
  experimentIds.forEach((id, i) => initial.set(id, (i - (experimentIds.length - 1) / 2) * 28));
  const members = new Set(ids);
  const predecessors = d3.group([...lineage, ...associations].filter(edge => members.has(edge.from) && members.has(edge.to)), edge => edge.to);
  // One predecessor-barycenter sweep only. No similarity, embedding or topology force.
  for (const id of ids) {
    const previous = predecessors.get(id);
    if (previous?.length) initial.set(id, 0.45 * initial.get(id) + 0.55 * d3.mean(previous, edge => initial.get(edge.from)));
  }
  const points = ids.map(id => {
    const node = enrichedById.get(id);
    const fx = node.object_type === 'experiment' ? experimentX : node.year == null ? undatedX : xScale(node.year);
    return {node_id: id, theme: theme.node_id, radius: node.radius, fx, x: fx, y: initial.get(id), vx: 0, vy: 0};
  });
  // Fixed fx preserves the continuous year coordinate; only collision separation can move y.
  const simulation = d3.forceSimulation(points).stop().randomSource(d3.randomLcg(0.20261025))
    .force('collide', d3.forceCollide(point => point.radius + 6).iterations(5).strength(1))
    .velocityDecay(0.35);
  simulation.tick(700);
  simulation.stop();
  const minY = d3.min(points, point => point.y - point.radius) ?? 0;
  const maxY = d3.max(points, point => point.y + point.radius) ?? 0;
  const expandedHeight = Math.max(260, Math.ceil(maxY - minY + 92));
  const yearRanks = new Map();
  for (const group of groups.values()) group.forEach((id, i) => yearRanks.set(id, {i, count: group.length}));
  const instances = points.map(point => {
    const rank = yearRanks.get(point.node_id);
    return {
      node_id: point.node_id,
      theme: point.theme,
      x: round(point.fx),
      y: round(point.y - minY + 46),
      // The collapsed panel is a density view: dots use 2px, not citation-sized circles.
      collapsedY: rank ? round(51 + (rank.i - (rank.count - 1) / 2) * Math.min(5, 42 / Math.max(1, rank.count - 1))) : 51,
      radius: point.radius
    };
  });
  return {
    node_id: theme.node_id,
    code: theme.node_id.split(':')[1],
    title: theme.title_ja ?? theme.title,
    status: theme.status,
    paperIds,
    rqIds,
    experimentIds,
    expandedHeight,
    instances
  };
});

const allGraphEdges = [...lineage, ...associations];
const stories = rawStories.map(story => ({
  ...story,
  stepLinks: story.steps.slice(1).map((step, i) => {
    const readingFrom = story.steps[i].node_id;
    const readingTo = step.node_id;
    const edge = allGraphEdges.find(item => item.from === readingFrom && item.to === readingTo)
      ?? allGraphEdges.find(item => item.from === readingTo && item.to === readingFrom);
    if (!edge) throw new Error(`No existing edge for ${story.story_id} steps ${i + 1}–${i + 2}`);
    return {
      edge_id: edge.edge_id,
      from: edge.from,
      to: edge.to,
      relation_type: edge.relation_type,
      traversal_direction: edge.from === readingFrom ? 'forward' : 'reverse',
      reading_from: readingFrom,
      reading_to: readingTo
    };
  })
}));

// Check the authored output, including rounding, instead of just the simulation state.
let minClearance = Infinity;
let collisionPairs = 0;
let xMismatch = 0;
for (const theme of themes) {
  for (const point of theme.instances) {
    const node = enrichedById.get(point.node_id);
    const expected = node.object_type === 'experiment' ? experimentX : node.year == null ? undatedX : round(xScale(node.year));
    if (Math.abs(point.x - expected) > 0.001) xMismatch++;
  }
  for (let i = 0; i < theme.instances.length; i++) for (let j = i + 1; j < theme.instances.length; j++) {
    const a = theme.instances[i], b = theme.instances[j];
    const clearance = Math.hypot(a.x - b.x, a.y - b.y) - a.radius - b.radius;
    minClearance = Math.min(minClearance, clearance);
    if (clearance < -0.01) collisionPairs++;
  }
}
if (collisionPairs || xMismatch) throw new Error(`Layout invalid: ${collisionPairs} overlap pairs, ${xMismatch} moved years`);
for (const [name, bytes] of sourceBytes) {
  if (hash(await readFile(path.join(dataDir, name))) !== hash(bytes)) throw new Error(`Source changed while building: ${name}`);
}
const reverseYearEdgeIds = lineage.filter(edge => {
  const a = enrichedById.get(edge.from), b = enrichedById.get(edge.to);
  return a.year != null && b.year != null && a.year > b.year;
}).map(edge => edge.edge_id);
const output = {
  meta: {
    schemaVersion: '1.0.0',
    width: 1440,
    yearDomain,
    xDomain,
    xRange,
    xTicks,
    plot,
    undatedX,
    experimentX,
    collapsedHeight,
    d3Version,
    algorithm: 'year sort → one predecessor barycenter sweep → fixed-fx D3 forceCollide (700 manual build-time ticks)',
    radiusFormula: '4 + 14 * log(1 + cited_by_count) / log(1 + max_cited_by_count); missing counts use minimum radius',
    sourceFiles: sourceNames.map(name => ({name, sha256: hash(sourceBytes.get(name))})),
    counts: {nodes: nodes.length, papers: nodes.filter(node => node.object_type === 'paper').length, themes: themes.length, memberships: paperThemes.reduce((sum, row) => sum + row.themes.length, 0), instances: themes.reduce((sum, theme) => sum + theme.instances.length, 0), lineage: lineage.length, citations: citations.length, associations: associations.length, stories: stories.length, trunkEdges: trunkEdgeIds.length},
    validation: {collisionPairs, xMismatch, minClearance: round(minClearance), sourceUnchanged: true, reverseYearEdgeIds},
    notes: [
      'RQ and experiment positions are undated columns, never publication dates.',
      'Story step order is reading order. stepLinks.from/to retain original relation direction, including experiment → RQ.',
      'Theme membership derives from the supplied paper-themes and existing rq_under_theme / experiment_answers_rq evidence.',
      'Collapsed bands show 2px paper density points; expanded paper radii encode log citation count.',
      'All source visibility fields remain unchanged. This local prototype does not grant publication permission.'
    ]
  },
  nodes,
  themes,
  lineage,
  citations,
  associations,
  themeRelations,
  paperThemes,
  stories,
  copy,
  trunkEdgeIds
};
await mkdir(path.dirname(outPath), {recursive: true});
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({output: outPath, ...output.meta.counts, validation: output.meta.validation}));

if (args.includes('--serve')) {
  const port = Number(value('--port', '8791'));
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid --port');
  const root = path.dirname(outPath);
  const mime = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png'};
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const target = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
      const relative = path.relative(root, target);
      if (relative.startsWith('..') || path.isAbsolute(relative)) { response.writeHead(403).end('Forbidden'); return; }
      const body = await readFile(target);
      response.writeHead(200, {'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-store'}).end(body);
    } catch { response.writeHead(404).end('Not found'); }
  });
  server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/`));
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
