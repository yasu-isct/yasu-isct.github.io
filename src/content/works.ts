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
  number: { value: string; display?: Partial<L>; summary?: Partial<L>; label: L; href: string };
  mediaNote?: L;
  verification: L;
  change: L;
  links: { label: string | L; href: string }[];
  image?: { src: string; alt: L };
  /** Real, unedited screenshots of the public demo (source and capture date in the caption). */
  media?: { src: string; width: number; height: number; label: L; alt: L; caption?: L; video?: boolean; poster?: string; placement?: 'supporting' }[];
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
      ja: '日本の大学院募集要項から、出願に関する情報を出典ページとともに確認できる検索システムです。',
      zh: '把研究生院募集要项整理成能追溯到原文页码的申请支援信息',
      en: 'Turns graduate-admission guidelines into applicant guidance that cites the official page',
    },
    problem: {
      ja: '留学塾の教務担当者は、研究科共通の要項と専攻別資料を行き来しながら、同じ情報を何度も調べています。LLM に回答を任せるだけでは、出典を保持できない場合があります。',
      zh: '留学塾的教务要在研究科共通要项和专业资料之间来回查同样的信息；全交给 LLM 则出处会丢。',
      en: 'Advisers at a study-abroad school re-check the same facts across shared and program-specific guidelines; handing it to an LLM loses the source.',
    },
    role: {
      ja: '要件定義、仕様の判断、受け入れ判断、方針の見直しは私が担当しました。実装の大半は Codex / Claude Code が行い、私は実データと回帰テストで検証しました。',
      zh: '需求、规格判断、验收、方向调整是我；实现大半由 Codex / Claude Code 写，我用真实数据和回归测试验证。',
      en: 'Requirements, spec decisions, acceptance and course changes were mine; most code was written by Codex / Claude Code and verified by me against real data and regression tests.',
    },
    stack: ['Python', 'FastAPI', 'PyMuPDF', 'BGE-M3', 'BM25 / RRF', 'Pydantic', 'pytest', 'Playwright', 'GitHub Actions'],
    number: {
      value: 'Recall@10 0.8852 · MRR 0.8323',
      display: { ja: '検索評価：Recall@10 0.8852 · MRR 0.8323' },
      summary: { ja: '固定42問・391件のKBでの検索評価です（2026-09-24保存）。' },
      label: { ja: '固定42問・391件のKBでの評価結果（2026-09-24保存）', zh: '固定 42 题 · 391 条 KB 的保存评测（2026-09-24）', en: 'saved evaluation, 42 fixed queries, 391-entry KB (2026-09-24)' },
      href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json',
    },
    verification: {
      ja: '実 PDF を使った一連の処理を確認し、固定ベンチマークによる回帰テストと、PC・スマートフォンのブラウザでの受け入れテストを行いました。CI ではモデル性能を毎回再測定していないことも、公開文書に明記しています。',
      zh: '真实 PDF 端到端确认、固定基准回归门、浏览器验收（桌面/手机）。CI 不每次重测模型——这个区别写进了公开文档。',
      en: 'End-to-end runs on the real PDF, a regression gate on a fixed benchmark, browser acceptance on desktop and mobile. CI does not re-measure the model each run — the docs say so.',
    },
    change: {
      ja: '最初の7マイルストーンでは基盤を作り込みすぎ、ユーザーが一連の操作を完了できる画面を M8 まで出せませんでした。次は範囲を絞り、一連の操作を完了できる機能を先に届けます。',
      zh: '前 7 个里程碑把基础设施做得太满，用户能走通一条路径的界面到 M8 才出现。下次先出窄而完整的垂直切片。',
      en: 'The first seven milestones over-built the foundation; a screen a user could walk through only appeared at M8. Next time: a narrow vertical slice first.',
    },
    links: [
      { label: { ja: '公開デモ', zh: 'Demo', en: 'Demo' }, href: 'https://yasu-isct.github.io/J-Grad-Admission-RAG/' },
      { label: 'GitHub', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG' },
      { label: { ja: '技術解説', zh: '技术解说（日文）', en: 'Engineering notes (ja)' }, href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/portfolio/engineering-ja.md' },
    ],
    // Public-demo captures, bytes unchanged: isct-overview from docs/assets/portfolio/public-demo (2026-10-21);
    // the rest from docs/assets/portfolio/public-demo-2 (PR #303, captured 2026-10-25, gh-pages 112211e).
    // A = evidence relations → source → back, B = requirements → preparation, C = phone report.
    media: [
      { src: '/media/j-grad/a-evidence-main.png', width: 1440, height: 1000, label: { ja: 'A1 / 資料の関係', zh: 'A1 / 资料关系', en: 'A1 / Evidence relations' }, alt: { ja: 'J-Grad 公開デモ：英語スコア証明に関する三つの資料の関係を表示したデスクトップ画面', zh: 'J-Grad 公开演示：显示英语成绩证明相关三份资料关系的桌面画面', en: 'J-Grad public demo: desktop screen showing how three documents relate for the English-score certificate' }, caption: { ja: '英語スコア証明の根拠となる募集要項・入試案内・追加提出物一覧を、それぞれの役割とともに確認できます。矢印は参照・補足関係を示しており、三つすべての提出を意味するものではありません。', zh: '查看英语成绩证明的根据：募集要项、入试案内、追加提交物一览及各自的作用。箭头是参照/补充关系，不表示三份都要提交。', en: 'The guideline, exam guide and supplementary list behind the English-score certificate, with each document\'s role. Arrows show reference relations, not "submit all three".' } },
      { src: '/media/j-grad/a-relations-detail.png', width: 792, height: 328, label: { ja: 'A2 / カードと矢印', zh: 'A2 / 卡片与箭头', en: 'A2 / Cards and arrows' }, alt: { ja: '資料の役割と関係を示すカードと矢印の一部', zh: '显示资料作用与关系的卡片和箭头局部', en: 'Detail of the document cards, relation arrows and the open-source button' }, caption: { ja: '各資料のカード、関係を示す矢印、原文を開くボタンを抜き出した画面です。', zh: '各资料的卡片、表示关系的箭头、打开原文的按钮。', en: 'Each document\'s card, the relation arrows and the button that opens the source.' } },
      { src: '/media/j-grad/a-original-detail.png', width: 840, height: 634, label: { ja: 'A3 / 原文へ', zh: 'A3 / 到原文', en: 'A3 / To the source' }, alt: { ja: '入試案内のPDF28ページに対応する原文の一部', zh: '对应入试案内 PDF 第 28 页的原文局部', en: 'Detail of the source text matching page 28 of the exam-guide PDF' }, caption: { ja: 'カードから開いた入試案内の PDF 28ページの原文と、出典ページの情報を表示しています。', zh: '从卡片打开的入试案内 PDF 第 28 页原文和出处页码。', en: 'The source passage from page 28 of the exam guide, opened from the card, with its page reference.' } },
      { src: '/media/j-grad/a-return-detail.png', width: 840, height: 602, label: { ja: 'A4 / 戻る', zh: 'A4 / 返回', en: 'A4 / Back' }, alt: { ja: '原文から資料の関係に戻った画面の一部', zh: '从原文返回资料关系图的画面局部', en: 'Detail of the screen after returning from the source to the relation view' }, caption: { ja: '原文の「資料の関係に戻る」から、同じ資料の関係図へ戻った画面です。', zh: '从原文的「資料の関係に戻る」回到同一张资料关系图。', en: 'Back at the same relation view via "return to the document relations".' } },
      { src: '/media/j-grad/a-evidence-walkthrough.webm', width: 1440, height: 1000, video: true, poster: '/media/j-grad/a-evidence-main.png', label: { ja: 'A5 / 操作動画 10秒', zh: 'A5 / 操作视频 10 秒', en: 'A5 / 10-second walkthrough' }, alt: { ja: '資料の関係から原文を開いて戻る操作の無音録画（10秒）', zh: '从资料关系打开原文再返回的无声录屏（10 秒）', en: 'Silent 10-second recording: open the source from the relations and return' }, caption: { ja: '資料の関係から原文を開き、元の画面へ戻る操作を、後処理せずに録画しています。動画は自動再生しません。', zh: '资料关系 → 原文 → 返回，未经后处理的录屏。不自动播放。', en: 'Relations → source → back, recorded without post-processing. Never autoplays.' } },
      { src: '/media/j-grad/b-requirements.png', width: 1440, height: 1000, label: { ja: 'B1 / 基本要件の原文', zh: 'B1 / 基本要件原文', en: 'B1 / Requirements source' }, alt: { ja: '基本要件から開いた入学志願票の原文', zh: '从基本要件打开的入学志愿票原文', en: 'The application-form source opened from the basic requirements' }, caption: { ja: '第2ステップの基本要件から「入学志願票」の原文を開き、準備の根拠となる公式資料を確認できます。', zh: '从第 2 步的基本要件打开「入学志愿票」原文，确认准备的依据。', en: 'From step 2, open the application-form source that the preparation rests on.' } },
      { src: '/media/j-grad/b-prepare-action.png', width: 1440, height: 1000, label: { ja: 'B2 / 本人の状況と照合', zh: 'B2 / 与本人情况核对', en: 'B2 / Match my situation' }, alt: { ja: '第3ステップの本人情報と準備状況を確認するボタン', zh: '第 3 步的本人信息与准备状况确认按钮', en: 'Step 3: the sample applicant\'s details and the check button' }, caption: { ja: '第3ステップで固定サンプルの本人情報を表示し、準備状況の確認へ進みます。', zh: '第 3 步显示固定样例的本人信息，进入准备状况确认。', en: 'Step 3 shows the fixed sample applicant and moves on to the preparation check.' } },
      { src: '/media/j-grad/b-preparation-result.png', width: 1440, height: 1000, label: { ja: 'B3 / 準備状況', zh: 'B3 / 准备状况', en: 'B3 / Preparation status' }, alt: { ja: '第4ステップの準備状況と次の行動', zh: '第 4 步的准备状况与下一步行动', en: 'Step 4: preparation status and next actions' }, caption: { ja: '準備・対応が必要な項目と、確認が必要な項目を整理して表示しています。サンプルの自己申告に基づくもので、提出済み・受理を意味しません。', zh: '整理显示需要准备/应对的项目和需要确认的项目。基于样例的自我申报，不表示已提交或已受理。', en: 'Items to prepare and items to confirm, laid out. Based on the sample\'s self-report; not "submitted" or "accepted".' } },
      { src: '/media/j-grad/c-report-mobile-long.png', width: 366, height: 1841, label: { ja: 'C1 / スマホのレポート', zh: 'C1 / 手机报告', en: 'C1 / Phone report' }, alt: { ja: 'スマートフォンのレポート抜粋：保存済みサンプルの注記から書類の準備リスト冒頭まで', zh: '手机报告节选：从保存样例的注记到材料准备清单开头', en: 'Phone report excerpt: from the saved-sample note to the start of the document checklist' }, caption: { ja: '390×900 の画面で連続スクロールし、元の画素を保ったままつないだ抜粋です。全文ではありません。', zh: '390×900 视口连续滚动，按原像素拼接的节选（非全文）。', en: 'Scrolled at 390×900 and stitched at original pixels; an excerpt, not the full report.' } },
      { src: '/media/j-grad/c-source-mobile.png', width: 390, height: 900, label: { ja: 'C2 / 原文の入口', zh: 'C2 / 原文入口', en: 'C2 / Source entry' }, alt: { ja: '第4ステップの入学志願票から開いた原文と公式PDFへの入口', zh: '从第 4 步的入学志愿票打开的原文和官方 PDF 入口', en: 'Source window opened from step 4 with the link to the official PDF' }, caption: { ja: 'レポートを閉じ、第4ステップから原文参照ウィンドウを開いた画面です。', zh: '关闭报告后，从第 4 步打开原文参照窗口。', en: 'After closing the report, the source window opened from step 4.' } },
      { src: '/media/j-grad/isct-overview.png', width: 1440, height: 1000, label: { ja: 'D / 全体を見る', zh: 'D / 看全貌', en: 'D / Overview' }, alt: { ja: 'J-Grad 公開デモ：大学院募集要項の日程と必要書類を確認する画面', zh: 'J-Grad 公开演示：确认研究生院募集要项的日程与所需材料的画面', en: 'J-Grad public demo: screen checking the schedule and required documents of a graduate guideline' }, caption: { ja: '日程と必要書類の一覧です（撮影：2026-10-21）。', zh: '日程与所需材料一览。截图：2026-10-21。', en: 'Schedule and required documents. Captured 2026-10-21.' } },
    ],
    points: [
      { ja: '資料の中から、必要な情報を探せます。', zh: '从资料里找出需要的信息', en: 'Find what you need inside the documents' },
      { ja: '回答と根拠の対応を確認できます。', zh: '核对回答与根据的对应', en: 'Check how each answer maps to its evidence' },
      { ja: '原文に戻って、適用条件を読み直せます。', zh: '回到原文，重读条件', en: 'Go back to the source and re-read the condition' },
    ],
    mediaNote: { ja: '公開デモの画面です。保存済みサンプルを使っています。操作内容と撮影日は各図の説明をご覧ください。', zh: '公开演示画面，使用保存的样例。操作和拍摄日期见各图说明。', en: 'Public demo using saved samples. See each caption for the action and capture date.' },
    noteId: 'm10-drift',
  },
  {
    id: 'coach',
    name: 'Japanese Speaking Coach',
    period: '2026-10 →',
    status: { ja: "開発中（第2段階：字幕・返答候補・資料参照・復習が動作）", zh: "开发中（第二阶段：字幕、接话建议、资料参考、复盘都能运行）", en: "In development (phase 2: subtitles, replies, document answers and review working)" },
    tagline: {
      ja: "会話中の聞き取りと返答を支える Windows アプリです。PC 音声をふりがな付き字幕にし、発話の区切りで「そのまま言える」返答候補を3つ表示します。推奨の返答は結論を先に示し、自分の授業資料から出典付きで答えることもできます。",
      zh: "在日语对话中显示带假名的字幕和「能直接说出口」的接话建议的 Windows 应用；推荐的那条先说结论，也能参考自己的课程资料并注明出处",
      en: "A Windows app for the moment you are mid-conversation in Japanese: furigana subtitles and replies you can say as they are; the recommended reply leads with its conclusion and can answer from your own course documents with a citation",
    },
    problem: {
      ja: '日本で暮らす中国語話者（N4–N2）が、店員の敬語や同僚の話し言葉にすぐ返答できない場面を想定しています。解説を読むことが中心の教材では、その場の返答を支えにくいと考えています。',
      zh: '在日本的中文母语者（N4–N2）面对店员敬语和同事口语，几秒内接不上话。先讲解释的教材帮不上忙。',
      en: 'Chinese speakers in Japan (N4–N2) cannot answer a clerk\'s keigo or a colleague\'s slang within seconds; textbooks that explain first do not help.',
    },
    role: {
      ja: '出力形式と教え方、⭐ の推奨表現を選ぶ5段階の指示、LLM を用いた評価方法を私が設計しました。Skill 本文と字幕アプリの実装は Claude Code が担当しました。',
      zh: '输出格式与教学策略、⭐ 推荐的五步判定规则、LLM 评审的评测设计是我；Skill 正文和字幕应用的实现是 Claude Code。',
      en: 'I designed the output format, the five-step politeness rule behind the ⭐ pick and the LLM-judge evaluation; Claude Code implemented the Skill and the subtitle app.',
    },
    stack: ['Claude Skill', 'faster-whisper (large-v3-turbo)', 'CUDA', 'MeCab / fugashi', 'DeepSeek API', 'tkinter', 'Anki export'],
    number: {
      value: "2.21 s · 102/102 · 328 tests",
      display: { ja: "字幕→候補 p50 2.21 s · そのまま言える返答 102/102 · 単体テスト328件" },
      summary: { ja: "TTS 10文・1回（n=10）／RTX 5060 Laptop GPU。2.21 s は最後の字幕から候補の描画完了までです。102/102 は文字評価（20文×2）、328件はCPU上のロジックテスト数で、会話品質や学習効果の評価ではありません。" },
      label: { ja: "最後の字幕イベントから返答候補の描画完了まで p50 2.21 秒（p95 2.50 秒、10/10 が3秒以内）、音声認識 p50 0.25 秒です。TTS 10文・1回の実行（n=10）、RTX 5060 Laptop GPU で測定しました。音声入力からの総遅延ではありません。そのまま言える返答 102/102 は20文×2回の文字評価です。単体テスト328件はCPU上のロジックを対象とし、会話の自然さや学習効果を示す数字ではありません。", zh: "最后一句字幕到接话建议 p50 2.21 秒（p95 2.50），语音识别 p50 0.25 秒（RTX 5060，TTS 10 句）；能直接说出口的回复 102/102（20 句×2）；单元测试 328 个", en: "last subtitle to reply suggestions p50 2.21 s (p95 2.50), speech recognition p50 0.25 s (RTX 5060, 10 TTS sentences); replies sayable as they are 102/102 (20 sentences × 2); 328 unit tests" },
      href: "https://github.com/yasu-isct/japanese-speaking-coach/blob/1f0b93f443e804f10f27fb249f76afd3cee5574d/docs/showcase-ja.md",
    },
    verification: {
      ja: "数字は TTS 音声と文字の評価で測りました（速度 n=10、返答 20文×2、架空資料8問）。私自身が実際の動画と89分のオンライン授業で使用し、見つかった問題への対応を D-013〜D-041 に記録しています。最新版の実会話での確認、第三者の試用、日本語母語話者のレビューは未実施です。",
      zh: "数字来自 TTS 语音和文字评测（速度 n=10、回复 20 句×2、虚构资料 8 题）。作者本人在真实视频和一节 89 分钟的线上课里用过，发现的问题记录在 D-013〜D-041 并已修正。最新版的真实对话确认、第三方试用、母语者审阅尚未进行。",
      en: "Numbers come from TTS audio and text evaluations (speed n=10, replies 20 sentences × 2, 8 fictional document questions). The author used it on real videos and an 89-minute online class and fixed what broke (D-013–D-041). The latest version has not yet been checked in a real conversation; no third-party trial or native review yet.",
    },
    change: {
      ja: "別のエージェントに開発を任せた期間、「作り話をしない」という一つの指標だけを改善した結果、返答が「【参加できます／参加できません】」のような空欄だらけになり、そのまま言えなくなりました。評価も実際のアプリとは別の経路を測っていました。次は、変更ごとに「そのまま言えるか」も併せて測り、実際のアプリと同じ経路で評価します。",
      zh: "交给另一个 agent 推进时，只按「不编造」一个指标优化，结果回复满是【参加できます／参加できません】这类空格，没法直接说出口；评测测的也不是应用实际用的那套提示词。下次每次改动都同时测「能不能直接说」，并用和正式应用相同的路径评测。",
      en: "While another agent worked on it, optimising one metric (\"never invent facts\") filled the replies with blanks like 【参加できます／参加できません】, so they could no longer be said, and the evaluation measured a different prompt path from the real app. Next time: measure sayability with every change, on the same path as the real app.",
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/yasu-isct/japanese-speaking-coach' },
      { label: { ja: '設計判断', zh: 'Decisions', en: 'Decisions' }, href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/1f0b93f443e804f10f27fb249f76afd3cee5574d/docs/decisions.md' },
    ],
    // Hand-off from the coach session (docs/site/coach-site-facts.json, app commit 1f0b93f, captured 2026-10-28 offscreen from TTS audio / fictional documents, no personal data).
    media: [
      { src: "/media/coach/showcase-conversation.png", width: 900, height: 468, label: { ja: "01 / 会話中の返答候補", zh: "01 / 对话中的接话建议", en: "01 / Replies mid-conversation" }, alt: { ja: "字幕ウィンドウ：店員の「こちら温めますか」に対し、⭐ 丁寧「はい、お願いします。」を太字で表示。ほかの2案は1行、カジュアルに ⚠、最下行にもう一方の言い方「いえ、大丈夫です」", zh: "字幕窗：对店员「こちら温めますか」，⭐ 丁寧「はい、お願いします。」加粗显示；另两条各一行，カジュアル带 ⚠，最下面一行是另一种说法「いえ、大丈夫です」", en: "Subtitle window: to a clerk's \"shall I heat this?\", the ⭐ polite reply in bold; the other two on one line each, a ⚠ on casual, and the other answer \"no, it's fine\" ready below" }, caption: { ja: "TTS 音声または公開の架空資料で実行したアプリの画面です。人の会話を収録したものではありません。個人情報は含みません（2026-10-28）。", zh: "TTS 语音或公开虚构资料运行的应用画面，不含真人对话录音和个人信息（2026-10-28）。", en: "App screen from a TTS / fictional-document run; no recordings of people, no personal data (2026-10-28)." } },
      { src: "/media/coach/showcase-demo.webm", width: 900, height: 724, video: true, poster: "/media/coach/showcase-conversation.png", label: { ja: "02 / 操作動画 25秒", zh: "02 / 操作视频 25 秒", en: "02 / 25-second walkthrough" }, alt: { ja: "「聞き取り中」から字幕と3回分の返答候補が出るまでの無音録画（25秒、TTS 音声）", zh: "从「聞き取り中」到出现字幕和三轮接话建议的无声录屏（25 秒，TTS 语音）", en: "Silent 25-second recording from listening to subtitles and three rounds of replies (TTS audio)" }, caption: { ja: "TTS 音声による新しい実行を、アプリ自身のウィンドウだけ録画した25秒の無音動画です。人の会話を収録したものではありません。個人情報は含みません（2026-10-28）。", zh: "用 TTS 语音重新运行、只录应用自己窗口的 25 秒无声视频，不含真人对话和个人信息（2026-10-28）。", en: "A silent 25-second recording of only the app's own window during a fresh TTS run; no recordings of people, no personal data (2026-10-28)." } },
      { src: "/media/coach/showcase-document.png", width: 900, height: 420, label: { ja: "03 / 資料にもとづく回答", zh: "03 / 根据资料回答", en: "03 / Answer from documents" }, alt: { ja: "架空の講座ハンドブックにもとづく回答：結論「昼食は用意していません…」を太字、食べられる場所は次の行、理由に出典", zh: "根据虚构的课程手册回答：结论「昼食は用意していません…」加粗，可用餐地点在下一行，理由里注明出处", en: "Answer from a fictional course handbook: the conclusion (no lunch provided) in bold, where to eat on the next line, the source in the reason" }, caption: { ja: "TTS 音声または公開の架空資料で実行したアプリの画面です。人の会話を収録したものではありません。個人情報は含みません（2026-10-28）。", zh: "TTS 语音或公开虚构资料运行的应用画面，不含真人对话录音和个人信息（2026-10-28）。", en: "App screen from a TTS / fictional-document run; no recordings of people, no personal data (2026-10-28)." } },
      { src: "/media/coach/live-history-lookup.png", placement: 'supporting', width: 424, height: 1007, label: { ja: "04 / 履歴と単語", zh: "04 / 历史与查词", en: "04 / History and lookup" }, alt: { ja: "字幕履歴ウィンドウ：「可能」を選ぶと読み【かのう】と文脈上の意味が出る", zh: "字幕历史窗：选中「可能」后显示读音【かのう】和这句话里的意思", en: "History window: selecting 可能 shows its reading (かのう) and its meaning in this sentence" }, caption: { ja: "TTS 音声で実行したアプリの画面です。人の会話を収録したものではありません。個人情報は含みません（2026-10-25、app commit 3ba4bea）。", zh: "TTS 音声による再生・個人情報なし（2026-10-25、commit 3ba4bea）", en: "TTS 音声による再生・個人情報なし（2026-10-25、commit 3ba4bea）" } },
    ],
    points: [
      { ja: "難しい漢字にふりがなが付いた字幕を読めます。", zh: "看字幕——只给难的汉字注假名", en: "Read the subtitles — furigana only on the hard kanji" },
      { ja: "⭐ の返答を、太字の結論からそのまま口に出せます。", zh: "从加粗的结论开始，把 ⭐ 那条直接说出口", en: "Say the ⭐ reply as it is, starting from its bold conclusion" },
      { ja: "授業資料にもとづく回答と出典を確かめられます。", zh: "确认根据课程资料的回答和出处", en: "Check answers drawn from your course documents, with their source" },
    ],
    mediaNote: { ja: "公開画面と録画は TTS 音声または公開の架空資料による実行です。第三者試用・日本語母語話者レビューは未実施です。", zh: "公开画面与录像来自 TTS 语音或公开虚构资料的运行，尚未开展第三方试用和日语母语者审阅。", en: "Screens and video come from TTS audio or public fictional documents. Third-party trials and native-speaker review have not been conducted." },
    noteId: 'llm-judge',
  },
];
