/* Pure D3 rendering. All node positions are read from layout.json; no simulation runs here. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const labels = {
    ja: {
      skip:'マップへ移動', researchMap:'研究マップ', prototype:'LOCAL PROTOTYPE', language:'言語', appearance:'配色', system:'システム', light:'ライト', dark:'ダーク',
      eyebrow:'RESEARCH ATLAS / 01', title:'研究のつながりを、たどる。', intro:'文献から問いへ、4つのテーマを年代と根拠からたどります。', mapTab:'A + C　テーマと年代', storyTab:'B　読む順序をたどる',
      search:'論文・問い・実験を検索', reset:'選択を解除', citations:'実際の引用を表示', expandAll:'すべて展開', collapseAll:'すべて折りたたむ', figureTitle:'4つのテーマ、文献から問いへ', paper:'論文', rq:'研究の問い', experiment:'実験', extends:'設定・方法の拡張', addresses:'限界への対処', contrasts:'対照する方法',
      yearHint:'出版年（OpenAlex を優先）', mapHint:'テーマの帯を選ぶと展開します。主幹は{trunk}件です。その他の関係はノードから1〜2段階たどれます。', fit:'全体を表示', theme:'テーマ', story:'分岐', prev:'前へ', next:'次へ', play:'自動再生', pause:'一時停止', readingOrder:'読む順序', corePapers:'先に読む文献', depth:'たどる深さ', upstream:'上流', downstream:'下流', reachableRqs:'この先にある問い', edgeEvidence:'関係の説明と根拠', sources:'出典', close:'閉じる', internal:'内部用の研究資料', footer:'問いの準備状況や開発段階の観察も含め、各記録の状態を表示しています。',
      unknownYear:'年未登録', undated:'日付なし', rqColumn:'問い', expColumn:'実験', density:'論文密度', expand:'展開', collapse:'折りたたむ', nodes:'ノード', lineage:'展開の関係', citationsCount:'引用', noResults:'一致するノードがありません。', noNeighbors:'この範囲には関係がありません。', noRq:'既存の有向関係から到達できる問いはありません。', original:'日本語の説明', claim:'関係の説明', limitation:'この関係の限界', confidence:'記述の根拠', notRecorded:'記載なし', stated:'stated · 文献カードに明記', inferred:'inferred · 記述の対応から推定', confidenceNote:'原論文や歴史的な影響関係を検証したことは意味しません。', association:'実験 → 問い（回答の計画・開発診断）', motivates:'問いの動機', originalDirection:'原関係の方向', chronology:'つながりは問題の展開を示し、出版順や因果関係を保証するものではありません。', reverseReading:'この箇所は原関係を逆向きに読む順序です。実験 → 問いを保持します。', storyNote:'読む順序は、研究上の因果関係ではありません。短い分岐も、現存する関係だけで表示します。', yearBasis:'年の出典', citedBy:'引用数', unavailable:'未取得', bib:'書誌情報', noDateNote:'問い・実験には出版年を割り当てず、独立した欄に置きます。', searchOutside:'このノードにはテーマ内の配置がありません。既存の関係を下で確認できます。', generation:'段階', candidate:'候補', preparation:'準備中', observation:'開発段階の観察あり', conclusion:'正式な結論', unassigned:'状態未設定', selected:'選択中', readingCaption:'各ステップは、原資料に基づく日本語の説明です。', sizeNote:'点の半径は引用数の log(1+n) に応じて4〜18 px としています。未取得は最小径で示します。', duplicateNote:'細い破線は、複数テーマに現れる同じ論文です。', step:'ステップ', ready:'マップを読み込みました', loadError:'研究マップを読み込めませんでした。ページを再読み込みしてください。', extraBranch:'別の分岐', allNodes:'全ノード', sourceCopy:'研究紹介',
    },
    zh: {
      skip:'跳到地图',researchMap:'研究地图',prototype:'本地原型',language:'语言',appearance:'配色',system:'跟随系统',light:'浅色',dark:'深色',eyebrow:'RESEARCH ATLAS / 01',title:'沿着线索，读懂研究。',intro:'从文献到问题，按年份与证据阅读四个主题。',mapTab:'A + C　主题与来路',storyTab:'B　逐步阅读故事',search:'搜索论文、问题、实验',reset:'清除选择',citations:'显示真实引用',expandAll:'全部展开',collapseAll:'全部折叠',figureTitle:'四个主题，从文献走向问题',paper:'论文',rq:'研究问题',experiment:'实验',extends:'设定／方法扩展',addresses:'回应局限',contrasts:'方法对照',yearHint:'出版年 / 优先 OpenAlex',mapHint:'点击色带展开；默认选中 12 条主干关系，其余从节点展开 1–2 代。',fit:'显示全图',theme:'主题',story:'分支',prev:'上一步',next:'下一步',play:'自动播放',pause:'暂停',readingOrder:'阅读顺序',corePapers:'建议先读',depth:'展开代数',upstream:'上游',downstream:'下游',reachableRqs:'最终通往哪个 RQ',edgeEvidence:'关系解释与证据',sources:'来源',close:'关闭',internal:'内部研究资料',footer:'包含临时问题和开发观察，目前没有正式结论。',unknownYear:'年份未登记',undated:'无日期',rqColumn:'问题',expColumn:'实验',density:'论文密度',expand:'展开',collapse:'折叠',nodes:'节点',lineage:'推进关系',citationsCount:'引用',noResults:'没有匹配节点',noNeighbors:'此范围内没有关系',noRq:'沿已有有向关系未找到可达 RQ',original:'中文原文',claim:'claim / 关系说明',limitation:'limitation / 局限',confidence:'confidence / 依据类型',notRecorded:'未记录',stated:'stated · 卡片明说',inferred:'inferred · 对应推断',confidenceNote:'不表示原论文或历史影响已核实。',association:'实验 → RQ（拟回答／开发诊断）',motivates:'引出问题',originalDirection:'原关系方向',chronology:'关系表示问题衔接，不能保证发表先后或因果。',reverseReading:'此步按原关系的反向顺序阅读，保留实验 → RQ。',storyNote:'四主题、五分支。阅读顺序不是因果关系，短故事也只使用已有连接。',yearBasis:'年份依据',citedBy:'被引次数',unavailable:'未取得',bib:'书目信息',noDateNote:'问题和实验未分配出版年，放在独立栏内。',searchOutside:'此节点无主题内位置，可在下方查看已有关系。',generation:'代',candidate:'候选',preparation:'准备中',observation:'有开发观察',conclusion:'正式结论',unassigned:'未设状态',selected:'已选',readingCaption:'每步说明保留数据中的中文原文。',sizeNote:'节点半径：引用数 log(1+n)，4–18px；缺失取最小径。',duplicateNote:'细虚线连接跨主题重复出现的同一论文。',step:'步骤',ready:'地图已载入',loadError:'载入失败，请通过 HTTP 服务器打开并检查 D3 与 layout.json。',extraBranch:'另一分支',allNodes:'全部节点',sourceCopy:'研究介绍',
    },
    en: {
      skip:'Skip to map',researchMap:'Research map',prototype:'LOCAL PROTOTYPE',language:'Language',appearance:'Appearance',system:'System',light:'Light',dark:'Dark',eyebrow:'RESEARCH ATLAS / 01',title:'Follow the research thread.',intro:'From papers to questions, across four themes and their evidence.',mapTab:'A + C　Themes & lineage',storyTab:'B　Read a story',search:'Search papers, questions, experiments',reset:'Clear selection',citations:'Show real citations',expandAll:'Expand all',collapseAll:'Collapse all',figureTitle:'Four themes, from papers to questions',paper:'Paper',rq:'Research question',experiment:'Experiment',extends:'Extends a setting / method',addresses:'Addresses a limitation',contrasts:'Contrasting methods',yearHint:'Publication year / OpenAlex first',mapHint:'Expand a band to reveal its nodes and 12 selected trunk links. Select a node to follow 1–2 generations.',fit:'Fit map',theme:'Theme',story:'Branch',prev:'Previous',next:'Next',play:'Play',pause:'Pause',readingOrder:'Reading order',corePapers:'Read first',depth:'BFS depth',upstream:'Upstream',downstream:'Downstream',reachableRqs:'Reachable research questions',edgeEvidence:'Claims & evidence',sources:'Sources',close:'Close',internal:'Internal research materials',footer:'Includes provisional questions and development observations. There are no formal conclusions yet.',unknownYear:'Year unavailable',undated:'Undated',rqColumn:'Questions',expColumn:'Experiments',density:'Paper density',expand:'Expand',collapse:'Collapse',nodes:'nodes',lineage:'lineage links',citationsCount:'citations',noResults:'No matching nodes',noNeighbors:'No links within this depth',noRq:'No RQ is reachable through existing directed links',original:'Chinese source text',claim:'Claim',limitation:'Limitation',confidence:'Confidence',notRecorded:'Not recorded',stated:'stated · explicit in a card',inferred:'inferred · mapped from descriptions',confidenceNote:'These labels do not verify original papers or historical influence.',association:'Experiment → RQ (planned answer / development diagnosis)',motivates:'Motivates a question',originalDirection:'Original direction',chronology:'Links describe conceptual development; publication order and causation are not guaranteed.',reverseReading:'This step reads the original link in reverse. The experiment → RQ relation is retained.',storyNote:'Four themes, five branches. Reading order is not causation. Short stories use only existing links.',yearBasis:'Year source',citedBy:'Cited by',unavailable:'Unavailable',bib:'Bibliography',noDateNote:'Questions and experiments occupy separate undated columns.',searchOutside:'This node has no theme position. Its existing relations are shown below.',generation:'generation',candidate:'Candidate',preparation:'In preparation',observation:'Development observations',conclusion:'Formal conclusion',unassigned:'No status assigned',selected:'Selected',readingCaption:'Step captions retain the provided Chinese text.',sizeNote:'Radius: log(1+citation count), 4–18px. Missing counts use the minimum.',duplicateNote:'Fine dashed lines connect the same paper across themes.',step:'Step',ready:'Research map loaded',loadError:'Could not load. Open with an HTTP server and check D3 and layout.json.',extraBranch:'Another branch',allNodes:'All nodes',sourceCopy:'Research introduction',
    },
  };
  let data, nodes, copies, allEdges, incoming, outgoing, svg, world, zoom, positions = [], chartHeight = 520;
  const state = {lang:(document.documentElement.lang||'ja').startsWith('zh')?'zh':(document.documentElement.lang||'ja').startsWith('en')?'en':'ja',view:'map',expanded:new Set(),selected:null,selectedTheme:null,depth:1,storyId:null,step:0,citations:true,playing:false};
  let timer;
  const t = key => (labels[state.lang][key] ?? labels.ja[key] ?? key).replace('{trunk}', String(data?.trunkEdgeIds?.length ?? ''));
  const sourceCopy = key => copies?.get(key)?.ja ?? '';
  const fullName = node => node?.object_type === 'paper' ? node.title || node.node_id : node?.title_ja || node?.title || node?.node_id || '';
  const shortId = id => id.split(':').slice(1).join(':');
  const themeCode = id => id?.split(':').at(-1) || '';
  const themeColor = id => `var(--${themeCode(id).toLowerCase()}, ${['#2166b5','#267b70','#9b772e','#ad6151'][Number(themeCode(id).slice(1))-1] || '#2166b5'})`;
  const statusText = status => t(({'候选':'candidate','准备中':'preparation','有开发观察':'observation','正式结论':'conclusion'})[status] || 'unassigned');
  const typeName = node => ({ja:{direction:'研究方向',route:'研究ルート',theme:'テーマ',report:'報告'},zh:{direction:'方向',route:'路线',theme:'主题',report:'报告'},en:{direction:'Direction',route:'Route',theme:'Theme',report:'Report'}})[state.lang][node.object_type] || t(({paper:'paper',rq:'rq',experiment:'experiment'})[node.object_type] || node.object_type);
  const selectedStory = () => data.stories.find(s=>s.story_id===state.storyId) || data.stories[0];
  const el = (tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!=null)n.textContent=text; return n; };
  const empty = (container, text) => { container.replaceChildren(el('p','empty',text)); };
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function translate() {
    document.documentElement.lang = state.lang==='zh'?'zh-CN':state.lang;
    document.querySelectorAll('[data-i18n]').forEach(e=>{const key=e.dataset.i18n;e.textContent=t(key).replace(key==='mapTab'?/^A \+ C\s*/:key==='storyTab'?/^B\s*/:/$^/,'');});
    $('search').placeholder=t('search'); $('search').setAttribute('aria-label',t('search'));
    if($('intro-copy')){$('intro-copy').textContent=sourceCopy('research.question'); $('intro-copy').lang='ja';}
    $('expand-all').textContent=t(state.expanded.size===data.themes.length?'collapseAll':'expandAll');
    $('map-hint').textContent=`${t('mapHint')} ${t('sizeNote')} ${t('duplicateNote')} ${t('chronology')}`;
    $('story-note').textContent=`${t('storyNote')} ${t('readingCaption')}`;
    $('stats').textContent=state.lang==='ja'?`文献${data.nodes.filter(n=>n.object_type==='paper').length}件 / ${data.themes.length}テーマ / 展開の関係${data.lineage.length}件 / 引用関係${data.citations.length}件`:`${data.nodes.filter(n=>n.object_type==='paper').length} ${t('paper')} / ${data.themes.length} ${t('theme')} / ${data.lineage.length} ${t('lineage')} / ${data.citations.length} ${t('citationsCount')}`;
    $('story-play').textContent=t(state.playing?'pause':'play');
    $('chart').setAttribute('aria-label',t('figureTitle'));
    $('detail-close').setAttribute('aria-label',t('close'));
    $('lang')?.setAttribute('aria-label',t('language'));
    $('theme-mode')?.setAttribute('aria-label',t('appearance'));
    $('chart-title').textContent=t('figureTitle');
    $('chart-description').textContent=`${t('mapHint')} ${t('noDateNote')}`;
    /* document.title is owned by the page */
  }

  function indexEdges() {
    allEdges=[...data.lineage,...data.associations]; incoming=new Map();outgoing=new Map();
    allEdges.forEach(e=>{if(!incoming.has(e.to))incoming.set(e.to,[]);incoming.get(e.to).push(e);if(!outgoing.has(e.from))outgoing.set(e.from,[]);outgoing.get(e.from).push(e);});
  }
  // Directed BFS uses the original endpoints. Organizational and citation links are never traversed.
  function bfs(id, direction, depth=state.depth) {
    const adjacency=direction==='upstream'?incoming:outgoing, seen=new Set([id]), found=[], edges=new Map();let frontier=[id];
    for(let generation=1;generation<=depth && frontier.length;generation++){
      const next=[];
      for(const current of frontier)for(const edge of adjacency.get(current)||[]){
        edges.set(edge.edge_id,edge);const nextId=direction==='upstream'?edge.from:edge.to;
        if(!seen.has(nextId)){seen.add(nextId);found.push({node_id:nextId,generation});next.push(nextId);}
      }
      frontier=next;
    }
    return {nodes:found,edges:[...edges.values()]};
  }
  function reachableRqs(id) {
    const seen=new Set([id]),queue=[id],rqs=[];
    while(queue.length){const current=queue.shift();if(nodes.get(current)?.object_type==='rq')rqs.push(current);for(const edge of outgoing.get(current)||[])if(!seen.has(edge.to)){seen.add(edge.to);queue.push(edge.to);}}
    return rqs;
  }
  function highlightedEdges() {
    if(state.view==='stories')return new Set(selectedStory().stepLinks.map(l=>l.edge_id));
    if(state.selected)return new Set([...bfs(state.selected,'upstream').edges,...bfs(state.selected,'downstream').edges].map(e=>e.edge_id));
    return new Set(data.trunkEdgeIds);
  }
  function relevantNodes() {
    if(state.view==='stories')return new Set(selectedStory().steps.map(s=>s.node_id));
    if(state.selected)return new Set([state.selected,...bfs(state.selected,'upstream').nodes.map(n=>n.node_id),...bfs(state.selected,'downstream').nodes.map(n=>n.node_id)]);
    return null;
  }
  function expandFor(id, preferredTheme) {
    let matching=data.themes.filter(theme=>theme.instances.some(i=>i.node_id===id));
    if(state.view==='stories')matching=matching.filter(theme=>theme.node_id===selectedStory().theme);
    matching.forEach(theme=>state.expanded.add(theme.node_id));
    state.selectedTheme=preferredTheme || matching[0]?.node_id || null;
    return matching.length>0;
  }
  function selectNode(id, theme, options={}) {
    if(!nodes.has(id))return;
    state.selected=id;const placed=expandFor(id,theme);
    render(); renderDetail(); $('search-results').replaceChildren();
    $('status').textContent=placed?`${t('selected')}: ${fullName(nodes.get(id))}`:t('searchOutside');
    if(options.focus!==false){$('detail').scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'nearest'});$('detail-title').focus({preventScroll:true});}
  }
  function clearSelection(){const back=state.selectedTheme;state.selected=null;state.selectedTheme=null;$('detail').hidden=true;render();$('status').textContent=t('ready');(back&&$('lane-controls').querySelector('[data-theme="'+back+'"]')||$('lane-controls').querySelector('button'))?.focus();}

  function renderLaneControls() {
    const controls=$('lane-controls');controls.replaceChildren();
    for(const theme of data.themes){
      const open=state.expanded.has(theme.node_id),button=el('button','lane-button');button.type='button';button.dataset.theme=theme.node_id;button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-controls','chart');button.style.setProperty('--theme-color',themeColor(theme.node_id));
      button.append(el('span','lane-code',`${open?'−':'+'} ${themeCode(theme.node_id)}`),el('span','lane-name',fullName(nodes.get(theme.node_id)).replace(/^テーマ\d\s*[—–-]\s*/,'')),el('span','lane-count',`${theme.paperIds.length} ${t('paper')}`),el('span','lane-status',statusText(theme.status)));
      button.addEventListener('click',()=>{if(open)state.expanded.delete(theme.node_id);else state.expanded.add(theme.node_id);if(state.view==='stories')setView('map');else render(true);controls.querySelector('[data-theme="'+theme.node_id+'"]')?.focus();});controls.append(button);
    }
  }
  function computePositions() {
    positions=[];let y=58;
    for(const theme of data.themes){
      theme._top=y;theme._open=state.expanded.has(theme.node_id);theme._height=theme._open?theme.expandedHeight:(theme.collapsedHeight||data.meta.collapsedHeight||100);
      for(const instance of theme.instances){
        const node=nodes.get(instance.node_id);if(!theme._open&&node.object_type!=='paper')continue;
        positions.push({...instance,x:instance.x,y:y+(theme._open?instance.y:instance.collapsedY),node,theme:theme.node_id,expanded:theme._open});
      }
      y+=theme._height+14;
    }
    return y+30;
  }
  function edgePositions(edge, requireExpanded=true) {
    const candidatesA=positions.filter(p=>p.node_id===edge.from&&(!requireExpanded||p.expanded));
    const candidatesB=positions.filter(p=>p.node_id===edge.to&&(!requireExpanded||p.expanded));
    const preferred=state.view==='stories'?selectedStory().theme:state.selectedTheme;
    for(const theme of [preferred,...data.themes.map(s=>s.node_id)].filter(Boolean)){
      const a=candidatesA.find(p=>p.theme===theme),b=candidatesB.find(p=>p.theme===theme);if(a&&b)return[a,b];
    }
    if(candidatesA.length&&candidatesB.length)return[candidatesA[0],candidatesB[0]];
    return null;
  }
  const edgePath = ([a,b]) => {
    if(Math.abs(a.x-b.x)<1){const bend=36+Math.abs(a.y-b.y)*.2;return `M${a.x},${a.y} C${a.x-bend},${a.y} ${b.x-bend},${b.y} ${b.x},${b.y}`;}
    const mid=(a.x+b.x)/2;return `M${a.x},${a.y} C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`;
  };
  function styleEdge(path,edge) {
    const kind=edge.relation_type;
    path.attr('stroke',kind==='addresses_limitation'?'var(--edge-addresses)':kind==='contrasts'?'var(--edge-contrasts)':kind==='motivates_rq'?'var(--relation-rq, #80609a)':kind==='experiment_answers_rq'?'var(--muted)':'var(--accent)')
      .attr('stroke-width',kind==='addresses_limitation'?2.5:kind==='experiment_answers_rq'?1.5:1.8).attr('stroke-dasharray',kind==='contrasts'?'7 5':kind==='motivates_rq'?'2 4':kind==='experiment_answers_rq'?'3 4':null).attr('fill','none');
  }
  function renderGraph(resetZoom=false) {
    const totalHeight=computePositions();chartHeight=state.view==='stories'?Math.min(620,Math.max(460,totalHeight)):totalHeight;
    svg.attr('viewBox',`0 0 ${data.meta.width||1440} ${chartHeight}`);world.selectAll('*').remove();
    zoom.extent([[0,0],[1440,chartHeight]]).translateExtent([[-600,-totalHeight],[2040,totalHeight*2]]);
    const scale=d3.scaleLinear().domain(data.meta.xDomain||data.meta.yearDomain).range(data.meta.xRange||[data.meta.plot.left,data.meta.plot.right]);
    const ticks=data.meta.xTicks||[...new Set([data.meta.yearDomain[0],...d3.ticks(...data.meta.yearDomain,5),data.meta.yearDomain[1]])];
    const grid=world.append('g').attr('class','grid');
    for(const year of ticks){const x=scale(year);grid.append('line').attr('class','year-grid').attr('x1',x).attr('x2',x).attr('y1',42).attr('y2',totalHeight-20);grid.append('text').attr('class','year-label').attr('x',x).attr('y',23).attr('text-anchor','middle').text(year);}
    grid.append('text').attr('class','year-label').attr('x',18).attr('y',23).text(t('yearHint'));
    grid.append('line').attr('class','year-break').attr('x1',1175).attr('x2',1175).attr('y1',40).attr('y2',totalHeight-20).attr('stroke-dasharray','3 6');
    grid.append('text').attr('class','undated-label').attr('x',1300).attr('y',16).attr('text-anchor','middle').text(t('undated'));
    grid.append('text').attr('class','year-label').attr('x',1240).attr('y',37).attr('text-anchor','middle').text(t('rqColumn'));
    grid.append('text').attr('class','year-label').attr('x',1360).attr('y',37).attr('text-anchor','middle').text(t('expColumn'));
    for(const theme of data.themes){
      const band=world.append('g').attr('class','theme-band').attr('data-theme',theme.node_id);
      band.append('rect').attr('class','theme-fill').attr('x',0).attr('width',1440).attr('y',theme._top).attr('height',theme._height).attr('fill',themeColor(theme.node_id)).attr('fill-opacity',.035);
      band.append('line').attr('x1',0).attr('x2',1440).attr('y1',theme._top).attr('y2',theme._top).attr('class','lane-rule');
      band.append('rect').attr('x',0).attr('width',3).attr('y',theme._top+15).attr('height',theme._height-30).attr('fill',themeColor(theme.node_id));
      const label=band.append('g').attr('class','lane-label').attr('tabindex',0).attr('role','button').attr('aria-label',`${t(theme._open?'collapse':'expand')} ${themeCode(theme.node_id)}`).attr('aria-expanded',String(theme._open)).style('cursor','pointer');
      label.append('rect').attr('x',8).attr('y',theme._top+8).attr('width',280).attr('height',Math.min(theme._height-16,96)).attr('fill','transparent');
      label.append('text').attr('x',20).attr('y',theme._top+28).attr('fill',themeColor(theme.node_id)).attr('font-family','var(--mono)').attr('font-size',13).text(`${theme._open?'−':'+'} ${themeCode(theme.node_id)}  /  ${String(theme.paperIds.length).padStart(2,'0')}`);
      const name=fullName(nodes.get(theme.node_id)).replace(/^テーマ\d\s*[—–-]\s*/,'');
      const chunks=name.match(/.{1,17}/gu)||[name];chunks.slice(0,2).forEach((chunk,i)=>label.append('text').attr('x',20).attr('y',theme._top+51+i*19).attr('font-size',13).attr('fill','var(--text)').text(chunk));
      label.append('text').attr('x',20).attr('y',theme._top+91).attr('font-size',11).attr('fill','var(--muted)').text(statusText(theme.status));
      if(theme._open){
        const description=sourceCopy(`${themeCode(theme.node_id)}.direction`),lines=description.match(/.{1,22}/gu)||[],limit=Math.max(1,Math.floor((theme._height-142)/19));
        lines.slice(0,limit).forEach((line,i)=>band.append('text').attr('class','theme-description').attr('x',20).attr('y',theme._top+124+i*19).attr('font-size',11).attr('fill','var(--muted)').text(line+(i===limit-1&&lines.length>limit?'…':'')));
        band.append('title').text(description);
      }
      const toggle=()=>{if(theme._open)state.expanded.delete(theme.node_id);else state.expanded.add(theme.node_id);render(true);};label.on('click',toggle).on('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
    }
    const cited=world.append('g').attr('class','citations-layer').attr('aria-hidden','true');
    if(state.citations)for(const edge of data.citations){const p=edgePositions(edge,false);if(!p)continue;cited.append('path').attr('class','citation-edge').attr('data-edge-id',edge.edge_id).attr('d',edgePath(p)).attr('fill','none').attr('stroke','var(--muted)').attr('stroke-width',.8).attr('stroke-opacity',.15);}
    const duplicates=world.append('g').attr('class','duplicates-layer').attr('aria-hidden','true');
    for(const [id,instances] of d3.group(positions.filter(p=>p.expanded&&p.node.object_type==='paper'),p=>p.node_id)){
      for(let i=1;i<instances.length;i++)duplicates.append('path').attr('class','duplicate-edge').attr('data-node-id',id).attr('d',`M${instances[i-1].x},${instances[i-1].y}L${instances[i].x},${instances[i].y}`).attr('fill','none').attr('stroke',state.selected===id?'var(--accent)':'var(--muted)').attr('stroke-width',state.selected===id?1.3:.7).attr('stroke-dasharray','2 5').attr('stroke-opacity',state.selected===id?.75:.19);
    }
    const active=highlightedEdges(),relevant=relevantNodes(),lineageLayer=world.append('g').attr('class','lineage-layer');
    for(const edge of allEdges){if(!active.has(edge.edge_id))continue;const p=edgePositions(edge);if(!p)continue;const path=lineageLayer.append('path').attr('class',`lineage-edge ${edge.relation_type==='experiment_answers_rq'?'association-edge':''} ${edge.relation_type}`).attr('data-edge-id',edge.edge_id).attr('data-from',edge.from).attr('data-to',edge.to).attr('d',edgePath(p));styleEdge(path,edge);path.append('title').text(`${edge.from} → ${edge.to}\n${edge.claim||t('association')}`);}
    const nodeLayer=world.append('g').attr('class','nodes-layer');
    for(const p of positions){
      const n=p.node,r=p.expanded?(n.radius||p.radius||6):2,isSelected=n.node_id===state.selected,isRelevant=!relevant||relevant.has(n.node_id),isCore=data.stories.some(s=>s.theme===p.theme&&s.core_papers.includes(n.node_id));
      const g=nodeLayer.append('g').attr('class',`graph-node ${p.expanded?'expanded-node':'density-node'}${isSelected?' selected':''}`).attr('data-node-id',n.node_id).attr('data-theme',p.theme).attr('transform',`translate(${p.x},${p.y})`).attr('opacity',isRelevant?1:.34);
      if(isSelected)g.append('circle').attr('r',r+6).attr('fill','none').attr('stroke','var(--accent)').attr('stroke-width',1.5);
      if(n.object_type==='rq')g.append('path').attr('class','rq-node').attr('d',`M0,${-r*1.4} L${r*1.1},0 0,${r*1.4} ${-r*1.1},0Z`).attr('fill','var(--bg)').attr('stroke',themeColor(p.theme)).attr('stroke-width',1.8);
      else if(n.object_type==='experiment')g.append('rect').attr('class','experiment-node').attr('x',-r).attr('y',-r).attr('width',r*2).attr('height',r*2).attr('fill','var(--bg)').attr('stroke',themeColor(p.theme)).attr('stroke-width',1.7);
      else g.append('circle').attr('class','paper-node').attr('r',r).attr('fill',isCore||!p.expanded?themeColor(p.theme):'var(--bg)').attr('fill-opacity',isCore||!p.expanded?.85:1).style('stroke',themeColor(p.theme)).attr('stroke-width',1.3);
      if(p.expanded&&(isCore||isSelected||n.object_type!=='paper'||state.view==='stories'&&relevant?.has(n.node_id)))g.append('text').attr('class','node-label').attr('x',r+6).attr('y',4).attr('fill','var(--text)').attr('font-size',11).attr('font-family','var(--mono)').text(shortId(n.node_id));
      g.append('circle').attr('class','node-hit').attr('r',Math.max(r+5,13)).attr('fill','transparent').attr('role','button').attr('tabindex',0).attr('aria-label',`${fullName(n)}; ${n.year||t('undated')}; ${typeName(n)}`).attr('aria-pressed',String(isSelected)).style('cursor','pointer')
        .on('click',e=>{e.stopPropagation();selectNode(n.node_id,p.theme);})
        .on('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.node_id,p.theme);}})
        .on('pointerenter',e=>showTooltip(e,n)).on('pointermove',e=>positionTooltip(e)).on('pointerleave',hideTooltip).on('focus',e=>showTooltip(e,n)).on('blur',hideTooltip);
      g.append('title').text(`${fullName(n)}\n${n.year||t('undated')} · ${typeName(n)}`);
    }
    if(resetZoom)svg.call(zoom.transform,d3.zoomIdentity);
  }
  function positionTooltip(event){const tooltip=$('map-tooltip');const rect=event.target?.getBoundingClientRect();const x=event.clientX??rect?.left??12,y=event.clientY??rect?.top??12;tooltip.style.left=`${Math.max(8,Math.min(innerWidth-320,x+16))}px`;tooltip.style.top=`${Math.max(8,Math.min(innerHeight-tooltip.offsetHeight-8,y+14))}px`;}
  function showTooltip(event,node){const tooltip=$('map-tooltip');tooltip.replaceChildren(el('strong','',fullName(node)),el('span','',`${shortId(node.node_id)} · ${node.year||t('undated')} · ${node.object_type==='paper'?`${t('citedBy')}: ${node.citationMissing?t('unavailable'):node.cited_by_count??t('unavailable')}`:statusText(node.status)}`));tooltip.hidden=false;positionTooltip(event);}
  function hideTooltip(){$('map-tooltip').hidden=true;}
  function focusChain(animate=true) {
    const story=selectedStory(),ids=new Set(story.steps.map(s=>s.node_id)),chain=positions.filter(p=>p.theme===story.theme&&ids.has(p.node_id));if(!chain.length)return;
    const x0=d3.min(chain,p=>p.x)-50,x1=d3.max(chain,p=>p.x)+65,y0=d3.min(chain,p=>p.y)-48,y1=d3.max(chain,p=>p.y)+48;
    // Keep the complete current chain in view; current step is separately ringed and announced.
    const scale=Math.min(2.2,Math.max(.4,Math.min(1240/(x1-x0), (chartHeight-76)/(y1-y0))));
    const transform=d3.zoomIdentity.translate(720-scale*(x0+x1)/2,chartHeight/2-scale*(y0+y1)/2).scale(scale);
    const target=animate&&!reducedMotion()?svg.transition().duration(400):svg;target.call(zoom.transform,transform);
  }

  function nodeButton(id,extra='') {
    const node=nodes.get(id),button=el('button','node-button',`${shortId(id)}　${fullName(node)}${extra}`);button.type='button';button.dataset.nodeId=id;button.addEventListener('click',()=>selectNode(id));return button;
  }
  function renderNeighbors(container,result) {
    container.replaceChildren();if(!result.nodes.length){empty(container,t('noNeighbors'));return;}
    for(const item of result.nodes){const row=el('div','neighbor');row.append(el('span','tag',`${item.generation} ${t('generation')}`),nodeButton(item.node_id));container.append(row);}
  }
  function renderEdge(edge,container) {
    const article=el('article','evidence-edge');article.dataset.edgeId=edge.edge_id;
    const title=el('div','evidence-heading');title.append(el('span','tag',edge.relation_type),el('p','mono',`${shortId(edge.from)} → ${shortId(edge.to)}`));article.append(title);
    const grid=el('dl','evidence-grid');
    const claim=edge.claim||(edge.relation_type==='experiment_answers_rq'?t('association'):t('notRecorded'));
    const values=[[t('claim'),claim],[t('limitation'),edge.limitation||t('notRecorded')],[t('confidence'),edge.confidence?t(edge.confidence):t('notRecorded')]];
    for(const [label,value] of values){const block=el('div','');block.append(el('dt','',label),el('dd','',value));grid.append(block);}article.append(grid);
    if(edge.relation_type==='experiment_answers_rq')article.append(el('p','small',t('association')));
    else article.append(el('p','small',t('confidenceNote')));
    const origin=el('details','edge-origin');origin.append(el('summary','',`${t('sources')}${state.lang==='ja'?'（原資料・中国語を含む）':''} · ${edge.edge_id}`));
    for(const evidence of edge.evidence||[]){const paragraph=el('p','source-record');paragraph.textContent=[evidence.source_path,evidence.locator,evidence.quote,evidence.scope].filter(Boolean).join(' · ');origin.append(paragraph);}
    article.append(origin);container.append(article);
  }
  function renderDetail() {
    if(!state.selected){$('detail').hidden=true;return;}
    const node=nodes.get(state.selected);$('detail').hidden=false;$('detail-title').textContent=fullName(node);$('detail-title').tabIndex=-1;
    $('detail-id').textContent=node.node_id;$('detail-type').textContent=typeName(node);$('detail-summary').textContent=sourceCopy(`node.${node.node_id}.one_line`)||node.one_line||'';$('detail-summary').lang='ja';
    $('detail-status').textContent=node.status?statusText(node.status):node.object_type==='paper'?`${node.year||t('unknownYear')}  ·  ${t('citedBy')}: ${node.citationMissing?t('unavailable'):node.cited_by_count??t('unavailable')}`:t('unassigned');
    const up=bfs(node.node_id,'upstream'),down=bfs(node.node_id,'downstream');renderNeighbors($('upstream'),up);renderNeighbors($('downstream'),down);
    const rqContainer=$('reachable-rqs');rqContainer.replaceChildren();const rqs=reachableRqs(node.node_id);if(!rqs.length)empty(rqContainer,t('noRq'));else rqs.forEach(id=>rqContainer.append(nodeButton(id)));
    const evidence=$('edge-details');evidence.replaceChildren();const edges=[...new Map([...up.edges,...down.edges].map(e=>[e.edge_id,e])).values()];if(!edges.length)empty(evidence,t('noNeighbors'));else edges.forEach(e=>renderEdge(e,evidence));
    const sources=$('detail-sources');sources.replaceChildren();
    if(node.object_type==='paper'){
      sources.append(el('p','small',`${t('yearBasis')}: ${node.yearBasis||t('bib')} · ${node.year||t('unavailable')}`));
      sources.append(el('p','small',`${t('bib')}: ${node.yearRaw||node.bib?.year||t('unavailable')}`));
      if(node.bib?.verification_scope)sources.append(el('p','small',node.bib.verification_scope));
    }
    sources.append(el('p','source-record',node.source_path||''),el('p','small',`${t('chronology')} ${t('noDateNote')}`));
  }

  function renderStorySelectors() {
    const themeSelect=$('story-theme'),story=selectedStory();themeSelect.replaceChildren();
    for(const theme of data.themes){const option=el('option','',`${themeCode(theme.node_id)} · ${fullName(nodes.get(theme.node_id))}`);option.value=theme.node_id;themeSelect.append(option);}themeSelect.value=story.theme;
    const storySelect=$('story-select');storySelect.replaceChildren();
    for(const item of data.stories.filter(s=>s.theme===story.theme)){const option=el('option','',item.title_ja||item.title);option.value=item.story_id;option.lang=item.title_ja?'ja':'zh-CN';storySelect.append(option);}storySelect.value=story.story_id;
  }
  function renderStory() {
    const story=selectedStory(),step=story.steps[state.step];renderStorySelectors();
    $('story-title').textContent=story.title_ja||story.title;$('story-title').lang=story.title_ja?'ja':'zh-CN';
    $('story-caption').textContent=step.caption_ja||step.caption;$('story-caption').lang=step.caption_ja?'ja':'zh-CN';
    $('story-progress').textContent=`${String(state.step+1).padStart(2,'0')} / ${String(story.steps.length).padStart(2,'0')} · ${t('original')}`;
    $('story-prev').disabled=state.step===0;$('story-next').disabled=state.step===story.steps.length-1;
    const steps=$('story-steps');steps.replaceChildren();
    story.steps.forEach((item,index)=>{const li=el('li',index===state.step?'step-active':'');const button=el('button','',`${String(index+1).padStart(2,'0')}  ${shortId(item.node_id)}`);button.type='button';button.setAttribute('aria-current',index===state.step?'step':'false');button.addEventListener('click',()=>goToStep(index));li.append(button);if(index>0){const link=story.stepLinks[index-1];li.append(el('small','original-link',`${t('originalDirection')}: ${shortId(link.from)} → ${shortId(link.to)}`));}steps.append(li);});
    const core=$('story-core');core.replaceChildren();story.core_papers.forEach(id=>core.append(nodeButton(id)));
    let note=`${t('storyNote')} ${t('readingCaption')}`;if(state.step>0&&story.stepLinks[state.step-1]?.traversal_direction==='reverse')note+=` ${t('reverseReading')}`;$('story-note').textContent=note;
  }
  function pause(){clearTimeout(timer);state.playing=false;$('story-play').textContent=t('play');$('story-play').setAttribute('aria-pressed','false');}
  function schedule(){clearTimeout(timer);if(!state.playing)return;timer=setTimeout(()=>{if(state.step>=selectedStory().steps.length-1){pause();return;}goToStep(state.step+1);schedule();},4200);}
  function goToStep(index) {
    const story=selectedStory();state.step=Math.max(0,Math.min(story.steps.length-1,index));const step=story.steps[state.step];state.selected=step.node_id;state.depth=step.depth||1;$('depth').value=String(state.depth);state.selectedTheme=story.theme;state.expanded.add(story.theme);render();renderDetail();focusChain();$('status').textContent=`${t('step')} ${state.step+1}: ${step.caption_ja||step.caption}`;
  }
  function chooseStory(id){pause();state.storyId=id;state.step=0;state.expanded=new Set([selectedStory().theme]);goToStep(0);}
  function setView(view) {
    state.view=view;$('view-map').setAttribute('aria-pressed',String(view==='map'));$('view-stories').setAttribute('aria-pressed',String(view==='stories'));$('story-view').hidden=view!=='stories';
    if(view==='stories'){state.expanded=new Set([selectedStory().theme]);goToStep(state.step);}else{pause();render(true);}
  }
  function renderMobile() {
    const root=$('mobile-list');root.replaceChildren();
    for(const theme of data.themes){const section=el('section','mobile-theme');section.style.setProperty('--theme-color',themeColor(theme.node_id));section.append(el('p','lane-code',themeCode(theme.node_id)),el('h2','',fullName(nodes.get(theme.node_id))),el('p','status-badge',`${statusText(theme.status)} · ${theme.paperIds.length} ${t('paper')}`));
      const summary=el('details','mobile-description');summary.append(el('summary','',t('sourceCopy')),el('p','',sourceCopy(`${themeCode(theme.node_id)}.direction`)));section.append(summary);
      for(const story of data.stories.filter(s=>s.theme===theme.node_id)){
        const article=el('article','mobile-story');article.dataset.storyId=story.story_id;const title=el('h3','',story.title_ja||story.title);title.lang=story.title_ja?'ja':'zh-CN';article.append(title);
        const list=el('ol','mobile-steps');story.steps.forEach((step,index)=>{const li=el('li',`mobile-step${state.selected===step.node_id?' step-active':''}`);li.append(nodeButton(step.node_id));const caption=el('p','',step.caption_ja||step.caption);caption.lang=step.caption_ja?'ja':'zh-CN';li.append(caption);if(index>0){const link=story.stepLinks[index-1];li.append(el('small','',`${t('originalDirection')}: ${shortId(link.from)} → ${shortId(link.to)}${link.traversal_direction==='reverse'?` · ${t('association')}`:''}`));}list.append(li);});article.append(list);section.append(article);
      }
      root.append(section);
    }
    root.append(el('p','small',`${t('storyNote')} ${t('noDateNote')}`));
  }
  function render(resetZoom=false){hideTooltip();translate();renderLaneControls();renderGraph(resetZoom);renderMobile();if(state.view==='stories')renderStory();if(state.selected)renderDetail();}

  function search() {
    const query=$('search').value.trim().toLocaleLowerCase(),root=$('search-results');root.replaceChildren();if(!query)return;
    const matches=data.nodes.filter(n=>[n.node_id,n.title,n.title_ja,sourceCopy(`node.${n.node_id}.one_line`)].some(s=>s?.toLocaleLowerCase().includes(query))).slice(0,30);
    if(!matches.length){empty(root,t('noResults'));return;}
    for(const node of matches){const button=el('button','search-hit',`${shortId(node.node_id)}　${fullName(node)}`);button.type='button';button.dataset.nodeId=node.node_id;button.addEventListener('click',()=>selectNode(node.node_id));root.append(button);}
  }
  function bind() {
    $('lang')?.addEventListener('change',()=>{state.lang=$('lang').value;render();if(document.activeElement===$('search'))search();else $('search-results').replaceChildren();if(state.view==='stories')focusChain(false);});
    $('theme-mode')?.addEventListener('change',()=>{const value=$('theme-mode').value;if(value==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=value;});
    $('view-map').addEventListener('click',()=>setView('map'));$('view-stories').addEventListener('click',()=>setView('stories'));
    $('reset').addEventListener('click',()=>{pause();$('search').value='';$('search-results').replaceChildren();clearSelection();});$('detail-close').addEventListener('click',clearSelection);
    $('depth').addEventListener('change',()=>{state.depth=Number($('depth').value);if(state.selected){expandFor(state.selected,state.selectedTheme);render();}});
    $('citation-toggle').addEventListener('change',()=>{state.citations=$('citation-toggle').checked;renderGraph();});
    $('expand-all').addEventListener('click',()=>{state.expanded=state.expanded.size===data.themes.length?new Set():new Set(data.themes.map(s=>s.node_id));render(true);});
    $('search').addEventListener('input',search);$('search').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){$('search-results').querySelector('button')?.focus();e.preventDefault();}if(e.key==='Escape'){$('search-results').replaceChildren();}});
    $('search-results').addEventListener('keydown',e=>{const buttons=[...$('search-results').querySelectorAll('button')],index=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'){buttons[(index+1)%buttons.length]?.focus();e.preventDefault();}if(e.key==='ArrowUp'){buttons[(index-1+buttons.length)%buttons.length]?.focus();e.preventDefault();}if(e.key==='Escape'){$('search-results').replaceChildren();$('search').focus();}});
    $('zoom-in').addEventListener('click',()=>svg.call(zoom.scaleBy,1.35));$('zoom-out').addEventListener('click',()=>svg.call(zoom.scaleBy,1/1.35));$('zoom-reset').addEventListener('click',()=>{if(state.view==='stories')focusChain(false);else svg.call(zoom.transform,d3.zoomIdentity);});
    $('story-theme').addEventListener('change',()=>chooseStory(data.stories.find(s=>s.theme===$('story-theme').value).story_id));$('story-select').addEventListener('change',()=>chooseStory($('story-select').value));
    $('story-prev').addEventListener('click',()=>{pause();goToStep(state.step-1);});$('story-next').addEventListener('click',()=>{pause();goToStep(state.step+1);});$('story-play').addEventListener('click',()=>{if(reducedMotion()){pause();goToStep(state.step+1);return;}if(state.playing){pause();return;}if(state.step===selectedStory().steps.length-1)goToStep(0);state.playing=true;$('story-play').textContent=t('pause');$('story-play').setAttribute('aria-pressed','true');schedule();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',pause);
  }

  async function init() {
    try {
      if(!window.d3)throw new Error('D3 v7 CDN could not load');
      const response=await fetch('/prototype-lineage/layout.json');if(!response.ok)throw new Error(`layout.json HTTP ${response.status}`);data=await response.json();
      // Japanese presentation overlay changes text only: never node IDs, positions, links or research status.
      if(state.lang==='ja'){
        const editedResponse=await fetch('/research-ja-editorial.json');
        if(!editedResponse.ok)throw new Error('Japanese research copy could not load');
        const edited=await editedResponse.json();
        for(const node of data.nodes){if(edited.titles[node.node_id])node.title_ja=edited.titles[node.node_id];}
        for(const row of data.copy){if(edited.copy[row.key])row.ja=edited.copy[row.key];}
        for(const edge of data.lineage){const text=edited.edges[edge.edge_id];if(text){edge.claim=text.claim;edge.limitation=text.limitation;}}
        for(const story of data.stories){const text=edited.stories[story.story_id];if(text){story.title_ja=text.title;for(const step of story.steps){if(text.steps[step.node_id])step.caption_ja=text.steps[step.node_id];}}}
      }
      nodes=new Map(data.nodes.map(n=>[n.node_id,n]));copies=new Map(data.copy.map(row=>[row.key,row]));indexEdges();state.storyId=data.stories[0].story_id;
      const tooltip=$('tooltip')||el('div','map-tooltip');tooltip.id='map-tooltip';tooltip.hidden=true;tooltip.setAttribute('role','tooltip');document.body.append(tooltip);
      svg=d3.select('#chart');world=svg.append('g').attr('class','map-world');zoom=d3.zoom().scaleExtent([.25,5]).filter(event=>!event.target.closest?.('.node-hit,.lane-label') && (!event.ctrlKey||event.type==='wheel') && !event.button).on('zoom',event=>world.attr('transform',event.transform));svg.call(zoom).on('dblclick.zoom',null);
      bind();render(true);$('status').textContent=t('ready');document.documentElement.dataset.ready='true';
      // Integration seam for Astro and read-only browser QA; graph data remains the built artifact.
      window.researchMap={data,state,selectNode,render,setView,goToStep,bfs,reachableRqs};
    }catch(error){console.error(error);$('status').textContent=`${t('loadError')} ${error.message}`;$('status').classList.add('error');document.documentElement.dataset.ready='error';}
  }
  init();
})();
