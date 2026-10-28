// Display labels per language for the map nodes.
// R's data has: directions.title (zh) + title_ja; themes.title (en) + title_ja; routes.title (en) + title_ja.
// The missing cells are filled here with short display labels so the map reads in all three
// languages. These are UI labels only — the research definitions stay in R's files.
import type { Lang } from '../i18n/ui';
import type { Node } from './research';

const directionEn: Record<string, string> = {
  D01: 'Font & parsing accuracy',
  D02: 'Typography, hierarchy & relations',
  D03: 'Font & VLM reading',
  D04: 'Font & visual retrieval stability',
  D05: 'Typographic semantics & evidence validity',
  D06: 'Typography-guided evidence use',
  D07: 'Font & visual input budget',
};
const themeZh: Record<string, string> = {
  T01: '文本/结构 RAG 中证据的语义与结构保真',
  T02: '视觉文本理解失败的机制分解',
  T03: '页面级视觉检索对排版变化的稳定性',
  T04: '被动排版与证据取舍',
};
const routeZh: Record<string, string> = {
  ROUTE_A: '路线 A — 文本/结构 RAG',
  ROUTE_B: '路线 B — 视觉 RAG',
};

const local = (n: Node) => n.node_id.slice(n.node_id.indexOf(':') + 1);
const stripPrefix = (s: string) => s.replace(/^(D0\d|T0\d|Theme \d|Route [AB]|ルート[AB]|テーマ\d|路线 [AB])\s*[—\-–]?\s*/u, '');

/** Short label without the id prefix; the id is rendered separately. */
export function label(n: Node, lang: Lang): string {
  const id = local(n);
  if (n.object_type === 'direction') {
    if (lang === 'ja' && n.title_ja) return stripPrefix(n.title_ja);
    if (lang === 'en') return directionEn[id] ?? stripPrefix(n.title);
    return stripPrefix(n.title);
  }
  if (n.object_type === 'theme') {
    if (lang === 'ja' && n.title_ja) return stripPrefix(n.title_ja);
    if (lang === 'zh') return themeZh[id] ?? stripPrefix(n.title);
    return stripPrefix(n.title);
  }
  if (n.object_type === 'route') {
    if (lang === 'ja' && n.title_ja) return stripPrefix(n.title_ja);
    if (lang === 'zh') return stripPrefix(routeZh[id] ?? n.title);
    return stripPrefix(n.title);
  }
  return lang === 'ja' && n.title_ja ? n.title_ja : n.title;
}

/** Display id: D01, T01, Route A … */
export function shortId(n: Node, lang: Lang): string {
  const id = local(n);
  if (n.object_type === 'route') return lang === 'ja' ? `ルート${id.slice(-1)}` : lang === 'zh' ? `路线 ${id.slice(-1)}` : `Route ${id.slice(-1)}`;
  if (n.object_type === 'theme') return id.replace('T0', 'T');
  return id;
}
