// 成果物 — one record per work, the seven fields nobody else fills:
// problem / my role & how AI was used / stack / one checkable number / how it was verified / what I'd change / links.
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
export interface Work {
  id: string;
  name: string;
  period: string;
  status: L;
  tagline: L;
  problem: L;
  role: L;
  stack: string[];
  number: { value: string; label: L; href: string };
  verification: L;
  change: L;
  links: { label: string | L; href: string }[];
  image?: { src: string; alt: L };
  /** Real, unedited screenshots of the public demo (source and capture date in the caption). */
  media?: { src: string; width: number; height: number; label: L; alt: L; caption?: L; video?: boolean; poster?: string }[];
  /** Three things the visitor can do in the screens, in order. */
  points?: L[];
  noteId?: string; // link into AI 協働の記録
}

export const works: Work[] = [
  {
    id: 'j-grad',
    name: 'J-Grad Admission RAG',
    period: '2026-07 → 2026-10',
    status: { ja: '公開デモあり・保守中', zh: '有公开 demo · 维护中', en: 'Public demo · maintained' },
    tagline: {
      ja: '大学院募集要項を、根拠のページまで辿れる出願支援情報に整理する',
      zh: '把研究生院募集要项整理成能追溯到原文页码的申请支援信息',
      en: 'Turns graduate-admission guidelines into applicant guidance that cites the official page',
    },
    problem: {
      ja: '留学塾の教務担当者は、研究科共通の要項と専攻別資料を往復しながら同じ情報を何度も調べる。LLMに丸投げすると出典が消える。',
      zh: '留学塾的教务要在研究科共通要项和专业资料之间来回查同样的信息；全交给 LLM 则出处会丢。',
      en: 'Advisers at a study-abroad school re-check the same facts across shared and program-specific guidelines; handing it to an LLM loses the source.',
    },
    role: {
      ja: '要件定義・仕様の判断・受け入れ・方針転換は私。実装の大半は Codex / Claude Code が書き、私は実データと回帰テストで検証した。',
      zh: '需求、规格判断、验收、方向调整是我；实现大半由 Codex / Claude Code 写，我用真实数据和回归测试验证。',
      en: 'Requirements, spec decisions, acceptance and course changes were mine; most code was written by Codex / Claude Code and verified by me against real data and regression tests.',
    },
    stack: ['Python', 'FastAPI', 'PyMuPDF', 'BGE-M3', 'BM25 / RRF', 'Pydantic', 'pytest', 'Playwright', 'GitHub Actions'],
    number: {
      value: 'Recall@10 0.8852 · MRR 0.8323',
      label: { ja: '固定42問・391件のKBでの評価結果（2026-09-24保存）', zh: '固定 42 题 · 391 条 KB 的保存评测（2026-09-24）', en: 'saved evaluation, 42 fixed queries, 391-entry KB (2026-09-24)' },
      href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json',
    },
    verification: {
      ja: '実PDFを使った一連の処理の確認、固定ベンチマークの回帰テストによる合否判定、ブラウザでの受け入れテスト（PC／スマホ）。CIではモデル性能を毎回再測定しない——その区別を公開文書に記した。',
      zh: '真实 PDF 端到端确认、固定基准回归门、浏览器验收（桌面/手机）。CI 不每次重测模型——这个区别写进了公开文档。',
      en: 'End-to-end runs on the real PDF, a regression gate on a fixed benchmark, browser acceptance on desktop and mobile. CI does not re-measure the model each run — the docs say so.',
    },
    change: {
      ja: '最初の7マイルストーンで基盤を作り込みすぎ、ユーザーが一連の操作を完了できる画面はM8まで出せなかった。次は範囲を絞り、一連の操作ができる機能を先に出す。',
      zh: '前 7 个里程碑把基础设施做得太满，用户能走通一条路径的界面到 M8 才出现。下次先出窄而完整的垂直切片。',
      en: 'The first seven milestones over-built the foundation; a screen a user could walk through only appeared at M8. Next time: a narrow vertical slice first.',
    },
    links: [
      { label: 'Demo', href: 'https://yasu-isct.github.io/J-Grad-Admission-RAG/' },
      { label: 'GitHub', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG' },
      { label: { ja: '技術解説', zh: '技术解说（日文）', en: 'Engineering notes (ja)' }, href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/portfolio/engineering-ja.md' },
    ],
    // Public-demo captures, bytes unchanged: isct-overview from docs/assets/portfolio/public-demo (2026-10-21);
    // the rest from docs/assets/portfolio/public-demo-2 (PR #303, captured 2026-10-25, gh-pages 112211e).
    // A = evidence relations → source → back, B = requirements → preparation, C = phone report.
    media: [
      { src: '/media/j-grad/a-evidence-main.png', width: 1440, height: 1000, label: { ja: 'A1 / 資料の関係', zh: 'A1 / 资料关系', en: 'A1 / Evidence relations' }, alt: { ja: 'J-Grad 公開デモ：英語スコア証明に関する三つの資料の関係を表示したデスクトップ画面', zh: 'J-Grad 公开演示：显示英语成绩证明相关三份资料关系的桌面画面', en: 'J-Grad public demo: desktop screen showing how three documents relate for the English-score certificate' }, caption: { ja: '英語スコア証明の根拠となる募集要項・入試案内・追加提出物一覧を、資料の役割とともに確認する。矢印は参照・補足関係で、三つすべてを提出する意味ではない。', zh: '查看英语成绩证明的根据：募集要项、入试案内、追加提交物一览及各自的作用。箭头是参照/补充关系，不表示三份都要提交。', en: 'The guideline, exam guide and supplementary list behind the English-score certificate, with each document\'s role. Arrows show reference relations, not "submit all three".' } },
      { src: '/media/j-grad/a-relations-detail.png', width: 792, height: 328, label: { ja: 'A2 / カードと矢印', zh: 'A2 / 卡片与箭头', en: 'A2 / Cards and arrows' }, alt: { ja: '資料の役割と関係を示すカードと矢印の局部', zh: '显示资料作用与关系的卡片和箭头局部', en: 'Detail of the document cards, relation arrows and the open-source button' }, caption: { ja: '各資料のカード、関係を示す矢印、原文を開くボタンの切り出し。', zh: '各资料的卡片、表示关系的箭头、打开原文的按钮。', en: 'Each document\'s card, the relation arrows and the button that opens the source.' } },
      { src: '/media/j-grad/a-original-detail.png', width: 840, height: 634, label: { ja: 'A3 / 原文へ', zh: 'A3 / 到原文', en: 'A3 / To the source' }, alt: { ja: '入試案内のPDF28ページに対応する原文の局部', zh: '对应入试案内 PDF 第 28 页的原文局部', en: 'Detail of the source text matching page 28 of the exam-guide PDF' }, caption: { ja: 'カードから開いた入試案内 PDF 28 ページの原文と、出典のページ情報。', zh: '从卡片打开的入试案内 PDF 第 28 页原文和出处页码。', en: 'The source passage from page 28 of the exam guide, opened from the card, with its page reference.' } },
      { src: '/media/j-grad/a-return-detail.png', width: 840, height: 602, label: { ja: 'A4 / 戻る', zh: 'A4 / 返回', en: 'A4 / Back' }, alt: { ja: '原文から資料の関係に戻った画面の局部', zh: '从原文返回资料关系图的画面局部', en: 'Detail of the screen after returning from the source to the relation view' }, caption: { ja: '原文の「資料の関係に戻る」から、同じ資料の関係図へ戻った状態。', zh: '从原文的「資料の関係に戻る」回到同一张资料关系图。', en: 'Back at the same relation view via "return to the document relations".' } },
      { src: '/media/j-grad/a-evidence-walkthrough.webm', width: 1440, height: 1000, video: true, poster: '/media/j-grad/a-evidence-main.png', label: { ja: 'A5 / 操作動画 10秒', zh: 'A5 / 操作视频 10 秒', en: 'A5 / 10-second walkthrough' }, alt: { ja: '資料の関係から原文を開いて戻る操作の無音録画（10秒）', zh: '从资料关系打开原文再返回的无声录屏（10 秒）', en: 'Silent 10-second recording: open the source from the relations and return' }, caption: { ja: '資料の関係 → 原文 → 戻る、を後処理なしで録画。自動再生しない。', zh: '资料关系 → 原文 → 返回，未经后处理的录屏。不自动播放。', en: 'Relations → source → back, recorded without post-processing. Never autoplays.' } },
      { src: '/media/j-grad/b-requirements.png', width: 1440, height: 1000, label: { ja: 'B1 / 基本要件の原文', zh: 'B1 / 基本要件原文', en: 'B1 / Requirements source' }, alt: { ja: '基本要件から開いた入学志願票の原文', zh: '从基本要件打开的入学志愿票原文', en: 'The application-form source opened from the basic requirements' }, caption: { ja: '第2ステップの基本要件から「入学志願票」の原文を開き、準備の根拠となる公式資料を確認する。', zh: '从第 2 步的基本要件打开「入学志愿票」原文，确认准备的依据。', en: 'From step 2, open the application-form source that the preparation rests on.' } },
      { src: '/media/j-grad/b-prepare-action.png', width: 1440, height: 1000, label: { ja: 'B2 / 本人の状況と照合', zh: 'B2 / 与本人情况核对', en: 'B2 / Match my situation' }, alt: { ja: '第3ステップの本人情報と準備状況を確認するボタン', zh: '第 3 步的本人信息与准备状况确认按钮', en: 'Step 3: the sample applicant\'s details and the check button' }, caption: { ja: '第3ステップで固定サンプルの本人情報を表示し、準備状況の確認へ進む。', zh: '第 3 步显示固定样例的本人信息，进入准备状况确认。', en: 'Step 3 shows the fixed sample applicant and moves on to the preparation check.' } },
      { src: '/media/j-grad/b-preparation-result.png', width: 1440, height: 1000, label: { ja: 'B3 / 準備状況', zh: 'B3 / 准备状况', en: 'B3 / Preparation status' }, alt: { ja: '第4ステップの準備状況と次の行動', zh: '第 4 步的准备状况与下一步行动', en: 'Step 4: preparation status and next actions' }, caption: { ja: '準備・対応が必要な項目と確認が必要な項目を整理して表示。サンプルの自己申告に基づき、提出済み・受理を意味しない。', zh: '整理显示需要准备/应对的项目和需要确认的项目。基于样例的自我申报，不表示已提交或已受理。', en: 'Items to prepare and items to confirm, laid out. Based on the sample\'s self-report; not "submitted" or "accepted".' } },
      { src: '/media/j-grad/c-report-mobile-long.png', width: 366, height: 1841, label: { ja: 'C1 / スマホのレポート', zh: 'C1 / 手机报告', en: 'C1 / Phone report' }, alt: { ja: 'スマートフォンのレポート抜粋：保存済みサンプルの注記から書類の準備リスト冒頭まで', zh: '手机报告节选：从保存样例的注记到材料准备清单开头', en: 'Phone report excerpt: from the saved-sample note to the start of the document checklist' }, caption: { ja: '390×900 の視口で連続スクロールし、元の画素でつないだ抜粋（全文ではない）。', zh: '390×900 视口连续滚动，按原像素拼接的节选（非全文）。', en: 'Scrolled at 390×900 and stitched at original pixels; an excerpt, not the full report.' } },
      { src: '/media/j-grad/c-source-mobile.png', width: 390, height: 900, label: { ja: 'C2 / 原文の入口', zh: 'C2 / 原文入口', en: 'C2 / Source entry' }, alt: { ja: '第4ステップの入学志願票から開いた原文と公式PDFへの入口', zh: '从第 4 步的入学志愿票打开的原文和官方 PDF 入口', en: 'Source window opened from step 4 with the link to the official PDF' }, caption: { ja: 'レポートを閉じ、第4ステップから原文参照ウィンドウを開いた状態。', zh: '关闭报告后，从第 4 步打开原文参照窗口。', en: 'After closing the report, the source window opened from step 4.' } },
      { src: '/media/j-grad/isct-overview.png', width: 1440, height: 1000, label: { ja: 'D / 全体を見る', zh: 'D / 看全貌', en: 'D / Overview' }, alt: { ja: 'J-Grad 公開デモ：大学院募集要項の日程と必要書類を確認する画面', zh: 'J-Grad 公开演示：确认研究生院募集要项的日程与所需材料的画面', en: 'J-Grad public demo: screen checking the schedule and required documents of a graduate guideline' }, caption: { ja: '日程と必要書類の一覧。撮影：2026-10-21。', zh: '日程与所需材料一览。截图：2026-10-21。', en: 'Schedule and required documents. Captured 2026-10-21.' } },
    ],
    points: [
      { ja: '資料の中から、必要な情報を探す', zh: '从资料里找出需要的信息', en: 'Find what you need inside the documents' },
      { ja: '回答と根拠の対応を確かめる', zh: '核对回答与根据的对应', en: 'Check how each answer maps to its evidence' },
      { ja: '原文に戻って、条件を読み直す', zh: '回到原文，重读条件', en: 'Go back to the source and re-read the condition' },
    ],
    noteId: 'm10-drift',
  },
  {
    id: 'coach',
    name: 'Japanese Speaking Coach',
    period: '2026-10 →',
    status: { ja: '開発中（第2段階）', zh: '开发中（第二阶段）', en: 'In development (phase 2)' },
    tagline: {
      ja: '会話の最中に「聞き取る・返す・覚える」を支える日本語コーチ——Claude Skill と、GPU のリアルタイム字幕',
      zh: '在对话中支撑"听懂、接上、记住"的日语教练——Claude Skill + GPU 实时字幕',
      en: 'A Japanese conversation coach for the moment you are mid-conversation — a Claude Skill plus GPU real-time subtitles',
    },
    problem: {
      ja: '日本で暮らす中国語話者（N4–N2）が、店員の敬語や同僚の話し言葉に数秒で返せない場面を想定。説明が先に来る教材では、その場の返答を支えにくい。',
      zh: '在日本的中文母语者（N4–N2）面对店员敬语和同事口语，几秒内接不上话。先讲解释的教材帮不上忙。',
      en: 'Chinese speakers in Japan (N4–N2) cannot answer a clerk\'s keigo or a colleague\'s slang within seconds; textbooks that explain first do not help.',
    },
    role: {
      ja: '出力形式と教え方、判定ルール（⭐推奨表現を選ぶ5つの手順）、LLMによる評価を私が設計。Skill本文と字幕アプリの実装は Claude Code が担当。',
      zh: '输出格式与教学策略、⭐ 推荐的五步判定规则、LLM 评审的评测设计是我；Skill 正文和字幕应用的实现是 Claude Code。',
      en: 'I designed the output format, the five-step politeness rule behind the ⭐ pick and the LLM-judge evaluation; Claude Code implemented the Skill and the subtitle app.',
    },
    stack: ['Claude Skill', 'faster-whisper (kotoba-whisper)', 'CUDA', 'MeCab / fugashi', 'tkinter', 'Anki export'],
    number: {
      value: '20/20 · 8/8 · 0.25 s',
      label: { ja: '返答形式の回帰テスト 20/20、場面別練習 8/8 完了、字幕1文のデコード約0.25秒（RTX 5060）', zh: '回复格式回归 20/20、情景练习 8/8 走完、字幕单句解码约 0.25 秒（RTX 5060）', en: 'format regression 20/20, 8/8 role-play scenes completed, ~0.25 s per-sentence subtitle decode (RTX 5060)' },
      href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/status.md',
    },
    verification: {
      ja: '生成はSonnet、評価は別コンテキストのOpus（文法・立場・文体・読みの誤りは不可）。実際の利用者による試用と母語話者レビューは、まだ実施していない。',
      zh: '生成用 Sonnet、审查用另一上下文的 Opus（语法/立场/语体/读音为硬性）。真人试用和母语者审阅还没做——如实标未验证。',
      en: 'Generation with Sonnet, blind review with Opus in a separate context (grammar, stance, register, readings are hard checks). No real-user trial or native review yet — stated as unverified.',
    },
    change: {
      ja: 'テスト中の「ユーザー」も「学生」もモデルが演じている。次の一手は、字幕と返答提案を本番の会話でつなぐこと。',
      zh: '测试里的"用户"和"学生"都是模型扮演的。下一步是把字幕和接话建议在真实对话里接起来。',
      en: 'Both the "user" and the "student" in tests are played by models. The next step is wiring subtitles to reply suggestions in a real conversation.',
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/yasu-isct/japanese-speaking-coach' },
      { label: 'Decisions', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/decisions.md' },
    ],
    noteId: 'llm-judge',
  },
];
