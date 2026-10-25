// Build-time loader for R's research-map data (site-data/research-map/*.jsonl).
// The jsonl files are a snapshot copied from the research workspace; see
// scripts/sync-research-map.mjs. Nothing here mutates the source.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type Status = '候选' | '准备中' | '有开发观察' | '正式结论';
export type ObjectType = 'paper' | 'direction' | 'route' | 'theme' | 'rq' | 'experiment' | 'report';

export interface Bib {
  authors: string | null;
  year: string | null;
  venue: string | null;
  identifiers: { doi: string[]; arxiv: string[] };
  verification_scope: string | null;
}

export interface Node {
  node_id: string;
  object_type: ObjectType;
  title: string;
  title_ja: string | null;
  one_line: string;
  status: Status | null;
  public: boolean;
  checked_at: string;
  bib?: Bib;
  source_namespace?: string;
}

export interface Edge {
  edge_id: string;
  from: string;
  to: string;
  relation_type: string;
  evidence: unknown[];
  public: boolean;
}

// Anchored at the site root (astro runs with cwd = site/), so it works after bundling too.
const dataDir = resolve(process.cwd(), 'data/public/research-map');

// Presentation-only Japanese edits. The hashed research snapshots stay byte-for-byte intact.
interface EditorialJa {
  copy: Record<string, string>;
  titles: Record<string, string>;
  stories: Record<string, { title: string; steps: Record<string, string> }>;
}
const editorialJa: EditorialJa = JSON.parse(readFileSync(resolve(process.cwd(), 'public/research-ja-editorial.json'), 'utf8'));

function readJsonl<T>(file: string): T[] {
  return readFileSync(resolve(dataDir, file), 'utf8')
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((l) => JSON.parse(l) as T);
}

export const nodes: Node[] = readJsonl<Node>('nodes.jsonl');
export const edges: Edge[] = readJsonl<Edge>('edges.jsonl');

export const byId = new Map(nodes.map((n) => [n.node_id, n]));
export const ofType = (t: ObjectType) => nodes.filter((n) => n.object_type === t);

/** Local id after the namespace colon, e.g. "P025", "D01", "T01". */
export const localId = (id: string) => id.slice(id.indexOf(':') + 1);

/** Strip the "（title_ja 为 R 译）" bookkeeping note R appends to one_line. */
export const cleanOneLine = (s: string) => s.replace(/（title_ja 为 R 译）/g, '').trim();

export function targetsOf(from: string, relation: string): Node[] {
  return edges
    .filter((e) => e.from === from && e.relation_type === relation)
    .map((e) => byId.get(e.to))
    .filter((n): n is Node => Boolean(n));
}
export function sourcesOf(to: string, relation: string): Node[] {
  return edges
    .filter((e) => e.to === to && e.relation_type === relation)
    .map((e) => byId.get(e.from))
    .filter((n): n is Node => Boolean(n));
}

export const routes = ofType('route').sort((a, b) => a.node_id.localeCompare(b.node_id));
export const directions = ofType('direction').sort((a, b) => a.node_id.localeCompare(b.node_id));
export const themes = ofType('theme').sort((a, b) => a.node_id.localeCompare(b.node_id));
export const papers = ofType('paper').sort((a, b) => a.node_id.localeCompare(b.node_id));

export const routesOfDirection = (d: Node) => targetsOf(d.node_id, 'direction_in_route');
export const themesOfDirection = (d: Node) => targetsOf(d.node_id, 'direction_feeds_theme');
export const papersOfDirection = (d: Node) => sourcesOf(d.node_id, 'paper_in_direction');
export const rqsOfTheme = (t: Node) => sourcesOf(t.node_id, 'rq_under_theme');
export const experimentsOfRq = (rq: Node) => sourcesOf(rq.node_id, 'experiment_answers_rq');
export const reportsAbout = (n: Node) => sourcesOf(n.node_id, 'report_about');

export const STATUS_ORDER: Status[] = ['候选', '准备中', '有开发观察', '正式结论'];

// ---- R's later deliverables (2026-10-25): lineage, stories, paper→theme, trilingual copy ----
export interface LineageEdge extends Edge {
  claim: string;
  limitation: string | null;
  confidence: 'stated' | 'inferred';
}
export interface Story {
  story_id: string;
  theme: string;
  title: string;
  title_ja: string | null;
  core_papers: string[];
  steps: { node_id: string; caption: string; depth: number }[];
}
export interface PaperTheme { node_id: string; themes: string[] }
export interface CopyRow { key: string; ja: string; zh: string; en: string }

