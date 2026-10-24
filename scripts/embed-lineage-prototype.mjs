// Derive embeddable assets from GPT's standalone prototype without touching the originals.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve(process.env.LINEAGE_PROTOTYPE_DIR ?? '_private/prototype-lineage');
const outputDir = resolve(process.cwd(), 'public/prototype-lineage');
const html = readFileSync(resolve(dir, 'index.html'), 'utf8');

// ---- 1. CSS: keep component rules, drop page-level ones that would collide with the site layout.
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const DROP = /^(:root|\*|html|body|h1,h2|h1\b|\.wrap|\.site-head|\.site-footer|\.hero|\.brand|\.mark|\.header-|\.preferences|\.skip|\.sr-only|\.prototype-|a\b|a:|button\b|button:|select\b|::selection|:focus-visible)/;
function splitRules(src) {
  const out = []; let depth = 0, start = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { out.push(src.slice(start, i + 1).trim()); start = i + 1; } }
  }
  return out.filter(Boolean);
}
function filterRules(src) {
  return splitRules(src).map((rule) => {
    const sel = rule.slice(0, rule.indexOf('{')).trim();
    if (sel.startsWith('@media')) {
      const inner = rule.slice(rule.indexOf('{') + 1, rule.lastIndexOf('}'));
      const kept = filterRules(inner);
      return kept ? `${sel}{${kept}}` : '';
    }
    if (sel.startsWith('@')) return rule; // keyframes etc.
    const selectors = sel.split(',').map((s) => s.trim()).filter((s) => !DROP.test(s));
    if (!selectors.length) return '';
    return `${selectors.join(',')}${rule.slice(rule.indexOf('{'))}`;
  }).filter(Boolean).join('\n');
}
let embedCss = filterRules(css);
// scope the whole component so nothing leaks; prefix every top-level selector (not @-rules)
embedCss = splitRules(embedCss).map((rule) => {
  if (rule.startsWith('@media')) {
    const sel = rule.slice(0, rule.indexOf('{'));
    const inner = rule.slice(rule.indexOf('{') + 1, rule.lastIndexOf('}'));
    return `${sel}{${scope(inner)}}`;
  }
  if (rule.startsWith('@')) return rule;
  return scope(rule);
}).join('\n');
function scope(rules) {
  return splitRules(rules).map((rule) => {
    const sel = rule.slice(0, rule.indexOf('{')).trim();
    const body = rule.slice(rule.indexOf('{'));
    return sel.split(',').map((s) => `#lineage-map ${s.trim()}`).join(',') + body;
  }).join('\n');
}
// theme / edge tokens live on :root in the site layout; the component relies on them
writeFileSync(resolve(outputDir, 'map.embed.css'), `/* generated from index.html by embed-proto.mjs — do not edit by hand */\n#lineage-map{font-size:14px;line-height:1.75}\n${embedCss}\n`);

// ---- 2. Markup: the app body without the standalone header / hero / footer.
const main = html.match(/<main id="app"[^>]*>([\s\S]*?)<\/main>/)[1];
const body = main.slice(main.indexOf('<div class="workspace-head">'));
writeFileSync(resolve(process.cwd(), 'src/components/lineage-map.html'), body.trim() + '\n');

// ---- 3. Script: defensive copy for embedding (no header controls, absolute data path, site language).
let js = readFileSync(resolve(dir, 'map.js'), 'utf8');
const rep = (a, b) => { if (!js.includes(a)) throw new Error('pattern not found: ' + a.slice(0, 60)); js = js.replace(a, b); };
rep("$('intro-copy').textContent=sourceCopy('research.question'); $('intro-copy').lang='ja';", "if($('intro-copy')){$('intro-copy').textContent=sourceCopy('research.question'); $('intro-copy').lang='ja';}");
rep("$('lang').setAttribute('aria-label',t('language'));", "$('lang')?.setAttribute('aria-label',t('language'));");
rep("$('theme-mode').setAttribute('aria-label',t('appearance'));", "$('theme-mode')?.setAttribute('aria-label',t('appearance'));");
rep("$('lang').addEventListener('change',", "$('lang')?.addEventListener('change',");
rep("$('theme-mode').addEventListener('change',", "$('theme-mode')?.addEventListener('change',");
rep("const state = {lang:'ja',", "const state = {lang:(document.documentElement.lang||'ja').startsWith('zh')?'zh':(document.documentElement.lang||'ja').startsWith('en')?'en':'ja',");
rep("fetch('./layout.json')", "fetch('/prototype-lineage/layout.json')");
rep("document.title=`${t('researchMap')} — Structure proof`;", "/* document.title is owned by the page */");
// piecewise year axis: use meta.xDomain / meta.xRange when the layout provides them
rep("const scale=d3.scaleLinear().domain(data.meta.yearDomain).range([data.meta.plot.left,data.meta.plot.right]);",
    "const scale=d3.scaleLinear().domain(data.meta.xDomain||data.meta.yearDomain).range(data.meta.xRange||[data.meta.plot.left,data.meta.plot.right]);");
rep("const ticks=[...new Set([data.meta.yearDomain[0],...d3.ticks(...data.meta.yearDomain,5),data.meta.yearDomain[1]])];",
    "const ticks=data.meta.xTicks||[...new Set([data.meta.yearDomain[0],...d3.ticks(...data.meta.yearDomain,5),data.meta.yearDomain[1]])];");
writeFileSync(resolve(outputDir, 'map.embed.js'), js);
console.log('ok', embedCss.length, body.length, js.length);
