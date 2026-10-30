// AI 協働の記録 — short, concrete episodes from building with generative AI.
// Reader-first shape: one scene sentence (set large), then at most three "what happened" lines and
// two "what I changed" lines, then checkable links. Written for a reader without an AI background:
// one everyday example per record, at most one number, and the number only when it changes the story.
// Facts come from the repos and saved reports; the links at the bottom of each record are the evidence.
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
    id: 'one-page-first',
    date: '2026-10-30',
    title: { ja: '七頁をまとめて作らず、一頁だけ先に見せる', zh: '不要七页一起做，先给一页看', en: 'Do not build all seven pages; show one first' },
    scene: {
      ja: '一日で七つの版を作り、七つとも作り直しになりました。PDF を出す道具は一度も止まらなかったのに。',
      zh: '一天做了七个版本，七个都被推倒重来。出 PDF 的工具一次都没出过错。',
      en: 'Seven versions in one day, all seven rebuilt. The tool that makes the PDF never failed once.',
    },
    what: {
      ja: ['企業の課題選考に出す資料を、文章と図を HTML で組んで PDF にする方法で作りました。直せば数分で新しい PDF が出ます。だから直すたびに七頁まとめて作り直し、まとめて見せていました。一つの判断が違うと、七頁が同時に違います。', '「規則を出して」と言われれば十二条の規則を作り、「図の位置を枠で示して」と言われれば七頁すべてを左に文章・右に枠にしました。言葉どおりに動くたびに、「読む人はこの頁で何を受け取るか」という問いが抜けていました。', '合う素材がない頁にも、何かを置きました。数字だけの表、六つの箱の流れ図。「無ければ空けておいて」と先に言われていたのに。弱い図のせいで、良い頁まで一緒に疑われました。'],
      zh: ['给企业课题选考做的资料，用 HTML 排文字和图再导出 PDF。改一处，几分钟就有新 PDF。于是每次都七页一起重做、一起拿去看。一个判断错，七页同时错。', '对方说"出规则"，我就造了十二条规则；说"图的位置用框标出来"，我就把七页全排成左文右框。每一次都按字面执行，漏掉的是同一个问题："读的人在这页要带走什么"。', '没有合适素材的页，我也放了东西：只有数字的表、六个框的流程图。对方事先说过"没有就空着"。弱的图让好的页也一起被怀疑。'],
      en: ['A deck for a company\'s selection task, laid out in HTML and exported to PDF. Fix something and a new PDF appears in minutes. So every fix rebuilt all seven pages and showed all seven at once. One wrong call, seven wrong pages.', 'Asked for "rules", I wrote twelve. Asked to "mark where figures go", I put text left and a box right on every page. Each time I acted on the words and skipped the question underneath: what should the reader take from this page?', 'Pages with no fitting material got something anyway — a table of numbers, a six-box flow chart — although I had been told "leave it empty if there is nothing". Weak figures made the good pages suspect too.'],
    },
    changed: {
      ja: ['順番を固定しました。相手の骨組み → 続けて読める文章 → 一頁か一枚の図だけ先に見せて方向を決める → それから残り。道具の検査は「はみ出さない・字が小さすぎない」という下限だけにして、「毎頁に図が要る」のような上限は作らない。', '素材が無い頁は空けて「未定」と書く。始める前に質問で意図を確かめる——読むのは誰か、何分で読むか、一文で何を持ち帰ってほしいか。'],
      zh: ['把顺序固定下来：对方的骨架 → 连贯的文字 → 先只做一页或一张图定方向 → 再做其余。工具的检查只保留下限（不溢出、字不过小），不设"每页必须有图"这类上限。', '没有素材的页空着写"未定"。动手前先用问题确认意图：谁读、读几分钟、希望用一句话带走什么。'],
      en: ['Fixed the order: the author\'s skeleton → prose that reads straight through → one page or one figure to settle the direction → then the rest. Tool checks are floors only (no overflow, no tiny type), never ceilings like "every page needs a figure".', 'A page without material stays empty and says so. Before starting, confirm intent with questions: who reads, for how long, and what one sentence they should leave with.'],
    },
    facts: [{ label: '課題選考デッキ v3〜v7 の作業記録（非公開）' }],
    tags: ['process', 'design', 'communication'],
  },
  {
    id: 'two-calls',
    date: '2026-09-26',
    work: 'j-grad',
    title: { ja: 'AI に何度も使いを頼むのをやめ、資料を一式そろえて一度だけ渡した', zh: '不再让 AI 反复跑腿，把资料一次备齐只交一遍', en: 'Stop sending the AI on errands; hand it the whole folder once' },
    scene: {
      ja: '「在職中の人がこの専攻に出願するとき、英語の成績は要りますか」——この一問に答えるのに、画面は 30 秒待ってから「タイムアウト」と表示していました。',
      zh: '「在职的人报这个专攻，要不要交英语成绩？」——回答这一个问题，页面要等 30 秒，然后显示「超时」。',
      en: '"Does someone currently employed need an English score for this program?" — one question, and the page waited 30 seconds before saying "timed out".',
    },
    what: {
      ja: ['最初の作りは、一つの質問をいくつかの小さな質問に分け、その一つひとつを AI に別々に尋ね、返事を型に流し込んでつなぐ、というものでした。使いを何度も頼んでいるようなもので、一回ごとに待ち時間が積み上がりました。', '時間を区切って計ると、質問の理解には成功し、文章を書く段階で外部サービスの制限時間にぶつかっていました。', '制限時間を延ばしても、失敗が少し遅くなるだけです。'],
      zh: ['最初的做法是把一个问题拆成几个小问题，每个小问题单独去问一次 AI，回复再用模板拼起来。像让一个人为一件事反复跑腿，每一趟都在累加等待。', '分段计时后看清：理解问题那一步成功了，写回答那一步撞上了外部服务的时限。', '把时限调长，只是让失败来得晚一点。'],
      en: ['The first build split one question into several smaller ones, asked the AI each separately, and stitched the replies into a template. Like sending someone on errand after errand, every trip added waiting.', 'Timing each stage showed the question was understood fine; writing the answer hit the external service\'s limit.', 'Raising the limit only makes the failure arrive later.'],
    },
    changed: {
      ja: ['順番を変えました。質問を一度理解したら、資料を探す・学校の範囲で絞る・ルールを照合する、という確定できる作業はすべて手元のプログラムで済ませ、集めた根拠を一つの束にして AI に渡し、文章を一度だけ書いてもらいます。同じ質問が二度来たら、前の答えをそのまま返します。', 'AI の呼び出しは、一つの質問につき多くても二回になりました。速くなったのは AI ではなく、AI に頼む回数です。'],
      zh: ['改了顺序。理解一次问题之后，查资料、按学校范围过滤、核对规则这些能确定的事，全部由手边的程序做完，把找到的根据打成一个包交给 AI，让它只写一次。同样的问题再来，直接给上次的答案。', '每个问题最多问 AI 两次。变快的不是 AI，是求助 AI 的次数。'],
      en: ['Reordered the work. Once the question is understood, everything that can be settled locally — finding passages, narrowing to the school, checking rules — runs in our own code; the evidence goes to the AI as one bundle, and it writes once. A repeated question gets the previous answer back.', 'At most two AI calls per question. What got faster was not the AI, but how often we asked it.'],
    },
    facts: [{ label: 'Issue #171', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/171' }, { label: 'Issue #180', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/180' }, { label: 'ADR 0006', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/decisions/0006-validated-natural-language-and-exact-cache.md' }],
    tags: ['RAG', 'latency', 'design'],
  },
  {
    id: 'm10-drift',
    date: '2026-09-25',
    work: 'j-grad',
    title: { ja: '検査を増やすほど、正しい答えが落ちていった', zh: '检查加得越多，对的回答反而被拦下', en: 'The more checks we added, the more correct answers failed' },
    scene: {
      ja: '「情報工学系の英語は満点 100 点、面接はオンライン」——前半は資料にあり、後半は資料にありません。この回答は、私たちの検査をすべて通過しました。',
      zh: '「信息工学系英语满分 100 分，面试采用线上形式」——前半资料里有，后半没有。这个回答通过了我们全部的检查。',
      en: '"English is worth 100 points; the interview is online" — the first half is in the document, the second is not. This answer passed every check we had.',
    },
    what: {
      ja: ['AI が資料にないことを言わないように、私は「回答に根拠のない記述があれば、プログラムが必ず見つけること」を受け入れ条件に書きました。', '一版目は言葉の一致を見る検査、二版目は単語ごとに意味を照らし合わせる検査。反例が見つかるたびに規則を足した結果、「最高で 100 点取れる」という正しい言い換えまで弾くようになりました。', '三版目が文の主語と目的語を解析しはじめたところで、気づきました。私はもう、この検査が何をしているのか説明できませんでした。自動テストはずっと合格のままでした。'],
      zh: ['为了不让 AI 说资料里没有的话，我在验收条件里写了："回答里任何无根据的说法，程序都必须能找出来"。', '第一版查字面是否一致，第二版逐词核对意思。每发现一个反例就加一条规则，结果「最高可得 100 分」这种正确的改写也被拦下。', '第三版开始解析句子的主语和宾语时，我意识到：我已经说不清这个检查在做什么了。自动测试一直是绿的。'],
      en: ['To keep the AI from saying things not in the document, I wrote into the acceptance criteria: "the program must catch any unsupported statement in the answer."', 'Version one compared words; version two matched meaning word by word. Every counterexample added a rule, until the correct paraphrase "up to 100 points" was rejected too.', 'When version three started parsing subjects and objects, I noticed I could no longer explain what the check did. The automated tests had stayed green the whole time.'],
    },
    changed: {
      ja: ['この方向をやめました。「資格があるか」「何を出すか」のような判断は、人がレビューしたルールにプログラムが従って答え、AI には文章にする役目だけを残します。AI の回答には「参考」と明示します。', '以後の決まり：反例は原因を探す手がかりであって、そのまま新しい規則にはしない。そして、自分で説明できない仕組みは、テストが合格でも使わない。'],
      zh: ['撤回了这个方向。"有没有资格""要交什么"这类判断，由程序按人审核过的规则回答，AI 只负责把结果写成文章，并且在界面上标明是"参考"。', '此后的规矩：反例是找原因的线索，不直接变成新规则。还有一条：我自己解释不了的机制，测试全绿也不上线。'],
      en: ['We dropped the direction. Questions like "am I eligible" or "what do I submit" are answered by code following human-reviewed rules; the AI only turns the result into prose, labelled "reference".', 'Rules since: a counterexample is a clue to a cause, not a new rule. And a mechanism I cannot explain does not ship, however green the tests.'],
    },
    facts: [{ label: 'PR #176', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/176' }, { label: 'PR #178', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/178' }, { label: 'PR #179', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/179' }],
    tags: ['LLM', 'review', 'scope'],
  },
  {
    id: 'agents-md',
    date: '2026-10-24',
    title: { ja: '禁止事項だらけの指示書が、監査報告みたいな返事を生んだ', zh: '禁令堆成的指令，换来了审计报告式的回复', en: 'Prohibition-heavy instructions came back as audit-speak' },
    scene: {
      ja: '「三回の実行権限は使い切りました。四回目の権限はありません。未知の使用量は全額占有のまま保持します。」——AI が何を理解したのか、読んでも分かりませんでした。',
      zh: '"三次执行授权已用完，没有第四次的授权。未知用量整额占额仍保留。"——读完也看不出 AI 懂了什么。',
      en: '"All three execution authorizations are exhausted. There is no authorization for a fourth. Unknown usage remains fully reserved." — I could not tell what it had understood.',
    },
    what: {
      ja: ['原因は、私が書いた指示書にありました。禁止事項と用語の定義だけで、何のための仕事なのかが一行もありませんでした。', 'AI は指示書の文体を鏡のように返します。禁止が多いほど、「〜とはみなしません」という自己弁護が増えました。', '要件を深掘りするための道具を足しても変わりませんでした。問題は要件ではなく、文章の目的が書かれていないことでした。'],
      zh: ['原因是我自己写的指令：只有禁令和术语定义，没有一行写这件事是为了什么。', 'AI 会镜像指令的文体。禁令越多，"〜不视为〜"式的自我辩护越多。', '加上深挖需求的工具也没用。问题不在需求，在没写目的。'],
      en: ['The cause was my own instruction file: prohibitions and definitions, not one line about what the work was for.', 'An AI mirrors the register of its instructions. More prohibitions, more "X is not to be regarded as Y".', 'Adding requirement-probing tools did not help. The problem was not the requirements but the missing purpose.'],
    },
    changed: {
      ja: ['指示書の先頭に三つの文を置くようにしました。何のためか、誰が使うか、何ができたら終わりか。禁止事項は、元に戻せない操作だけに絞りました。', '翌日、同じ AI の言い直しはこうでした。「日本の AI 職の要件とあなたの成果を照らし合わせ、技術面の不足を短い報告にまとめて提出したら終了、と理解しました。」'],
      zh: ['指令开头改成三句话：为了什么、谁在用、做成什么算结束。禁令只留不可逆的操作。', '第二天同一个 AI 的复述："我理解你要的是：对照日本 AI 岗位要求和你已有的成果，找出技术缺口，写成简报，交付后就停。"'],
      en: ['Instructions now open with three sentences: what for, who uses it, what counts as done. Only irreversible actions remain prohibited.', 'The same AI, next day: "I understand you want me to compare Japanese AI job requirements with your work, find the gaps, write short briefs, and stop once delivered."'],
    },
    facts: [{ label: 'COLLABORATION.md（内部）' }],
    tags: ['agents', 'prompting'],
  },
  {
    id: 'unknown-is-not-no',
    date: '2026-09-28',
    work: 'j-grad',
    title: { ja: '「分からない」を「いいえ」にしない', zh: '"不知道"不能当成"不用"', en: '"Unknown" must never become "no"' },
    scene: {
      ja: '在職かどうかを入力していない人に、システムは「在職証明の提出は不要です」と答えていました。本当の答えは「在職かどうかを確認してください」です。',
      zh: '一个没填"是否在职"的人，系统回答「不需要提交在职证明」。正确的回答是「请先确认是否在职」。',
      en: 'For someone who had not said whether they were employed, the system answered "no employment certificate needed". The right answer was "please confirm whether you are employed".',
    },
    what: {
      ja: ['多くのプログラムは判断を「はい・いいえ」の二択で作ります。入力が空なら「いいえ」。その結果、「在職中の人は提出」という規則が、未入力の人には「提出不要」と読まれました。', '出願の現場でいちばん怖いのは、この種の間違いです。「出さなくていい」と言われた学生は、確認しません。', '東京大学の資料を追加したとき、この取り違えが一か所見つかりました。'],
      zh: ['大多数程序把判断做成"是／否"两种，没填就算"否"。于是"在职者需提交"这条规则，对没填的人就被读成了"不用交"。', '出愿现场最怕的就是这种错：被告知"不用交"的学生，不会再去确认。', '接入东京大学资料时，发现了一处这样的错。'],
      en: ['Most programs make decisions yes-or-no, and an empty field counts as no. So the rule "employed applicants must submit" read as "no need to submit" for anyone who had not answered.', 'This is the most dangerous kind of error at an admissions desk: a student told "not needed" does not check again.', 'One such case surfaced while adding the University of Tokyo documents.'],
    },
    changed: {
      ja: ['判定は常に三択にしました。該当・非該当・情報不足。情報が足りないときは、何が足りないかを返します。', 'この三択のしくみは一つだけ作り、両方の大学の条件判定が同じものを使います。学校ごとに判定の仕組みを増やさないのは、同じ間違いを二度直さないためです。'],
      zh: ['判定一律三种结果：符合、不适用、信息不足。信息不足时，告诉用户缺的是什么。', '这套三态判定只写一份，两所大学的条件判定都用它。不按学校各做一套，是为了同一个错不用修两遍。'],
      en: ['Every decision now has three outcomes: applies, does not apply, not enough information. When information is missing, the answer says what is missing.', 'There is one such decision engine, shared by both universities. Not building one per school means the same mistake never needs fixing twice.'],
    },
    facts: [{ label: 'PR #215', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/215' }, { label: 'ADR 0012', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/decisions/0012-material-conditions-and-report-boundaries.md' }],
    tags: ['rules', 'design', 'safety'],
  },
  {
    id: 'deliverable-pack',
    date: '2026-10-01',
    work: 'j-grad',
    title: { ja: '自分が伝言係になっていた', zh: '我成了传话员', en: 'I had become a messenger' },
    scene: {
      ja: '開発を担当する AI の要約を、設計を担当する AI に貼り、その返事をまた貼り戻す。気がつくと私は、小さな修正を往復させるだけで、何ができあがったのかを見ていませんでした。',
      zh: '把负责开发的 AI 的摘要贴给负责设计的 AI，再把回复贴回去。回过神来，我只是在来回搬运小修改，没有在看做出了什么。',
      en: 'Paste the development AI\'s summary to the design AI, paste the reply back. I realised I was shuttling small fixes and no longer looking at what had been built.',
    },
    what: {
      ja: ['新しい書類を一つ追加するたびに、同じ内容を画面・レポート・出典の説明という別々の場所に書いていました。書く場所が増えるほど、どこかが古くなります。', '私が伝言係になったのは、一つの質問に一つの返事、という細かい往復で進めていたからです。段階の区切りで成果をまとめて見る機会がありませんでした。', '一つの書類を追加する作業が、人の判断ではなく転記で埋まっていました。'],
      zh: ['每加一份材料，同样的内容要在界面、报告、来源说明三个地方各写一遍。写的地方越多，总有一处会过期。', '我变成传话员，是因为一直在"一个问题一个回复"地细碎往返，没有在阶段节点上把成果合起来看。', '加一份材料的工作，被抄写填满了，而不是被判断填满。'],
      en: ['Each new document meant writing the same content in separate places: screens, report, source notes. The more places, the more likely one goes stale.', 'I had become a messenger because the work ran as one question, one reply, with no point where a stage\'s results were reviewed together.', 'Adding a document had become transcription, not judgement.'],
    },
    changed: {
      ja: ['やり方を二つ変えました。質問は一度にまとめて出し、修正は段階の終わりに成果一式としてまとめて受け取る。そして、人が確認した一つの整理表から、画面もレポートも設定も自動で生成する。', '時間を測り比べた記録はないので、「何割速くなった」とは言いません。言えるのは、同じことを五か所に書く作業がなくなり、私が見るのは中身の正しさだけになったことです。'],
      zh: ['改了两件事。问题一次列完，修改在阶段结束时作为一整套成果收下；界面、报告、配置都从一份人确认过的整理表自动生成。', '没有前后工时对比，所以不说"快了几成"。能说的是：同一件事在五个地方写五遍的活没了，我看的只剩内容对不对。'],
      en: ['Two changes. Questions go out in one batch and fixes come back as one package at the end of a stage; screens, report and configuration are all generated from a single human-checked table.', 'No before-and-after timing, so no "X percent faster". What I can say: writing the same thing in five places is gone, and what I review is only whether the content is right.'],
    },
    facts: [{ label: 'PR #277', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/277#issuecomment-5943317153' }, { label: 'PR #289', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/289' }, { label: 'ADR 0017', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/decisions/0017-reviewed-authoring-config-generation.md' }],
    tags: ['agents', 'process'],
  },
  {
    id: 'legacy-knowledge',
    date: '2026-09-27',
    work: 'j-grad',
    title: { ja: '二校目を入れたら、一校目の知識がコードの中から出てきた', zh: '接第二所学校时，第一所学校的知识从代码里冒了出来', en: 'Adding the second school, the first school\'s knowledge came out of the code' },
    scene: {
      ja: '何も入力していないのに、プログラムは東京科学大学の学院名を 25 件「見つけて」きました。知識は PDF からではなく、コードから来ていました。',
      zh: '什么都没输入，程序却"找出"了 25 个东京科学大学的学院名。知识不是来自 PDF，是来自代码。',
      en: 'With nothing as input, the program "found" 25 Science Tokyo entity names. The knowledge was coming from the code, not the PDF.',
    },
    what: {
      ja: ['最初の学校の資料に合わせて書いたコードには、「7 ページ目は共通事項」「2027 年度の条項」「この学院はこの名前」といった知識が埋め込まれていました。一校だけのときは誰も気づきません。', '東京大学の資料を同じコードに通すと、東京科学大学のページ割りや学院名がそのまま混ざります。', 'これは自動で名前や関係を抜き出す方法が使えない証拠ではなく、作り方の問題でした。ただ、一校目で正しく動いたものが、二校目でも正しいとは限らないことを教えてくれました。'],
      zh: ['按第一所学校的资料写的代码里，嵌着"第 7 页是共通事项""2027 年度的条款""这个学院叫这个名字"这类知识。只有一所学校时，没人会发现。', '把东京大学的资料走同一套代码，东京科学大学的页码划分和学院名就直接混进来。', '这不能证明自动抽名词、抽关系的方法行不通，这是写法的问题。但它提醒了一件事：第一所学校上跑对的东西，第二所学校上未必对。'],
      en: ['Code written against the first school\'s documents had knowledge baked in: "page 7 is the common section", "the 2027 clause", "this college has this name". With one school, nobody notices.', 'Run the University of Tokyo documents through the same code and Science Tokyo\'s page layout and college names leak in.', 'This does not prove that automatically extracting names and relations cannot work; it was a construction problem. But it showed that what ran correctly for school one is not thereby correct for school two.'],
    },
    changed: {
      ja: ['古いコードは「一校目専用」と名札を付けて隔離し、それ以外の学校には使えないようにしました。新しい学校の知識は、人がレビューした抜粋と関係からしか入れません。', '以後、学校を追加するときの確認項目に一つ増えました。「前の学校の知識が、コードのどこかに残っていないか」。'],
      zh: ['旧代码挂上"仅限第一所学校"的标签隔离起来，别的学校不能走它。新学校的知识只能从人审核过的片段和关系进入。', '此后加学校时的检查清单多了一条：上一所学校的知识，有没有藏在代码的某处。'],
      en: ['The old code was labelled "first school only" and isolated so no other school can use it. A new school\'s knowledge enters only through human-reviewed excerpts and relations.', 'One line was added to the checklist for every new school: is the previous school\'s knowledge hiding somewhere in the code?'],
    },
    facts: [{ label: 'PR #208', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/208' }, { label: 'ADR 0011', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/decisions/0011-explicit-build-profiles-and-reviewed-lineage.md' }],
    tags: ['data', 'multi-school', 'testing'],
  },
  {
    id: 'page-numbers',
    date: '2026-09-01',
    work: 'j-grad',
    title: { ja: '「出典ページ付き」をうたいながら、半分以上のページが分からなかった', zh: '招牌是"带页码"，一半以上却说不出哪一页', en: 'We promised page numbers, and could not name the page for more than half' },
    scene: {
      ja: '最初の本物の募集要項を読み込ませたとき、取り出した事実の半分以上が「何ページから来たか」を答えられませんでした。テストはすべて合格していました。',
      zh: '第一次读入真实的募集要项，抽出来的事实有一半以上说不出"来自哪一页"。测试全部通过。',
      en: 'On the first real guideline, more than half the extracted facts could not say which page they came from. Every test had passed.',
    },
    what: {
      ja: ['AI が書いたコードは、PDF のページ情報をいったん捨てて文章に変換し、あとから本文中の「Page N」という文字を探してページを推測していました。', '見出しのない段落にはその文字がなく、ページが失われました。テストに使っていたのは見出しの付いた作り物のデータだったので、この経路は一度も通っていませんでした。', '気づいたのは、本物の PDF から作った結果の中で「ページ：空」を数えたときです。'],
      zh: ['AI 写的代码先把 PDF 的页码信息丢掉转成文本，之后再在正文里找"Page N"字样往回猜。', '没有标题的段落没有这个字样，页码就丢了。测试用的是带标题的合成数据，所以这条路径一次都没走过。', '发现的方式很朴素：在真实 PDF 生成的结果里，数"页码：空"有多少条。'],
      en: ['The AI\'s code discarded the PDF\'s page information when converting to text, then guessed pages afterwards by searching the text for "Page N".', 'Paragraphs without a heading had no such marker and lost their page. Tests used synthetic data that always had headings, so this path was never exercised.', 'I noticed by counting how many facts built from the real PDF had an empty page field.'],
    },
    changed: {
      ja: ['ページ番号は、PDF を読んだ瞬間に各段落へ付け、最後まで持ち運ぶようにしました。表示用の文章から逆算することはしません。', '以後、どの段階でも最初の区切りは「本物の PDF で端から端まで一度通す」になりました。作り物のデータで合格しても、それは始まりにすぎません。'],
      zh: ['页码在读 PDF 的那一刻就贴到每个段落上，一路带到最后，不再从显示文本倒推。', '此后每个阶段的第一个节点都是"用真实 PDF 端到端跑一遍"。合成数据上通过，只算开始。'],
      en: ['Page numbers are attached to each paragraph the moment the PDF is read and carried to the end, never reverse-engineered from display text.', 'Since then the first checkpoint of every stage is one end-to-end run on the real PDF. Passing on synthetic data is only the beginning.'],
    },
    facts: [{ label: 'Issue #3', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/3' }, { label: 'PR #10', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/10#issuecomment-5490287693' }],
    tags: ['RAG', 'data', 'testing'],
  },
  {
    id: 'scope-global',
    date: '2026-09-14',
    work: 'j-grad',
    title: { ja: 'テストは全部合格。数学系だけの例外が「全学共通」になっていた', zh: '测试全部通过。只属于数学系的例外，被标成了"全校通用"', en: 'All tests green. A maths-only exception had become "university-wide"' },
    scene: {
      ja: '「数学系では英語の成績の扱いが異なる」という一文が、「全学共通」の規則として登録されていました。隣の一文にはテストがあり、そちらは正しく「全学共通」でした。',
      zh: '「数学系的英语成绩另有规定」这一句，被登记成了"全校通用"的规则。旁边那一句有测试，那句确实是全校通用。',
      en: 'The sentence "mathematics handles English scores differently" had been registered as a university-wide rule. The neighbouring sentence had a test, and that one really was university-wide.',
    },
    what: {
      ja: ['資料の各文に「誰に当てはまるか」を付ける処理で、大きな章の見出しを優先し、学系の名前を見るのを後回しにしていました。', 'この種の間違いは、検索や回答の前の段階で起きます。「誰に当てはまるか」を取り違えると、出典も引用も正しく見えたまま、別の学生に別の学系の規則を当ててしまいます。', 'テストは、直したかった一文だけを守っていました。'],
      zh: ['给资料里每一句话标"适用于谁"的处理，把大章节的标题放在前面，系别名称放在后面看。', '这类错发生在检索和回答之前。"适用于谁"一旦标错，后面的出处和引用看起来全对，却把别的系的规则套到了这个学生身上。', '测试只保护了当时想修的那一句。'],
      en: ['The step that tags each sentence with "who does this apply to" looked at the big section heading first and the department name second.', 'This kind of error happens before retrieval or answering. Get "who does this apply to" wrong, and every citation looks right while applying another department\'s rule to this student.', 'The test protected only the one sentence someone had wanted fixed.'],
    },
    changed: {
      ja: ['「全学共通」と判定できるのは、資料の構造上ほんとうに共通の位置にある段落だけに絞りました。特定の文や言葉を特別扱いする直し方はしません。', '同じ本物の PDF から、隣り合う正しい例と間違った例を両方テストに加えました。一文を直すときは、隣の一文も一緒に確かめます。'],
      zh: ['能判成"全校通用"的，只限资料结构上真正处于共通位置的段落。不对特定句子或词语做特殊处理。', '从同一份真实 PDF 里，把相邻的正例和反例一起加进测试。修一句的时候，顺手确认旁边那句。'],
      en: ['Only paragraphs that genuinely sit in a shared position in the document\'s structure can be judged university-wide. No special-casing of particular sentences or words.', 'Adjacent correct and incorrect examples from the same real PDF were both added to the tests. When one sentence is fixed, its neighbour is checked too.'],
    },
    facts: [{ label: 'PR #108', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/108#issuecomment-5660330591' }],
    tags: ['RAG', 'testing', 'scope'],
  },
  {
    id: 'fake-provider',
    date: '2026-10-24',
    work: 'j-grad',
    title: { ja: 'README の数字に、裏付けの記録がなかった', zh: 'README 里的数字，找不到出处', en: 'The number in the README had no record behind it' },
    scene: {
      ja: '公開ページに書いてあった検索の成績と、リポジトリに保存されていた唯一の結果ファイルの数字が、一致しませんでした。',
      zh: '公开页面上写的检索成绩，和仓库里保存的唯一一份结果文件的数字，对不上。',
      en: 'The retrieval score on the public page and the only saved result file in the repository did not match.',
    },
    what: {
      ja: ['気づいたのは別の AI でした。公開リポジトリを読み、保存ファイルから成績を計算し直して「合わない」と報告してきました。', 'リポジトリ全体を探すと、公開ページの数字は文章の中にしか存在せず、結果ファイルは一度しか保存されていませんでした。', 'おそらく、保存対象外の作業フォルダで試した別の実行の数字が、文章にだけ残ったのだと思います。'],
      zh: ['发现的是另一个 AI。它读公开仓库时，自己从保存文件重算了成绩，报告"对不上"。', '全仓库搜下来，公开页面上的数字只存在于文字里，结果文件只保存过一次。', '大概是某次在不入库的工作目录里试跑的数字，只留在了文字里。'],
      en: ['A different AI noticed. Reading the public repository, it recomputed the score from the saved file and reported a mismatch.', 'A repository-wide search found the published number only in prose; the result file had been saved exactly once.', 'Most likely a trial run in an unsaved working folder left its number in the text and nowhere else.'],
    },
    changed: {
      ja: ['三か所の数字を保存ファイルの値に訂正し、数字の横に「いつ、何問で、どのデータで測ったか」を書きました。古い文書にも訂正の一行を残しています。', '以後、公開する数字は必ず保存された記録に結び付けます。記録がない数字は、たとえ覚えていても書きません。'],
      zh: ['三处数字改成保存文件里的值，数字旁写明"何时、多少题、用哪份数据测的"，旧文档留一行更正记录。', '此后公开的数字必须绑到保存的记录。没有记录的数字，哪怕记得，也不写。'],
      en: ['Three places were corrected to the saved file\'s value, with "when, how many queries, which data" written beside the number, and a one-line correction left in the old document.', 'Since then every published number binds to a saved record. A number without a record is not written, however well I remember it.'],
    },
    facts: [{ label: 'PR #300', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/300' }, { label: '保存レポート', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/tests/fixtures/grounded_rag_retrieval_report_v1.json' }],
    tags: ['evaluation', 'honesty'],
  },
  {
    id: 'index-rebuild',
    date: '2026-09-26',
    work: 'j-grad',
    title: { ja: '同じ索引が、すでに 5 か所にあった', zh: '同样的索引，已经在 5 个地方', en: 'The same index already existed in five places' },
    scene: {
      ja: '動作確認を始めるたびに、7 分ほど待たされました。資料の索引を作り直しているのです。しかし索引は、とっくにできているはずでした。',
      zh: '每次开始验收，都要等七分钟左右：它在重建资料索引。可索引早就该建好了。',
      en: 'Every acceptance run began with about seven minutes of waiting while the index was rebuilt. But the index should have existed long ago.',
    },
    what: {
      ja: ['「索引を読み込む」と「索引を作る」が同じ関数に入っていて、置き場所が読めないと「存在しない」と判断して作り直していました。', '直前に権限のエラーが出たとき、AI は新しい作業フォルダを作って解決しました。その結果、索引も丸ごと作り直されました。', '数えてみると、まったく同じ中身の索引が 5 か所にありました。'],
      zh: ['"读取索引"和"构建索引"写在同一个函数里，读不到存放位置就判定"不存在"，然后重建。', '之前报了一次权限错误，AI 的解决办法是新开一个工作目录。结果索引也整套重建了一遍。', '盘点下来，内容完全相同的索引在 5 个目录各有一份。'],
      en: ['"Load the index" and "build the index" lived in the same function; if the location could not be read, it decided the index did not exist and rebuilt it.', 'After a permission error, the AI\'s fix was to create a new working folder, which rebuilt the index as well.', 'A count found identical indexes in five places.'],
    },
    changed: {
      ja: ['決まりを三つ書きました。機能側は既存のデータを読み取り専用で使う。作り直し・複製・ダウンロードは、そのつど承認を得る。権限がないことと、データがないことを同一視しない。', '「作る前に、あるものを数える」が、私がレビューで必ず見る項目になりました。'],
      zh: ['写下三条规矩：功能侧只读使用已有数据；重建、复制、下载每次单独批准；没有权限不等于数据不存在。', '"造之前先盘点已有的"，成了我审查时固定会看的一项。'],
      en: ['Three rules: feature code uses existing data read-only; rebuilds, copies and downloads each need approval; lacking permission is not the same as the data not existing.', '"Count what exists before building" became a fixed item in my reviews.'],
    },
    facts: [{ label: 'Issue #183', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/183' }, { label: 'PR #184', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/pull/184' }],
    tags: ['data', 'ownership'],
  },
  {
    id: 'llm-judge',
    date: '2026-10-24',
    work: 'coach',
    title: { ja: '文法は全部正しい。でも、その相手にその質問はおかしい', zh: '语法全对。但对这个人问这个问题，不对劲', en: 'Grammatically perfect — and the wrong question for this listener' },
    scene: {
      ja: '日本人の同僚に向かって、アプリは「日本に来てどれくらいですか？」と聞き返す返答を提案していました。形式も文法も丁寧さも、検査はすべて合格でした。',
      zh: '对着一位日本同事，应用建议反问「来日本多久了？」。格式、语法、礼貌程度，检查全部通过。',
      en: 'To a Japanese colleague, the app suggested asking back "how long have you been in Japan?". Format, grammar and politeness checks had all passed.',
    },
    what: {
      ja: ['同じ場所にいるのに「そちらはどうですか？」と聞く。相手が先に「お疲れさまです」と言ったのに、返さない。どれも文としては正しく、丁寧さの段階も合っていました。', '自動の検査は満点でした。生成する側の AI の「自分で確認する」手順も、一度も止めませんでした。', '気づいたのは、別に用意した評価役の AI です。相手の立場から読んで、二回続けて同じ指摘をしました。'],
      zh: ['同在一处却问「你那边怎么样？」；对方先说了「お疲れさまです」，回复却没接。每一句语法都对，礼貌等级也对。', '自动检查满分。生成端的 AI 自带的"自己确认"步骤一次都没拦住。', '发现的是单独准备的审查员 AI。它站在对方的立场读，连续两轮提了同一个问题。'],
      en: ['Asking "how are things over there?" when both are in the same room; not returning a greeting the other person offered first. Every sentence was correct, at the right politeness level.', 'Automatic checks scored full marks. The generating AI\'s own "check yourself" step never caught one.', 'A separately prepared judge AI noticed, reading from the listener\'s side, and raised the same point twice in a row.'],
    },
    changed: {
      ja: ['返答の決まりに一つ足しました。聞き返しや挨拶は、相手の立場から見ても自然に成り立つこと。そのうえで、もう一度まとめて確認しました。', '評価役も AI なので、同じ見落としをする可能性があります。最終的な判断は日本語を母語とする人の確認に置きますが、それはまだ行っていません。'],
      zh: ['回复规则加了一条：反问和寒暄，站在对方立场上也要成立。然后重新跑了一轮确认。', '审查员也是 AI，可能有同样的疏漏。最终判断放在日语母语者的确认上，这一步还没做。'],
      en: ['One rule added: return questions and greetings must also make sense from the listener\'s side. Then one more round of checks.', 'The judge is also an AI and can share the same blind spot. The final word rests with a native speaker\'s review, which has not happened yet.'],
    },
    facts: [{ label: 'status.md', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/status.md' }, { label: 'D-005', href: 'https://github.com/yasu-isct/japanese-speaking-coach/blob/main/docs/decisions.md' }],
    tags: ['evaluation', 'LLM-as-judge'],
  },
  {
    id: 'mineru-reject',
    date: '2026-09-27',
    work: 'j-grad',
    title: { ja: '結論の出なかった実験を、結論の出なかった実験として閉じた', zh: '没有结论的实验，就按没有结论来收尾', en: 'An inconclusive experiment, closed as inconclusive' },
    scene: {
      ja: '新しい PDF 解析ツールを試す比較実験で、処理したページ数が予算の二倍を超えていました。途中で中断と再開を繰り返し、どの結果がどの実行のものか分からなくなっていました。',
      zh: '试用新 PDF 解析工具的对比实验，处理的页数超出预算两倍多。中途几次中断重跑，已经分不清哪个结果属于哪次运行。',
      en: 'In a comparison trial of a new PDF parser, the pages processed exceeded the budget more than twofold. After repeated stops and restarts, nobody could say which result belonged to which run.',
    },
    what: {
      ja: ['実験の設計では、決まったページ数の予算と、合格の基準をあらかじめ決めていました。予算は「結果が出るまで回し続ける」ことを防ぐための仕組みです。', '途中で「代替として採用する」という案が出て、結論になりかけました。別の設定が止まったときは「このツールは遅い」と言いたくなりました。', 'どちらも根拠が足りませんでした。止まった原因は、私たちが書いた監視プログラムの側にありました。'],
      zh: ['实验设计里预先定了页数预算和合格标准。预算是为了防止"跑到出结果为止"。', '中途出过"作为备选采用"的方案，差点成了结论。另一个配置卡住时，又想说"这个工具慢"。', '两者证据都不够。卡住的原因在我们自己写的监控程序上。'],
      en: ['The design fixed a page budget and a pass threshold in advance. The budget exists to prevent "run until something looks good".', 'A "adopt as fallback" proposal appeared mid-way and nearly became the conclusion. When another configuration stalled, it was tempting to call the tool slow.', 'Neither had enough evidence. The stall came from our own monitoring program.'],
    },
    changed: {
      ja: ['結果を良く見せるための再実行はせず、「不採用」として閉じました。実行した記録はすべて残し、検証できなかった項目を明記しています。', '予算を超えた実験は、数字が良くても成立しません。これを、実験を始める前の約束として扱うことにしました。'],
      zh: ['不为了让结果好看而重跑，按"不采用"收尾。所有运行记录保留，写明哪些没有验证。', '超出预算的实验，数字再好也不成立。这一条当作实验开始前的约定。'],
      en: ['No reruns to make the numbers look better; closed as "not adopted". Every run record was kept and the unverified items were listed.', 'An experiment that exceeds its budget does not count, however good its numbers. That is now a commitment made before an experiment starts.'],
    },
    facts: [{ label: 'Issue #177', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/issues/177' }, { label: 'ADR 0009', href: 'https://github.com/yasu-isct/J-Grad-Admission-RAG/blob/main/docs/decisions/0009-mineru-4.0.7-pilot-fallback.md' }],
    tags: ['evaluation', 'decision'],
  },
];
