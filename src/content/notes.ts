// AI 協働の記録 — short, concrete episodes from building with generative AI.
// Each is an experience, not a lesson plate: what I asked for, what went sideways, what I changed.
// Facts (counts, PR numbers, timings) come from the repos and saved reports; nothing here is rounded for effect.
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
export interface Note {
  id: string;
  date: string;
  work?: string; // works[].id
  title: L;
  hook: L;     // 1–2 sentences, the interesting part
  what: L;     // what actually happened, concretely
  changed: L;  // what I changed afterwards
  facts: { label: string; href?: string }[]; // checkable anchors
  tags: string[];
}

export const notes: Note[] = [
  {
    id: 'page-numbers',
    date: '2026-09-01',
    work: 'j-grad',
    title: { ja: '382件中216件に、出典ページがなかった', zh: '382 条事实里 216 条没有出处页码', en: '216 of 382 facts had no source page' },
    hook: {
      ja: 'M1の最初の実データ基線。看板は「根拠付き回答」なのに、半分以上の事実がどのページから来たか言えなかった。単体テストは全部緑だった。',
      zh: 'M1 的第一条真实数据基线。招牌是"带根据的回答"，一半以上的事实说不出来自哪一页。单元测试全绿。',
      en: 'The first real-data baseline in M1. The banner said "answers with sources", and more than half the facts could not say which page they came from. Every unit test was green.',
    },
    what: {
      ja: 'エージェントは PDF のページ情報を一度 Markdown に平坦化し、あとから本文中の「Page N」という見出しを探して復元していた。見出しを含まない chunk はページを失う。テストは合成データ（見出し付き）で書かれていたので、この経路を一度も踏まなかった。私が気づいたのは、Fact の JSON を実 PDF で開いて `page: null` を数えたとき。',
      zh: 'agent 把 PDF 页码压平进 Markdown，之后再在正文里找"Page N"标题往回猜。不含标题的 chunk 就丢了页码。测试用的是带标题的合成数据，所以这条路径一次都没走过。我是在用真实 PDF 打开 Fact 的 JSON、数 `page: null` 的时候发现的。',
      en: 'The agent flattened PDF page info into Markdown, then tried to recover it by finding "Page N" headings in the text. Chunks with no heading lost their page. Tests were written on synthetic data that always had headings, so this path was never exercised. I noticed only when I opened the Fact JSON built from the real PDF and counted `page: null`.',
    },
    changed: {
      ja: 'ページ番号は抽出層で付けた構造化メタデータとして最後まで持ち回る。表示テキストから逆算しない。そして「実 PDF で端から端まで一本通す」を、以後すべての段階の最初の区切りにした。M1 のこの修正が、このプロジェクトで一番大事な信頼性の修正になった。',
      zh: '页码从抽取层起就是结构化元数据，一路带到最后，不从显示文本倒推。并且把"用真实 PDF 端到端跑通一次"定为以后每个阶段的第一个里程碑。M1 的这次修正是整个项目最重要的可信性修正。',
      en: 'Page numbers became structured metadata attached at extraction and carried to the end, never reverse-engineered from display text. And "one end-to-end run on the real PDF" became the first milestone of every later phase. This M1 fix turned out to be the single most important trust fix in the project.',
    },
    facts: [
      { label: '復盤ノート M1', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/development-lessons.md' },
    ],
    tags: ['RAG', 'data', 'testing'],
  },
  {
    id: 'm10-drift',
    date: '2026-09-25',
    work: 'j-grad',
    title: { ja: '二日で三版、気づけば中日文の意味検証器を作っていた', zh: '两天三版，回过神来在造中日文语义验证器', en: 'Three versions in two days, and we were building a Chinese–Japanese semantic verifier' },
    hook: {
      ja: 'M10-08 の受け入れ条件に「DeepSeek の回答に含まれる無根拠の事実をサーバが決定的に検出できること」と書いてしまった。PR #176、#178 と進むうちに、RAG ではなく自然言語の検証器を作っていた。',
      zh: '我在 M10-08 的验收条件里写了"服务器必须能确定性地识别 DeepSeek 回答里新增的任何无根据事实"。PR #176、#178 做下来，我们在做的已经不是 RAG，是自然语言验证器。',
      en: 'I wrote into the M10-08 acceptance criteria: "the server must deterministically detect any unsupported fact in the DeepSeek answer." By PR #176 and #178 we were building a natural-language verifier, not a RAG system.',
    },
    what: {
      ja: '第一版はキーワードと数字の照合。レビュー担当のエージェントが反例を出す——「情報工学系の英語満点は100点、面接はオンライン形式」（前半は根拠あり、後半はなし）——通ってしまう。第二版は単語ごとの「意味表面の完全消費」。次の反例——「情報工学系は英語科目」——許可された単語の並べ替えで嘘が作れ、しかも正しい言い換え「最高100点取れる」は弾かれる。第三版の設計で主語・関係・目的語の解析を始めかけたところで止めた。テストと CI はこの間ずっと緑。',
      zh: '第一版靠关键词和数字校验。审查 agent 给反例——「信息工学系英语满分 100 分，面试采用线上形式」（前半有依据，后半没有）——通过了。第二版做逐词的"语义表面完全消费"。下一个反例——「情報工学系是英语科目」——允许的词重新排列就能造出假话，而正确的改写「最高可得 100 分」反而被拒。第三版准备解析主语、关系、宾语时我叫停了。这期间测试和 CI 一直是绿的。',
      en: 'Version one matched keywords and numbers. The review agent produced a counterexample — "the English maximum for Information Engineering is 100 points; the interview is online" (first half grounded, second half not) — and it passed. Version two consumed the "semantic surface" word by word. Next counterexample — "Information Engineering is an English subject" — the permitted words could be rearranged into a falsehood, while the correct paraphrase "up to 100 points" was rejected. I stopped as version three was about to parse subject, relation and object. Tests and CI were green the whole time.',
    },
    changed: {
      ja: 'PR #179 で自然言語層を「構造化資料の上に乗る低保証の参考層」に降格：出典 ID やハッシュを生成させない、`reference_only` と `needs_review=true` を付ける、申請者プロフィールは送らない。資格判定は人がレビューした構造化ルールのまま。以後、失敗例が出たら「どの層の問題か」を先に判定し、修正は同種の別表現 2 件以上でも直ることを示す、を規則にした。',
      zh: 'PR #179 把自然语言层降为"结构化资料之上的低保证参考层"：不让模型生成出处 ID 和 hash，标 `reference_only` 和 `needs_review=true`，不发申请者档案。资格判定仍只交给人工审核的结构化规则。之后定了规矩：出现失败案例先判断属于哪一层，修复必须在两个以上同类表达上也成立。',
      en: 'PR #179 demoted the natural-language layer to a "low-assurance reference layer on top of structured data": no generated citation IDs or hashes, tagged `reference_only` and `needs_review=true`, no applicant profile sent. Eligibility stayed with human-reviewed structured rules. The rule since: when a failing case appears, first decide which layer owns it, and a fix must also hold on two or more sibling phrasings.',
    },
    facts: [
      { label: 'PR #176', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/176' },
      { label: 'PR #178', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/178' },
      { label: 'PR #179', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/179' },
    ],
    tags: ['LLM', 'review', 'scope'],
  },
  {
    id: 'fake-provider',
    date: '2026-10-24',
    work: 'j-grad',
    title: { ja: 'README の数字に、保存レポートがなかった', zh: 'README 里的数字，没有对应的保存报告', en: 'The README figures had no saved report behind them' },
    hook: {
      ja: 'README と評価説明は Recall@10 0.8495 / MRR 0.8312。リポジトリに保存されていた唯一の結果ファイルは 0.8852 / 0.8323。前者の出所は、どこにもなかった。',
      zh: 'README 和评测说明写的是 Recall@10 0.8495 / MRR 0.8312。仓库里保存的唯一结果文件是 0.8852 / 0.8323。前者的出处，哪里都找不到。',
      en: 'README and the evaluation note said Recall@10 0.8495 / MRR 0.8312. The only result file saved in the repo said 0.8852 / 0.8323. The former had no source anywhere.',
    },
    what: {
      ja: '別のエージェント（ギャップ分析担当）が、公開リポジトリを読んで `grounded_rag_retrieval_report_v1.json` を自分で再計算し、文書の数字と合わないと報告してきた。全リポジトリ検索で `0.8495` が出るのは README・評価説明・技術解説の 3 つの文章だけ。結果ファイルは 2026-09-24 の 1 コミットしかなく、ずっと 391 件 KB・42 問・0.8852 だった。たぶん `outputs/`（gitignore）で走った別の実行の数字が、文章にだけ残った。',
      zh: '另一个 agent（负责缺口分析）读公开仓库时自己重算了 `grounded_rag_retrieval_report_v1.json`，报告说和文档里的数字对不上。全仓库搜 `0.8495` 只命中 README、评测说明、技术解说三篇文字。结果文件只有 2026-09-24 一次提交，一直是 391 条 KB、42 题、0.8852。大概是某次跑在 `outputs/`（gitignore）里的数字只留在了文字里。',
      en: 'A different agent (doing gap analysis) read the public repo, recomputed `grounded_rag_retrieval_report_v1.json` itself and reported a mismatch with the docs. A repo-wide search for `0.8495` hit only three prose files: README, the evaluation note, the engineering explainer. The result file had a single commit from 2026-09-24 and had always said 391-entry KB, 42 queries, 0.8852. Most likely a run in the gitignored `outputs/` left its number only in prose.',
    },
    changed: {
      ja: '公開する数字は保存レポートに紐付ける。PR #300 で三箇所を 0.8852 / 0.8323 に訂正し、「固定42問・391件KB・2026-09-24 保存」を数字の横に書き、旧文書にも「出所のない数字を訂正した」と残した。ついでに、デモが再現性のために決定的なダミー埋め込みで動くこと——それは配管の証明であって品質の証明ではないこと——も README に明記した。',
      zh: '公开的数字必须绑到保存报告。PR #300 把三处改成 0.8852 / 0.8323，数字旁边写"固定 42 题 · 391 条 KB · 2026-09-24 保存"，旧文档里留下"无出处的数字已更正"。顺便把 demo 为了可复现默认用确定性假 embedding——那证明的是管道通了，不是质量——也写进了 README。',
      en: 'Published numbers must be bound to a saved report. PR #300 corrected all three places to 0.8852 / 0.8323, put "42 fixed queries · 391-entry KB · saved 2026-09-24" next to the figure, and left a note in the old doc that an unsourced number had been corrected. While there, the README now also states that the demo runs on deterministic fake embeddings for reproducibility — proof of plumbing, not of quality.',
    },
    facts: [
      { label: 'PR #300', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/300' },
      { label: '保存レポート', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json' },
    ],
    tags: ['evaluation', 'honesty'],
  },
  {
    id: 'index-rebuild',
    date: '2026-09-26',
    work: 'j-grad',
    title: { ja: '「初回構築に約7分」——同じ索引が、すでに5箇所にあった', zh: '"首次构建约 7 分钟"——同样的索引，已经在 5 个地方', en: '"First build took ~7 minutes" — the same index already existed in five places' },
    hook: {
      ja: 'M10-09 の受け入れを走らせたら、BGE-M3 の環境構築に約 7 分かかった（当時の復盤ノートの記述。不変の実行ログは残っていない）。おかしい。モデルも索引も、もうあるはずだった。',
      zh: '跑 M10-09 验收时，BGE-M3 环境构建花了约 7 分钟（当时复盘笔记的记录，没有留下不可变的运行日志）。不对，模型和索引应该早就有了。',
      en: 'Running the M10-09 acceptance, building the BGE-M3 environment took about 7 minutes (from the retrospective note at the time; no immutable run log survives). That was wrong — the model and the index should already have existed.',
    },
    what: {
      ja: '検証スクリプトが `prepare_demo(PDF, 新しい workspace)` を呼んでいた。この便利関数は空の workspace を見ると、PDF 検証 → KB 構築 → ベクトル索引 → corpus → 設定 → 起動、を全部やる。直前に元の workspace で権限エラーが出たので、エージェントは新しい workspace を切った——そして丸ごと作り直した。manifest を読み取り専用で数えると、同じ KB ハッシュ `7fa46e49…`・同じモデル revision・同じベクトルハッシュ `56508cad…` の 391 件索引が `m9-01`、`m9-05`、`m10-06`、`m10-deepseek-live`、`m10-09` の 5 箇所に、各 2.62 MB。',
      zh: '验收脚本调了 `prepare_demo(PDF, 新 workspace)`。这个方便函数看到空 workspace 就把 验证 PDF → 建 KB → 建向量索引 → 建 corpus → 写配置 → 启动 全做一遍。之前原 workspace 报了权限错误，agent 就新开了一个——然后整套重建。只读盘点 manifest：同一 KB hash `7fa46e49…`、同一模型 revision、同一向量 hash `56508cad…` 的 391 条索引在 `m9-01`、`m9-05`、`m10-06`、`m10-deepseek-live`、`m10-09` 五个目录里各一份，每份 2.62 MB。',
      en: 'The acceptance script called `prepare_demo(PDF, new workspace)`. That convenience function, seeing an empty workspace, does everything: verify PDF → build KB → build vector index → corpus → config → serve. A permission error on the original workspace had made the agent create a new one — and rebuild the lot. A read-only count of manifests found the same 391-row index — same KB hash `7fa46e49…`, same model revision, same vector hash `56508cad…` — in five places: `m9-01`, `m9-05`, `m10-06`, `m10-deepseek-live`, `m10-09`, 2.62 MB each.',
    },
    changed: {
      ja: '仕様に「機能側は登録済みデータ資産を読み取り専用で消費する」「再構築・複製・ダウンロードは個別承認」「権限不足は資産不在ではない、止まって報告」を入れた。検証ツールには `--runtime` を明示させ、既定では build を呼べないようにする方針。索引は「どの段階で作ったか」ではなく「内容の同一性（PDF・KB・モデル・次元）」で一箇所に置く設計へ。重複の削除は参照関係を監査するまでやっていない。',
      zh: '规格里加了"功能侧只读消费已登记的数据资产""重建、复制、下载要单独批准""权限不足不等于资产不存在，停下来报告"。验收工具必须显式传 `--runtime`，默认不能调 build。索引改为按"内容身份（PDF、KB、模型、维度）"存一份，而不是按"哪个阶段生成"。重复的删除在引用关系审计完成前没有动。',
      en: 'The spec gained three lines: feature code consumes registered data assets read-only; rebuilds, copies and downloads need individual approval; "permission denied" is not "asset missing" — stop and report. Acceptance tools must take an explicit `--runtime` and cannot call build by default. Indexes move to one location keyed by content identity (PDF, KB, model, dimension) instead of by the milestone that built them. The duplicates have not been deleted — not until the reference audit is done.',
    },
    facts: [
      { label: 'Issue #180 (M10-09)', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/180' },
      { label: 'PR #181', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/181' },
    ],
    tags: ['data', 'ownership'],
  },
  {
    id: 'scope-global',
    date: '2026-09-14',
    work: 'j-grad',
    title: { ja: 'CI は全部緑。数学系の例外規則が「全学共通」になっていた', zh: 'CI 全绿。数学系的例外规则被标成了"全校通用"', en: 'CI all green. A math-department exception had become "university-wide"' },
    hook: {
      ja: 'PR #108 の審査で見つかった。`infer_scope()` が大章節のフォールバックを学系マッチより先に置いたため、`fact:00105`（数学系の英語の例外）が `global` と判定された。隣の `fact:00106` にはテストがあり、それは通っていた。',
      zh: 'PR #108 审查时发现。`infer_scope()` 把大章节 fallback 放在了系别匹配之前，`fact:00105`（数学系的英语例外）被标成 `global`。旁边的 `fact:00106` 有测试保护，所以 CI 通过了。',
      en: 'Found in the review of PR #108. `infer_scope()` applied the big-section fallback before department matching, so `fact:00105` (a math-department English exception) became `global`. The neighbouring `fact:00106` had a test, and that one passed.',
    },
    what: {
      ja: 'RAG の誤りは生成側だけで起きるのではない。検索の手前で「この事実は誰に適用されるか」を取り違えると、その後の引用は全部正しく見えて、全部違う相手を支えている。テストは「直したい一条」だけを守っていた。',
      zh: 'RAG 的错误不只发生在生成端。检索之前把"这条事实适用于谁"搞错，后面所有引用看起来都对，却都在支持错误的对象。测试只保护了"想修好的那一条"。',
      en: 'RAG errors do not only happen at generation. Get "who does this fact apply to" wrong before retrieval, and every later citation looks correct while supporting the wrong party. The test protected only the one line someone wanted fixed.',
    },
    changed: {
      ja: 'override を構造階層で絞り、本当に共通条項である葉レベルの段落だけ残す。Fact ID や本文キーワードでの特別扱いはしない。同じ実 PDF から隣接する正例と反例を追加した。結果：318 Fact は維持、00105 は数学系、00106 は global。',
      zh: '按结构层级收窄 override，只保留确实是共通条款的叶级段落；不按 Fact ID 或正文关键词特判。从同一份真实 PDF 加了相邻的正反例。结果：318 个 Fact 保持，00105 归数学系，00106 为 global。',
      en: 'Narrowed the override by structural level, keeping only leaf paragraphs that really are common clauses; no special-casing by Fact ID or keywords. Added adjacent positive and negative examples from the same real PDF. Result: 318 Facts kept, 00105 is department-level, 00106 is global.',
    },
    facts: [
      { label: 'PR #108 審査', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/108#issuecomment-5660330591' },
    ],
    tags: ['RAG', 'testing', 'scope'],
  },
  {
    id: 'mineru-reject',
    date: '2026-09-27',
    work: 'j-grad',
    title: { ja: '新しいパーサーは採用しなかった。失敗した試験も、完全な納品にした', zh: '新解析器没有采用。失败的试验也做成了完整交付', en: 'The new parser was not adopted. The failed trial became a complete deliverable anyway' },
    hook: {
      ja: 'MinerU 4.0.7 のパイロット。世代をまたいで 21 の監督記録、388 ページパスの試行（上限 168 を超過）。最終報告は Legacy 30/41、Flash 33/41。どちらも採用基準に届かず、決定は reject。',
      zh: 'MinerU 4.0.7 的试点。跨多代累计 21 条监督记录、388 次页面尝试（超过 168 的上限）。最终报告 Legacy 30/41、Flash 33/41，都没到采用门槛，决定是 reject。',
      en: 'The MinerU 4.0.7 pilot. Across generations: 21 supervision records, 388 attempted page passes (over the 168 cap). Final report: Legacy 30/41, Flash 33/41. Neither reached the adoption bar; the decision was reject.',
    },
    what: {
      ja: '途中で `fallback` 案が出て、それを結論にしかけた。Basic 構成の一回がハングしたので「このパーサーは遅い」と言いたくなった。どちらも証拠が足りなかった。',
      zh: '中途出过一个 `fallback` 方案，差点当成结论。Basic 配置有一次卡住，就想说"这个解析器很慢"。两者证据都不够。',
      en: 'A `fallback` draft appeared mid-way and nearly became the conclusion. One Basic-config run hung, and it was tempting to say "this parser is slow". Neither claim had enough evidence.',
    },
    changed: {
      ja: '予算は実行世代をまたいで累計し、失敗した試行も数える。監査では作業プロセス・監督パイプ・タイムアウト・未完了サンプルを分けて記録。受け入れたのは「失敗した試験の証拠と撤退の結論」であって、新パーサーの導入ではない。既存の製品パイプラインはそのまま。',
      zh: '预算跨执行代次累计，失败的尝试也算；审计里把工作进程、监督管道、超时、未完成样本分开记。接受的是"失败试验的证据和退出结论"，不是新解析器上线。现有产品链不动。',
      en: 'Budget accumulates across run generations and failed attempts count. The audit records worker process, supervision pipe, timeouts and incomplete samples separately. What was accepted is the evidence of a failed trial and the decision to exit — not a new parser. The existing pipeline stayed.',
    },
    facts: [
      { label: 'Issue #177', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/177' },
      { label: 'PR #200', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/200#issuecomment-5855818419' },
      { label: 'パイロット最終報告', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/onboarding/mineru-4.0.7-pilot-report.md' },
    ],
    tags: ['evaluation', 'decision'],
  },
  {
    id: 'deliverable-pack',
    date: '2026-10-01',
    work: 'j-grad',
    title: { ja: '自分が伝言係になっていた。納品単位を「小タスク」から「成果パック」へ', zh: '我成了传话员。交付单位从"小任务"改成"成果包"', en: 'I had become a messenger. Delivery unit changed from "small tasks" to "result packs"' },
    hook: {
      ja: '開発エージェントの要約を設計エージェントに貼り、返事をまた貼る。自分は小さな修正を同期しているだけで、段階の成果が見えない。一方でフロントエンド・報告・出典説明が似た設定を三重に持ち、ずれるリスクが増えていた。',
      zh: '把开发 agent 的摘要贴给设计 agent，再把回复贴回去。我只是在同步小修小改，看不到阶段成果。另一边，前端、报告、来源说明三处维护相近的配置，漂移风险在涨。',
      en: 'Paste the dev agent\'s summary to the design agent, paste the reply back. I was syncing small fixes and could not see the stage result. Meanwhile the front end, the report and the source notes each kept a near-copy of the same config, and drift was growing.',
    },
    what: {
      ja: '#277 で出典修正を自己点検つきで #275 の実装へ連続して進める許可を出し、出典と画面をまとめて審査に回した。#278 で出典断片・課程範囲・指紋許可の論点を一度に列挙し、逐点確認をやめた。M18 は新しい開発対話で A→B→C→D を一つの成果パック、PR 一本で納品。同じ著者データから画面と報告を派生させる方式へ。',
      zh: '#277 允许来源修正自检后连续推进 #275 的实现，来源和界面一起交审。#278 一次列出来源片段、课程范围、指纹授权的问题，不再逐点确认。M18 新开开发对话，A→B→C→D 作为一个成果包、一个 PR 交付；同一份作者数据派生页面和报告。',
      en: '#277 allowed the source fix to continue straight into the #275 implementation with self-checks, sending sources and screens to review together. #278 listed the source-fragment, course-scope and fingerprint-permission questions in one go instead of point by point. M18 opened a fresh dev conversation delivering A→B→C→D as one pack in one PR, with screens and report derived from a single author dataset.',
    },
    changed: {
      ja: '#289 の納品は使い方・回帰・実データの往復を含み、設計側が集中して受け入れ。#293 は authoring→config の五主題生成を検証。前後の工数を比べる実験はないので「効率が○%上がった」とは言えない。言えるのは、引き継ぎパックが完全になり、重複入力点が減り、自分が子ステップごとに伝言しなくてよくなったこと。',
      zh: '#289 的交付含完整使用说明、回归和真实数据闭环，设计方集中验收。#293 验证了 authoring→config 的五主题生成。没有前后工时对比实验，不能说"效率提升了 X%"。能说的是：交接包完整了、重复录入点少了、我不用再按子步骤传话。',
      en: '#289 shipped with full usage notes, regression and a real-data round trip, accepted in one pass by the design side. #293 verified the authoring→config generation for five topics. There is no before/after time study, so no "X% faster" claim. What can be said: hand-off packs became complete, duplicate entry points fell, and I stopped relaying every sub-step.',
    },
    facts: [
      { label: '#277 成果パック協定', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/277#issuecomment-5943317153' },
      { label: '#278 集中受け入れ', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/278#issuecomment-5945290113' },
      { label: 'PR #289', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/289' },
    ],
    tags: ['agents', 'process'],
  },
  {
    id: 'agents-md',
    date: '2026-10-24',
    title: { ja: '「三回の実行権限は使い切りました」——指示書を書き換えた翌日、同じモデルが普通に話した', zh: '"三次执行授权已用完"——改了指令第二天，同一个模型开始说人话', en: '"All three execution authorizations are exhausted" — the day after I rewrote the instructions, the same model spoke plainly' },
    hook: {
      ja: '工学担当エージェント E の報告はこうだった：「三次実際の試行の授権は使い切った。四回目の呼び出し、時限延長、モデル変更の授権はない。未知の使用量は全額占有のまま保持する。」何を理解していて何を理解していないのか、読んでも分からなかった。',
      zh: '工程端 agent E 的报告是这样的："三次实际尝试的授权均已用完，没有第四次调用、延长时限或改变模型的授权。未知用量整额占额仍保留。"读完也看不出它到底懂了什么、没懂什么。',
      en: 'The engineering agent E reported like this: "All three real-attempt authorizations are exhausted; there is no authorization for a fourth call, a time extension or a model change. Unknown usage remains fully reserved." I could not tell what it had understood and what it had not.',
    },
    what: {
      ja: '原因は私が書いた AGENTS.md だった。全文が禁止事項と定義——「モデル出力は証拠であって承認ではない」「REVIEW は ACCEPTED を意味しない」「オフライン受領証は pending であって APPLIED ではない」——で、プロジェクトの目的は一行もない。モデルは指示文の文体を鏡のように返す。禁止事項が多いほど、返事は「〜は〜とみなさない」の自己弁護で埋まった。grill-me 系のスキルを足しても変わらなかった：あれは要件を深掘りする道具で、出力の読みやすさの道具ではない。',
      zh: '原因是我自己写的 AGENTS.md。全文是禁令和定义——"模型输出是证据不是批准""REVIEW 不等于 ACCEPTED""离线回执是 pending 不是 APPLIED"——项目的目的一行都没有。模型会镜像指令的文体：禁令越多，回复里"〜不视为〜"的自我辩护就越多。加 grill-me 之类的 skill 也没用，那是深挖需求的工具，不是让输出可读的工具。',
      en: 'The cause was the AGENTS.md I had written. All of it was prohibitions and definitions — "model output is evidence, never approval", "REVIEW does not mean ACCEPTED", "offline receipts are pending, never APPLIED" — and not one line about what the project was for. Models mirror the register of their instructions: the more prohibitions, the more the replies filled with "X is not to be regarded as Y" self-defence. Adding grill-me-style skills changed nothing; those dig into requirements, they do not make output readable.',
    },
    changed: {
      ja: '指示書の先頭を「この仕事は何のためか、誰が使うか、何ができたら成功か」の三文にし、禁止事項は不可逆なもの（旧資産の reset/stash/上書き、force push、認証情報のコピー）だけ残した。着手前に「私が理解したのは／完成形は／触らないもの」を三文で復唱させ、報告は「結論一文／証拠／あなたの判断が要ること」の三段固定。翌日の E の復唱：「私が理解したのは、日本の AI 職の要件とあなたの成果を照らして技術の欠落を見つけ、プロジェクト概要にして渡したら止まること。」同じモデルである。',
      zh: '指令开头改成三句话：这件事为了什么、谁在用、做成什么样算成功；禁令只留不可逆的（reset/stash/覆盖旧资产、force push、复制凭证）。开工前三句复述，汇报固定三段（结论一句 / 证据 / 需要你决定什么）。第二天 E 的复述："我理解你要的是：由我对照日本 AI 岗位要求和你已有的成果，找出技术缺口，写成项目简报，交付后就停。"同一个模型。',
      en: 'The instructions now open with three sentences — what this is for, who uses it, what counts as done — and the only prohibitions left are irreversible ones (reset/stash/overwrite old assets, force push, copying credentials). Before starting: restate in three sentences. Reports: one-line conclusion / evidence / what you must decide. E\'s restatement the next day: "I understand you want me to compare Japanese AI-role requirements with your existing work, find the technical gaps, write them up as project briefs, and stop once delivered." Same model.',
    },
    facts: [
      { label: 'COLLABORATION.md（内部）' },
    ],
    tags: ['agents', 'prompting'],
  },
  {
    id: 'llm-judge',
    date: '2026-10-24',
    work: 'coach',
    title: { ja: '審査員だけが気づいた：「〇〇さんは？」は相手に成立しない', zh: '只有审查员发现：「〇〇さんは？」对对方不成立', en: 'Only the judge noticed: "and you?" does not work on this listener' },
    hook: {
      ja: '日本語コーチの返答を 20 文で回帰テストする。生成は Sonnet、審査は別コンテキストの Opus。v6 の結果は形式 20/20、⭐ 20/20、⚠ 20/20、文法の硬性エラー 0。それでも審査員は二回続けて同じ指摘をした。',
      zh: '用 20 句回归测试日语教练的回复。生成用 Sonnet，审查用另一上下文的 Opus。v6 的结果：格式 20/20、⭐ 20/20、⚠ 20/20、语法硬性错误 0。审查员仍然连续两轮提了同一个问题。',
      en: 'Twenty sentences regression-test the Japanese coach. Sonnet generates; Opus, in a separate context, judges. v6 scored format 20/20, ⭐ 20/20, ⚠ 20/20, zero hard grammar errors. The judge still raised the same point two rounds in a row.',
    },
    what: {
      ja: '相手が日本人なのに「〇〇さんは？（日本に来てどれくらい）」と聞き返す。同じ場所にいるのに「そっちは？」と聞く。相手が先に「お疲れ様です」と言ったのに、返さずに本題へ行く。どれも文法は正しく、礼儀レベルも合っている。生成側の自己チェック（SKILL.md の「自分で確認」項目）では一度も引っかからなかった。審査員が別コンテキストで、相手の立場から読んだから見えた。',
      zh: '对方是日本人，却反问「〇〇さんは？（来日本多久了）」；两人在同一处，却问「そっちは？」；对方先说了「お疲れ様です」，回复没接就进正题。每条语法都对，礼貌等级也对。生成侧的自检（SKILL.md 里的"自己确认"项）一次都没拦住。审查员在另一个上下文里、站在对方立场读，才看得见。',
      en: 'Asking a Japanese listener "and you — how long have you been in Japan?"; asking "how about over there?" when both are in the same place; skipping the return greeting when the other person opened with "otsukaresama desu". All grammatical, all at the right politeness level. The generator\'s self-check (the "verify yourself" items in SKILL.md) never caught one. The judge saw it because it read from the listener\'s side, in a separate context.',
    },
    changed: {
      ja: '規則に「反問と挨拶は相手にも成立すること」を追加し、もう一周回帰を回す予定。審査員もモデルなので生成側と盲点を共有しうる——最終判断は母語話者の人手抽査に置き、未実施は status.md に「待你执行」と書いたままにしている。',
      zh: '规则里加"反问和寒暄要对对方也成立"，再跑一轮回归。审查员也是模型，可能和生成侧共享盲点——最终判断放在母语者的人工抽查，没做的就在 status.md 里写着"待你执行"。',
      en: 'A rule is being added — "return questions and greetings must hold for the listener too" — with one more regression round. The judge is a model and can share the generator\'s blind spots, so the final word stays with native-speaker spot checks; what has not been done is left in status.md as "pending: you".',
    },
    facts: [
      { label: 'status.md', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/status.md' },
      { label: 'D-005 LLM-as-judge', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/decisions.md' },
    ],
    tags: ['evaluation', 'LLM-as-judge'],
  },
];
