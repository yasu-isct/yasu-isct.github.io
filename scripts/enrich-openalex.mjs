// Enrich the 65 paper nodes with OpenAlex metadata (year, citation count, references)
// and derive the real citation edges among them. Read-only against R's data;
// writes data/research-map/openalex.jsonl and data/research-map/citations.jsonl.
// Run from site/: node scripts/enrich-openalex.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.cwd(), 'data/research-map');
const nodes = readFileSync(resolve(dir, 'nodes.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const papers = nodes.filter((n) => n.object_type === 'paper');
const API = 'https://api.openalex.org';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'portfolio-research-map/0.1' } });
    if (res.status === 404) return null;
    if (res.status === 429 || res.status >= 500) throw new Error(`${res.status}`);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.json();
  } catch (e) {
    // transient network / rate-limit errors: back off and retry a couple of times
    if (attempt < 3 && !/^4\d\d https/.test(String(e.message))) {
      await sleep(800 * attempt);
      return getJson(url, attempt + 1);
    }
    throw e;
  }
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// OpenAlex's search endpoint rejects some punctuation ("?" / ":" produce 400); search on words only.
const q = (s) => encodeURIComponent(s.replace(/[?:"'()\[\]{}!]/g, ' ').replace(/\s+/g, ' ').trim());

async function lookup(p) {
  const doi = p.bib?.identifiers?.doi?.[0];
  const arxiv = p.bib?.identifiers?.arxiv?.[0];
  if (doi) {
    const w = await getJson(`${API}/works/https://doi.org/${encodeURIComponent(doi)}`);
    if (w) return { work: w, via: 'doi' };
  }
  if (arxiv) {
    const r = await getJson(`${API}/works?filter=ids.openalex:null,locations.landing_page_url:https://arxiv.org/abs/${arxiv}&per-page=1`).catch(() => null);
    const hit = r?.results?.[0];
    if (hit) return { work: hit, via: 'arxiv' };
    const r2 = await getJson(`${API}/works?search=${q(p.title)}&per-page=3`);
    const best = r2?.results?.find((w) => norm(w.title ?? w.display_name ?? '') === norm(p.title)) ?? r2?.results?.[0];
    if (best) return { work: best, via: 'arxiv-title' };
  }
  const r3 = await getJson(`${API}/works?search=${q(p.title)}&per-page=3`);
  const best = r3?.results?.find((w) => norm(w.title ?? w.display_name ?? '') === norm(p.title));
  if (best) return { work: best, via: 'title-exact' };
  return null;
}

const out = [];
for (const p of papers) {
  let rec = { node_id: p.node_id, title: p.title, openalex_id: null, via: null, year: null, cited_by_count: null, referenced_works: [], match_title: null };
  try {
    const hit = await lookup(p);
    if (hit) {
      const w = hit.work;
      rec = {
        ...rec,
        openalex_id: w.id?.replace('https://openalex.org/', '') ?? null,
        via: hit.via,
        year: w.publication_year ?? null,
        cited_by_count: w.cited_by_count ?? null,
        referenced_works: (w.referenced_works ?? []).map((u) => u.replace('https://openalex.org/', '')),
        match_title: w.title ?? w.display_name ?? null,
      };
    }
  } catch (e) {
    rec.error = String(e.message ?? e);
  }
  out.push(rec);
  console.log(`${p.node_id.padEnd(18)} ${rec.via ?? 'MISS'}  ${rec.year ?? '-'}  cites=${rec.cited_by_count ?? '-'}  refs=${rec.referenced_works.length}  ${rec.error ?? ''}`);
  await sleep(120);
}
writeFileSync(resolve(dir, 'openalex.jsonl'), out.map((r) => JSON.stringify(r)).join('\n') + '\n');

// Derive citation edges among the 65 papers.
const byOa = new Map(out.filter((r) => r.openalex_id).map((r) => [r.openalex_id, r.node_id]));
const cites = [];
for (const r of out) {
  for (const ref of r.referenced_works) {
    const to = byOa.get(ref);
    if (to && to !== r.node_id) {
      cites.push({ edge_id: `openalex:${r.node_id.split(':')[1]}->${to.split(':')[1]}`, from: r.node_id, to, relation_type: 'cites_openalex', source: 'openalex', fetched_at: new Date().toISOString().slice(0, 10), public: false });
    }
  }
}
writeFileSync(resolve(dir, 'citations.jsonl'), cites.map((e) => JSON.stringify(e)).join('\n') + '\n');
const matched = out.filter((r) => r.openalex_id).length;
console.log(`\nmatched ${matched}/${papers.length}; citation edges among them: ${cites.length}`);
console.log('unmatched:', out.filter((r) => !r.openalex_id).map((r) => r.node_id.split(':')[1]).join(' '));
