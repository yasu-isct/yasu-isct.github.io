// AI 協働の記録 — short, concrete episodes from building with generative AI.
// Reader-first shape: one scene sentence (set large), then at most three "what happened" lines and
// two "what I changed" lines, then checkable links. Facts come from the repos and saved reports.
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
type LL = Record<Lang, string[]>;
export interface Note {
  id: string;
  date: string;
  work?: string;
  title: L;
  scene: L;      // the one sentence a reader should remember
  what: LL;      // ≤3 short lines
  changed: LL;   // ≤2 short lines
  facts: { label: string; href?: string }[];
  tags: string[];
}

export const notes: Note[] = [
  {
    id: 'page-numbers',
    date: '2026-09-01',
    work: 'j-grad',
    title: { ja: '382件中216件に、出典ページがなかった', zh: '382 条事实里 216 条没有页码', en: '216 of 382 facts had no page number' },
    scene: {
      ja: '「根拠付き回答」が看板なのに、最初の実データでは事実の半分以上がどのページから来たか言えなかった。テストは全部緑だった。',
      zh: '招牌是"带根据的回答"，第一批真实数据里一半以上的事实说不出来自哪一页。测试全绿。',
      en: 'The banner said "answers with sources" — and on the first real data, more than half the facts could not say which page they came from. Every test was green.',
    },
    what: {
      ja: ['AI は PDF のページ情報を一度 Markdown に平坦化し、あとで本文の「Page N」を探して復元していた。', '見出しのない chunk はページを失う。テストは見出し付きの合成データだったので、この経路を通らなかった。', '気づいたのは、実 PDF から作った Fact の JSON で `page: null` を数えたとき。'],
      zh: ['AI 把 PDF 页码压平进 Markdown，之后再找正文里的"Page N"往回猜。', '没有标题的 chunk 就丢了页码。测试用的是带标题的合成数据，所以这条路径从没走过。', '发现的方式：用真实 PDF 生成的 Fact JSON 里数 `page: null`。'],
      en: ['The AI flattened PDF page info into Markdown, then tried to recover it from "Page N" headings in the text.', 'Chunks without a heading lost their page. Tests used synthetic data that always had headings, so the path was never exercised.', 'I noticed by counting `page: null` in the Fact JSON built from the real PDF.'],
    },
    changed: {
      ja: ['ページ番号は抽出層で付く構造化メタデータとして最後まで持ち回る。表示テキストから逆算しない。', '「実 PDF で端から端まで一本通す」を、以後すべての段階の最初の区切りにした。'],
      zh: ['页码从抽取层起作为结构化元数据一路带到最后，不从显示文本倒推。', '"用真实 PDF 端到端跑通一次"成为以后每个阶段的第一个里程碑。'],
      en: ['Page numbers travel as structured metadata from extraction to the end, never reverse-engineered from display text.', 'One end-to-end run on the real PDF became the first milestone of every later phase.'],
    },
    facts: [{ label: 'Issue #3', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/3' }, { label: 'PR #10 真実回帰', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/10#issuecomment-5490287693' }],
    tags: ['RAG', 'data', 'testing'],
  },
  {
    id: 'm10-drift',
    date: '2026-09-25',
    work: 'j-grad',
    title: { ja: '二日で三版、気づけば中日文の意味検証器を作っていた', zh: '两天三版，回过神来在造中日文语义验证器', en: 'Three versions in two days — we were building a Chinese–Japanese semantic verifier' },
    scene: {
      ja: '「情報工学系の英語満点は100点、面接はオンライン形式」——前半は根拠あり、後半はなし。この回答が検証を通った。',
      zh: '「信息工学系英语满分 100 分，面试采用线上形式」——前半有依据，后半没有。这个回答通过了验证。',
      en: '"The English maximum is 100 points; the interview is online" — first half grounded, second half invented. It passed the check.',
    },
    what: {
      ja: ['私が受け入れ条件に書いた：「回答に含まれる無根拠の事実をサーバが決定的に検出できること」。', '一版目はキーワード照合、二版目は単語ごとの意味消費。反例が出るたび規則を足し、正しい言い換え「最高100点取れる」は弾かれた。', '三版目が主語・関係・目的語の解析に入りかけたところで止めた。CI はずっと緑。'],
      zh: ['我在验收条件里写了："服务器必须能确定性地识别回答里任何无根据的事实"。', '第一版关键词校验，第二版逐词语义消费。每出一个反例加一条规则，正确的改写「最高可得 100 分」反而被拒。', '第三版准备解析主语、关系、宾语时叫停。CI 一直是绿的。'],
      en: ['I had written into the acceptance criteria: "the server must deterministically detect any unsupported fact in the answer."', 'Version one matched keywords; version two consumed meaning word by word. Every counterexample added a rule, and the correct paraphrase "up to 100 points" got rejected.', 'I stopped as version three was about to parse subject, relation and object. CI stayed green throughout.'],
    },
    changed: {
      ja: ['PR #179：自然言語層を「低保証の参考層」に降格。資格判定は人がレビューした構造化ルールだけ。', '以後の規則：反例は診断の手がかりであって新しい規則ではない。修正は同種の別表現 2 件以上でも直ること。'],
      zh: ['PR #179：自然语言层降为"低保证参考层"，资格判定只交给人工审核的结构化规则。', '此后的规矩：反例是诊断线索，不是新规则；修复必须在两个以上同类表达上也成立。'],
      en: ['PR #179 demoted the natural-language layer to "low-assurance reference"; eligibility stays with human-reviewed structured rules.', 'Rule since: a counterexample is a diagnostic clue, not a new rule; a fix must hold on two or more sibling phrasings.'],
    },
    facts: [{ label: 'PR #176', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/176' }, { label: 'PR #178', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/178' }, { label: 'PR #179', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/179' }],
    tags: ['LLM', 'review', 'scope'],
  },
  {
    id: 'fake-provider',
    date: '2026-10-24',
    work: 'j-grad',
    title: { ja: 'README の数字に、保存レポートがなかった', zh: 'README 里的数字，没有对应的保存报告', en: 'The README figures had no saved report behind them' },
    scene: {
      ja: 'README は Recall@10 0.8495。リポジトリに保存されていた唯一の結果ファイルは 0.8852。前者の出所は、どこにもなかった。',
      zh: 'README 写 Recall@10 0.8495。仓库里保存的唯一结果文件是 0.8852。前者的出处，哪里都找不到。',
      en: 'The README said Recall@10 0.8495. The only result file in the repo said 0.8852. The former existed nowhere else.',
    },
    what: {
      ja: ['別のエージェントが公開リポジトリを読み、結果ファイルを自分で再計算して「合わない」と報告してきた。', '全リポジトリ検索で 0.8495 が出るのは README・評価説明・技術解説の三つの文章だけ。結果ファイルは 2026-09-24 の 1 コミットのみ。', 'たぶん gitignore 下の outputs/ で走った別の実行の数字が、文章にだけ残った。'],
      zh: ['另一个 agent 读公开仓库时自己重算了结果文件，报告"对不上"。', '全仓库搜 0.8495 只命中 README、评测说明、技术解说三篇文字。结果文件只有 2026-09-24 一次提交。', '大概是某次跑在 gitignore 下 outputs/ 里的数字，只留在了文字里。'],
      en: ['A different agent read the public repo, recomputed the result file itself and reported a mismatch.', 'A repo-wide search for 0.8495 hit only three prose files. The result file had a single commit from 2026-09-24.', 'Most likely a run in the gitignored outputs/ left its number only in prose.'],
    },
    changed: {
      ja: ['PR #300：三箇所を 0.8852 / 0.8323 に訂正し、数字の横に「固定42問・391件KB・2026-09-24 保存」。旧文書に訂正の一行を残した。', '公開する数字は保存レポートに紐付ける。ダミー埋め込みで通るテストは配管の証明であって品質の証明ではない、と README に明記。'],
      zh: ['PR #300：三处改成 0.8852 / 0.8323，数字旁写"固定 42 题・391 条 KB・2026-09-24 保存"，旧文档留一行更正记录。', '公开数字必须绑到保存报告；README 写明假 embedding 通过的测试证明的是管道，不是质量。'],
      en: ['PR #300 corrected all three places to 0.8852 / 0.8323 with "42 fixed queries · 391-entry KB · saved 2026-09-24" beside the figure, and a one-line correction note in the old doc.', 'Published numbers bind to a saved report; the README now says fake-embedding tests prove plumbing, not quality.'],
    },
    facts: [{ label: 'PR #300', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/300' }, { label: '保存レポート', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json' }],
    tags: ['evaluation', 'honesty'],
  },
  {
    id: 'index-rebuild',
    date: '2026-09-26',
    work: 'j-grad',
    title: { ja: '同じ索引が、すでに5箇所にあった', zh: '同样的索引，已经在 5 个地方', en: 'The same index already existed in five places' },
    scene: {
      ja: '受け入れを走らせたら、BGE-M3 の環境構築に約 7 分（復盤ノートの記録、実行ログなし）。おかしい。モデルも索引も、もうあるはずだった。',
      zh: '跑验收时 BGE-M3 环境构建花了约 7 分钟（复盘笔记的记录，没有运行日志）。不对，模型和索引应该早就有了。',
      en: 'The acceptance run spent ~7 minutes building the BGE-M3 environment (from the retrospective note; no run log). Wrong — the model and index should already have existed.',
    },
    what: {
      ja: ['便利関数 `prepare_demo()` は空の workspace を見ると KB も索引も丸ごと作り直す。', '直前の権限エラーで AI は新しい workspace を切った——そして全部作り直した。', '読み取り専用で数えると、同じ KB ハッシュ・同じベクトルハッシュの 391 件索引が 5 箇所に、各 2.62 MB。'],
      zh: ['方便函数 `prepare_demo()` 看到空 workspace 就把 KB 和索引整套重建。', '之前报了权限错误，AI 就新开了一个 workspace——然后整套重建。', '只读盘点：同一 KB hash、同一向量 hash 的 391 条索引在 5 个目录各一份，每份 2.62 MB。'],
      en: ['The helper `prepare_demo()` rebuilds KB and index whenever it sees an empty workspace.', 'A permission error made the AI create a new workspace — and rebuild everything.', 'A read-only count found the same 391-row index (same KB hash, same vector hash) in five places, 2.62 MB each.'],
    },
    changed: {
      ja: ['仕様に三行：機能側はデータ資産を読み取り専用で消費する／再構築・複製・ダウンロードは個別承認／権限不足は資産不在ではない。', '索引は作った段階ではなく内容の同一性（PDF・KB・モデル・次元）で一箇所に置く。重複の削除は参照監査が終わるまでしない。'],
      zh: ['规格加三行：功能侧只读消费数据资产 / 重建、复制、下载单独批准 / 权限不足不等于资产不存在。', '索引按内容身份（PDF、KB、模型、维度）存一份，不按生成阶段。重复的删除等引用审计完成。'],
      en: ['Three lines in the spec: feature code consumes assets read-only; rebuilds, copies and downloads need approval; permission denied is not asset missing.', 'Indexes keyed by content identity (PDF, KB, model, dimension), not by milestone. Duplicates stay until the reference audit is done.'],
    },
    facts: [{ label: 'Issue #180', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/180' }, { label: 'PR #184 reuse-only', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/184' }],
    tags: ['data', 'ownership'],
  },
  {
    id: 'scope-global',
    date: '2026-09-14',
    work: 'j-grad',
    title: { ja: 'CI は全部緑。数学系の例外が「全学共通」になっていた', zh: 'CI 全绿。数学系的例外被标成了"全校通用"', en: 'CI all green. A math-department exception had become "university-wide"' },
    scene: {
      ja: '`fact:00105`（数学系の英語の例外）が global と判定されていた。隣の `fact:00106` にはテストがあり、それは通っていた。',
      zh: '`fact:00105`（数学系的英语例外）被标成 global。旁边的 `fact:00106` 有测试，所以 CI 通过了。',
      en: '`fact:00105` (a math-department English exception) had become global. The neighbouring `fact:00106` had a test — and that one passed.',
    },
    what: {
      ja: ['`infer_scope()` が大章節のフォールバックを学系マッチより先に置いていた。', 'RAG の誤りは生成側だけではない。検索の手前で「誰に適用されるか」を取り違えると、その後の引用は全部正しく見えて、全部違う相手を支える。', 'テストは「直したい一条」だけを守っていた。'],
      zh: ['`infer_scope()` 把大章节 fallback 放在了系别匹配之前。', 'RAG 的错不只在生成端：检索前把"适用于谁"搞错，后面的引用全看起来对、全支持错对象。', '测试只保护了"想修好的那一条"。'],
      en: ['`infer_scope()` applied the big-section fallback before department matching.', 'RAG errors are not only at generation: get "who does this apply to" wrong before retrieval and every citation looks right while backing the wrong party.', 'The test protected only the one line someone wanted fixed.'],
    },
    changed: {
      ja: ['override を構造階層で絞り、本当に共通条項の葉レベル段落だけ残す。Fact ID やキーワードの特別扱いはしない。', '同じ実 PDF から隣接する正例と反例を追加。318 Fact 維持、00105 は数学系、00106 は global。'],
      zh: ['按结构层级收窄 override，只留真正共通的叶级段落；不按 Fact ID 或关键词特判。', '从同一份真实 PDF 加相邻正反例。318 个 Fact 保持，00105 归数学系，00106 为 global。'],
      en: ['Narrowed the override by structural level, keeping only leaf paragraphs that really are common; no special-casing by ID or keyword.', 'Added adjacent positive and negative examples from the same real PDF. 318 Facts kept; 00105 department-level, 00106 global.'],
    },
    facts: [{ label: 'PR #108 審査', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/108#issuecomment-5660330591' }],
    tags: ['RAG', 'testing', 'scope'],
  },
  {
    id: 'mineru-reject',
    date: '2026-09-27',
    work: 'j-grad',
    title: { ja: '新しいパーサーは採用しなかった。失敗した試験も完全な納品にした', zh: '新解析器没有采用。失败的试验也做成了完整交付', en: 'The new parser was not adopted — and the failed trial still became a complete deliverable' },
    scene: {
      ja: 'MinerU 4.0.7 のパイロット：388 ページパス（上限 168 を超過）、最終スコア Legacy 30/41・Flash 33/41。決定は reject。',
      zh: 'MinerU 4.0.7 试点：388 次页面尝试（超过 168 上限），最终 Legacy 30/41、Flash 33/41。决定：reject。',
      en: 'The MinerU 4.0.7 pilot: 388 page passes (over the 168 cap), final scores Legacy 30/41 and Flash 33/41. Decision: reject.',
    },
    what: {
      ja: ['途中で `fallback` 案が出て、それを結論にしかけた。', 'Basic 構成の一回がハングしたので「このパーサーは遅い」と言いたくなった。', 'どちらも証拠が足りなかった。'],
      zh: ['中途出过一个 `fallback` 方案，差点当成结论。', 'Basic 配置有一次卡住，就想说"这个解析器很慢"。', '两者证据都不够。'],
      en: ['A `fallback` draft appeared mid-way and nearly became the conclusion.', 'One Basic-config run hung, and it was tempting to call the parser slow.', 'Neither claim had enough evidence.'],
    },
    changed: {
      ja: ['予算は実行世代をまたいで累計し、失敗した試行も数える。監督・タイムアウト・未完了サンプルを分けて記録。', '受け入れたのは「失敗した試験の証拠と撤退の結論」。既存の製品パイプラインはそのまま。'],
      zh: ['预算跨执行代次累计，失败的尝试也算；监督、超时、未完成样本分开记。', '接受的是"失败试验的证据和退出结论"，现有产品链不动。'],
      en: ['Budget accumulates across run generations and failed attempts count; supervision, timeouts and incomplete samples are recorded separately.', 'What was accepted: evidence of a failed trial and the decision to exit. The existing pipeline stayed.'],
    },
    facts: [{ label: 'Issue #177', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/177' }, { label: 'PR #200', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/200#issuecomment-5855818419' }, { label: '最終報告', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/onboarding/mineru-4.0.7-pilot-report.md' }],
    tags: ['evaluation', 'decision'],
  },
  {
    id: 'deliverable-pack',
    date: '2026-10-01',
    work: 'j-grad',
    title: { ja: '自分が伝言係になっていた', zh: '我成了传话员', en: 'I had become a messenger' },
    scene: {
      ja: '開発エージェントの要約を設計エージェントに貼り、返事をまた貼る。小さな修正を同期しているだけで、段階の成果が見えなかった。',
      zh: '把开发 agent 的摘要贴给设计 agent，再把回复贴回去。我只是在同步小修小改，看不到阶段成果。',
      en: 'Paste the dev agent\'s summary to the design agent, paste the reply back. I was syncing small fixes and could not see the stage result.',
    },
    what: {
      ja: ['フロントエンド・報告・出典説明が似た設定を三重に持ち、ずれるリスクも増えていた。', '#277：出典修正を自己点検つきで実装へ連続して進め、出典と画面をまとめて審査に。', '#278：論点を一度に列挙し、逐点確認をやめた。M18 は A→B→C→D を一つの成果パック、PR 一本で納品。'],
      zh: ['前端、报告、来源说明三处维护相近配置，漂移风险在涨。', '#277：来源修正自检后连续推进实现，来源和界面一起交审。', '#278：问题一次列完，不再逐点确认。M18 把 A→B→C→D 做成一个成果包、一个 PR。'],
      en: ['Front end, report and source notes each kept a near-copy of the same config; drift was growing.', '#277: the source fix continued straight into implementation with self-checks, reviewed together with the screens.', '#278: all questions listed at once, no point-by-point confirmation. M18 shipped A→B→C→D as one pack in one PR.'],
    },
    changed: {
      ja: ['#289 の納品は使い方・回帰・実データの往復を含み、設計側が一度で受け入れ。画面と報告は同じ著者データから派生。', '前後の工数比較はないので「○%速くなった」とは言わない。言えるのは：引き継ぎが完全になり、重複入力が減り、伝言しなくてよくなった。'],
      zh: ['#289 的交付含完整使用说明、回归和真实数据闭环，设计方一次验收；页面和报告从同一份作者数据派生。', '没有前后工时对比，不说"效率提升 X%"。能说的是：交接包完整了、重复录入少了、不用再传话。'],
      en: ['#289 shipped with usage notes, regression and a real-data round trip, accepted in one pass; screens and report derive from one author dataset.', 'No before/after time study, so no "X% faster". What can be said: complete hand-offs, fewer duplicate entries, no more relaying.'],
    },
    facts: [{ label: '#277', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/277#issuecomment-5943317153' }, { label: '#278', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/278#issuecomment-5945290113' }, { label: 'PR #289', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/289' }],
    tags: ['agents', 'process'],
  },
  {
    id: 'agents-md',
    date: '2026-10-24',
    title: { ja: '禁止事項だらけの指示書が、監査報告みたいな返事を生んだ', zh: '禁令堆成的指令，换来了审计报告式的回复', en: 'Prohibition-heavy instructions came back as audit-speak' },
    scene: {
      ja: '「三回の実行権限は使い切りました。四回目の権限はありません。未知の使用量は全額占有のまま保持します。」——何を理解しているのか、読んでも分からなかった。',
      zh: '"三次执行授权已用完，没有第四次的授权。未知用量整额占额仍保留。"——读完也看不出它懂了什么。',
      en: '"All three execution authorizations are exhausted. There is no authorization for a fourth. Unknown usage remains fully reserved." — I could not tell what it had understood.',
    },
    what: {
      ja: ['原因は私が書いた AGENTS.md：禁止事項と定義だけで、目的が一行もない。', 'モデルは指示文の文体を鏡のように返す。禁止が多いほど「〜とみなさない」の自己弁護が増えた。', 'grill-me 系のスキルを足しても変わらない。あれは要件を深掘りする道具で、読みやすさの道具ではない。'],
      zh: ['原因是我自己写的 AGENTS.md：只有禁令和定义，没有一行目的。', '模型镜像指令的文体：禁令越多，"〜不视为〜"的自我辩护越多。', '加 grill-me 类 skill 没用，那是深挖需求的工具，不是让输出可读的工具。'],
      en: ['The cause was my own AGENTS.md: all prohibitions and definitions, not one line of purpose.', 'Models mirror the register of their instructions; more prohibitions, more "X is not to be regarded as Y".', 'Grill-me-style skills did not help; they dig into requirements, not readability.'],
    },
    changed: {
      ja: ['指示書の先頭を三文に：何のためか／誰が使うか／何ができたら成功か。禁止は不可逆なものだけ。', '翌日の同じモデルの復唱：「私が理解したのは、日本の AI 職の要件とあなたの成果を照らして技術の欠落を見つけ、簡報にして渡したら止まること。」'],
      zh: ['指令开头改成三句：为了什么 / 谁在用 / 做成什么算成功；禁令只留不可逆的。', '第二天同一个模型的复述："我理解你要的是：对照日本 AI 岗位要求和你已有的成果，找出技术缺口，写成项目简报，交付后就停。"'],
      en: ['Instructions now open with three sentences: what for, who uses it, what counts as done; only irreversible prohibitions remain.', 'The same model, next day: "I understand you want me to compare job requirements with your work, find the gaps, write briefs, and stop once delivered."'],
    },
    facts: [{ label: 'COLLABORATION.md（内部）' }],
    tags: ['agents', 'prompting'],
  },
  {
    id: 'llm-judge',
    date: '2026-10-24',
    work: 'coach',
    title: { ja: '審査員だけが気づいた：「〇〇さんは？」は相手に成立しない', zh: '只有审查员发现：「〇〇さんは？」对对方不成立', en: 'Only the judge noticed: "and you?" does not work on this listener' },
    scene: {
      ja: '形式や文法のチェックは全部通った回答が、日本人の相手に「日本に来てどれくらい？」と聞き返していた。気づいたのは別コンテキストの審査員で、二回続けて同じ指摘をした。',
      zh: '格式和语法检查全部通过的回答，却在反问一位日本人「来日本多久了？」。发现的是另一上下文的审查员，连续两轮提了同一个问题。',
      en: 'A reply that passed every format and grammar check was asking a Japanese listener "how long have you been in Japan?". A judge in a separate context noticed, twice in a row.',
    },
    what: {
      ja: ['同じ場所にいるのに「そっちは？」。相手が先に「お疲れ様です」と言ったのに返さない。どれも文法は正しく、礼儀レベルも合っている。', '自動チェックの成績は形式 20/20、⭐ 20/20、⚠ 20/20、文法の硬性エラー 0。生成側の自己チェック（SKILL.md の「自分で確認」）では一度も引っかからなかった。', '審査員は相手の立場から読んだから見えた。'],
      zh: ['同在一处却问「そっちは？」；对方先说「お疲れ様です」，回复没接。每条语法都对，礼貌等级也对。', '自动检查的成绩：格式 20/20、⭐ 20/20、⚠ 20/20、语法硬性错误 0。生成侧的自检（SKILL.md 的"自己确认"）一次都没拦住。', '审查员站在对方立场读才看得见。'],
      en: ['Asking "how about over there?" when both are in the same place; skipping the return greeting. All grammatical, all at the right politeness level.', 'Automatic checks scored format 20/20, ⭐ 20/20, ⚠ 20/20, zero hard grammar errors; the generator\'s self-check never caught one.', 'The judge saw it because it read from the listener\'s side.'],
    },
    changed: {
      ja: ['聞き返しや挨拶が、相手の立場でも自然に成立するかを確認する規則を加え、もう一周回帰。', '審査員もモデルなので、同じ見落としがあり得る。最終判断は母語話者による確認に置く。これはまだ実施していない。'],
      zh: ['规则加上"反问和寒暄要站在对方立场也成立"，再跑一轮回归。', '审查员也是模型，可能有同样的疏漏；最终判断放在母语者的确认上。这一步还没做。'],
      en: ['Rule added: return questions and greetings must also hold from the listener\'s side; one more regression round.', 'The judge is a model and can share the same blind spot; the final word stays with native-speaker checks, which have not been done yet.'],
    },
    facts: [{ label: 'status.md', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/status.md' }, { label: 'D-005', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/decisions.md' }],
    tags: ['evaluation', 'LLM-as-judge'],
  },
];
