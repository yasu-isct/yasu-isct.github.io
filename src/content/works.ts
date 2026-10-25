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
  links: { label: string; href: string }[];
  image?: { src: string; alt: L };
  /** Real, unedited screenshots of the public demo (source and capture date in the caption). */
  media?: { src: string; width: number; height: number; label: L; alt: L }[];
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
      label: { ja: '固定42問・391件KBの保存評価（2026-09-24）', zh: '固定 42 题 · 391 条 KB 的保存评测（2026-09-24）', en: 'saved evaluation, 42 fixed queries, 391-entry KB (2026-09-24)' },
      href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json',
    },
    verification: {
      ja: '実PDFでの端から端までの確認、固定ベンチマークの回帰ゲート、ブラウザ受け入れ（デスクトップ／スマホ）。CIはモデルを毎回測り直さない——その区別を公開文書に書いた。',
      zh: '真实 PDF 端到端确认、固定基准回归门、浏览器验收（桌面/手机）。CI 不每次重测模型——这个区别写进了公开文档。',
      en: 'End-to-end runs on the real PDF, a regression gate on a fixed benchmark, browser acceptance on desktop and mobile. CI does not re-measure the model each run — the docs say so.',
    },
    change: {
      ja: '最初の7マイルストーンで基盤を作り込みすぎ、ユーザーが一本道を通せる画面はM8まで出なかった。次は窄い垂直スライスを先に出す。',
      zh: '前 7 个里程碑把基础设施做得太满，用户能走通一条路径的界面到 M8 才出现。下次先出窄而完整的垂直切片。',
      en: 'The first seven milestones over-built the foundation; a screen a user could walk through only appeared at M8. Next time: a narrow vertical slice first.',
    },
    links: [
      { label: 'Demo', href: 'https://yasu-isct.github.io/J-Grad-Admission-RAG/' },
      { label: 'GitHub', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG' },
      { label: '技術解説', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/portfolio/engineering-ja.md' },
    ],
    // Public-demo captures from docs/assets/portfolio/public-demo at commit 2ce9930 (captured 2026-10-21), bytes unchanged.
    media: [
      { src: '/media/j-grad/isct-overview.png', width: 1440, height: 1000, label: { ja: '01 / 全体を見る', zh: '01 / 看全貌', en: '01 / Overview' }, alt: { ja: 'J-Grad 公開デモ：大学院募集要項の日程と必要書類を確認する画面', zh: 'J-Grad 公开演示：确认研究生院募集要项的日程与所需材料的画面', en: 'J-Grad public demo: screen checking the schedule and required documents of a graduate guideline' } },
      { src: '/media/j-grad/gsfs-evidence.png', width: 840, height: 602, label: { ja: '02 / 根拠へ戻る', zh: '02 / 回到根据', en: '02 / Back to the evidence' }, alt: { ja: 'J-Grad 公開デモ：三つの資料と根拠の対応を示すダイアログ', zh: 'J-Grad 公开演示：显示三份资料与根据对应关系的对话框', en: 'J-Grad public demo: dialog showing how three documents relate as evidence' } },
      { src: '/media/j-grad/isct-report-mobile.png', width: 390, height: 900, label: { ja: '03 / モバイル', zh: '03 / 手机', en: '03 / Mobile' }, alt: { ja: 'J-Grad 公開デモ：手機幅での準備レポート', zh: 'J-Grad 公开演示：手机宽度下的准备报告', en: 'J-Grad public demo: the preparation report at phone width' } },
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
      ja: '日本で暮らす中国語話者（N4–N2）は、店員の敬語や同僚の口語に数秒で返せない。説明が先に来る教材は役に立たない。',
      zh: '在日本的中文母语者（N4–N2）面对店员敬语和同事口语，几秒内接不上话。先讲解释的教材帮不上忙。',
      en: 'Chinese speakers in Japan (N4–N2) cannot answer a clerk\'s keigo or a colleague\'s slang within seconds; textbooks that explain first do not help.',
    },
    role: {
      ja: '出力フォーマットと教え方の設計、判定ルール（⭐ 推薦の5段階）、LLM審査員での評価設計は私。Skill本文と字幕アプリの実装は Claude Code。',
      zh: '输出格式与教学策略、⭐ 推荐的五步判定规则、LLM 评审的评测设计是我；Skill 正文和字幕应用的实现是 Claude Code。',
      en: 'I designed the output format, the five-step politeness rule behind the ⭐ pick and the LLM-judge evaluation; Claude Code implemented the Skill and the subtitle app.',
    },
    stack: ['Claude Skill', 'faster-whisper (kotoba-whisper)', 'CUDA', 'MeCab / fugashi', 'tkinter', 'Anki export'],
    number: {
      value: '20/20 · 8/8 · 0.25 s',
      label: { ja: '返答フォーマット回帰 20/20、情景練習 8/8 完走、字幕の1文デコード約0.25秒（RTX 5060）', zh: '回复格式回归 20/20、情景练习 8/8 走完、字幕单句解码约 0.25 秒（RTX 5060）', en: 'format regression 20/20, 8/8 role-play scenes completed, ~0.25 s per-sentence subtitle decode (RTX 5060)' },
      href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/status.md',
    },
    verification: {
      ja: '生成はSonnet、審査は別コンテキストのOpus（文法・立場・語体・読みは硬性）。真人の試用と母語話者レビューはまだ——未検証と書く。',
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