export const lineage: LineageEdge[] = readJsonl<LineageEdge>('lineage.jsonl');
export const stories: Story[] = readJsonl<Story>('stories.jsonl');

// R's Japanese sidecars (batch 3, 2026-10-25): never edit the originals, merge at load time.
interface NodeJa { node_id: string; one_line_ja?: string; title_ja?: string }
interface StoryJa { story_id: string; title_ja?: string; steps: { step_index: number; node_id: string; caption_ja?: string }[] }
const nodeJa = new Map(readJsonl<NodeJa>('nodes.ja.jsonl').map((r) => [r.node_id, r]));
const storyJa = new Map(readJsonl<StoryJa>('stories.ja.jsonl').map((r) => [r.story_id, r]));
for (const n of nodes) {
  const j = nodeJa.get(n.node_id);
  if (editorialJa.titles[n.node_id]) n.title_ja = editorialJa.titles[n.node_id];
  else if (j?.title_ja && !n.title_ja) n.title_ja = j.title_ja;
}
/** Story title / step caption in the page language: ja and en pages show R's Japanese, zh shows the original. */
export const storyTitle = (s: Story, lang: 'ja' | 'zh' | 'en') => {
  if (lang === 'ja' && editorialJa.stories[s.story_id]) return { text: editorialJa.stories[s.story_id].title, lang: 'ja' };
  return lang === 'zh' ? { text: s.title, lang: 'zh' } : { text: storyJa.get(s.story_id)?.title_ja || s.title_ja || s.title, lang: storyJa.get(s.story_id)?.title_ja || s.title_ja ? 'ja' : 'zh' };
};
export const stepCaption = (s: Story, i: number, lang: 'ja' | 'zh' | 'en') => {
  if (lang === 'ja') {
    const edited = editorialJa.stories[s.story_id]?.steps[s.steps[i].node_id];
    if (edited) return { text: edited, lang: 'ja' };
  }
  const ja = storyJa.get(s.story_id)?.steps.find((x) => x.step_index === i)?.caption_ja;
  return lang === 'zh' || !ja ? { text: s.steps[i].caption, lang: 'zh' } : { text: ja, lang: 'ja' };
};
const oneLineJa = (n: Node) => nodeJa.get(n.node_id)?.one_line_ja;
export const paperThemes: PaperTheme[] = readJsonl<PaperTheme>('paper-themes.jsonl');
const copyRows: CopyRow[] = readJsonl<CopyRow>('copy.jsonl');
const copyMap = new Map(copyRows.map((r) => [r.key, r]));

/** Trilingual copy from R's copy.jsonl; falls back to zh, then ''. */
export function copyOf(key: string, lang: 'ja' | 'zh' | 'en'): string {
  if (lang === 'ja' && editorialJa.copy[key]) return editorialJa.copy[key];
  const r = copyMap.get(key);
  if (!r) return '';
  return (r[lang] && r[lang].trim()) || r.zh || '';
}
/** one_line for a node in the requested language (R translated all 130). */
export const oneLine = (n: Node, lang: 'ja' | 'zh' | 'en') => copyOf(`node.${n.node_id}.one_line`, lang) || (lang !== 'zh' && oneLineJa(n)) || cleanOneLine(n.one_line);

export const storiesOfTheme = (t: Node) => stories.filter((s) => s.theme === t.node_id);
export const papersOfTheme = (t: Node) =>
  paperThemes.filter((p) => p.themes.includes(t.node_id)).map((p) => byId.get(p.node_id)).filter((n): n is Node => Boolean(n));
export const lineageFrom = (id: string) => lineage.filter((e) => e.from === id);
export const lineageTo = (id: string) => lineage.filter((e) => e.to === id);

export const counts = {
  papers: papers.length,
  directions: directions.length,
  routes: routes.length,
  themes: themes.length,
  rqs: ofType('rq').length,
  experiments: ofType('experiment').length,
  reports: ofType('report').length,
  edges: edges.length,
  formal: nodes.filter((n) => n.status === '正式结论').length,
};
