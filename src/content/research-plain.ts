// Plain-language layer over R's research copy. R's text (copy.jsonl) is the authoritative description
// and stays available under 「Rの整理文」; this layer exists so a visitor understands each theme in
// three lines and one example before reading anything dense. Editorial, not research judgement.
import type { Lang } from '../i18n/ui';

type L = Record<Lang, string>;
export interface PlainTheme {
  vt: L;       // 題眼: the short vertical running note beside the theme (not the id)
  q: L;        // the question, one sentence, no jargon
  why: L;      // why it matters, one sentence
  now: L;      // where it stands, one sentence
  example: L;  // one concrete scene (marked as an illustration, not a result)
}

export const researchPlain: Record<string, PlainTheme> = {
  T01: {
    vt: { ja: '無効と有効、どちらを選ぶ', zh: '失效与现行，选哪条', en: 'Superseded, or current' },
    q: { ja: '失効した規則と現行の規則が同じ文書に並ぶとき、検索は現行の規則を選べるのでしょうか。', zh: '"已经失效的规则"和"现行规则"并排在同一份文档里，检索能选对现行的那条吗？', en: 'When a superseded rule and the current rule sit in the same document, can retrieval pick the current one?' },
    why: { ja: '文字を読み取れても、有効・無効の区別が失われると、もっともらしい誤答につながります。', zh: '文字读对了，但丢了"哪条有效"，就会得到一个看似合理的错答。', en: 'Reading the words correctly is not enough; lose "which one is valid" and you get a plausible wrong answer.' },
    now: { ja: '合成した募集要項100文書・500断片で、状態表示を残す場合と消す場合の比較を準備しています。開発段階の小規模な観察はありますが、正式な結論はまだありません。', zh: '用 100 份合成募集要项、500 个片段，比较保留/抹平状态标注。已有小规模开发观察，正式结论还没有。', en: '100 synthetic guidelines, 500 chunks, comparing kept vs. flattened status marks. Small development observations exist; no formal result yet.' },
    example: { ja: '募集要項に「出願書類は 6 月 10 日必着（旧：6 月 4 日）」とあり、「今年の締切は？」と質問します。6 月 4 日が上位に来て採用されると、出典があっても誤答になります。', zh: '募集要项写着「出愿书类 6 月 10 日必达（旧：6 月 4 日）」。问"今年截止是哪天"，如果 6 月 4 日排在前面——有根据，但答错了。', en: 'A guideline says "documents due June 10 (formerly June 4)". Ask "this year\'s deadline?" — if June 4 ranks higher, the answer is wrong despite having a source.' },
  },
  T02: {
    vt: { ja: '読めなかったか、答えを誤ったか', zh: '没读出，还是读错了', en: 'Unread, or misread' },
    q: { ja: '同じ文章を画像として見せたとき、モデルは文字を読めなかったのでしょうか。それとも、読めても答えを間違えたのでしょうか。', zh: '同一段文字以图片呈现时，模型是"没读出字"，还是"读出了却答错"？', en: 'Shown the same text as an image, did the model fail to read the characters, or read them and still answer wrong?' },
    why: { ja: 'この二つを分けないと、OCR と推論のどちらを改善すべきか分かりません。', zh: '不分开这两种失败，就不知道该修 OCR 还是推理。', en: 'Without separating the two, you cannot tell whether to fix OCR or reasoning.' },
    now: { ja: '10例・20枚の画像・50件の入力を準備しました。モデルはまだ実行していません。', zh: '准备了 10 例、20 张图、50 份输入。模型还没跑。', en: '10 cases, 20 images, 50 inputs prepared. The model has not been run.' },
    example: { ja: '同じ段落を文字と文字の画像で渡します。答えが変わったら、さらに転写だけを求め、文字を読み取れていたかを確かめます。', zh: '同一段落分别作为文本和图片输入；答案不同时，再单独让它转写，确认是否读出了字。', en: 'Give the same paragraph as text and as an image; if answers differ, ask only for a transcription to check whether it could read it.' },
  },
  T03: {
    vt: { ja: '書体と検索', zh: '字体与检索', en: 'Typeface and retrieval' },
    q: { ja: '同じページでも、書体を変えるだけで検索順位は変わるのでしょうか。', zh: '同一页内容，只换字体，检索排名会变吗？', en: 'Same page, typeface changed and nothing else — does the retrieval rank move?' },
    why: { ja: '内容とは無関係な書体の違いが、検索の安定性に影響するかを確かめたいと考えています。企業文書では、作成者によって書体が異なる場合があります。', zh: '想确认与内容无关的字体差异，是否影响检索的稳定性。企业文档的字体因作者而异。', en: 'To check whether a typeface difference unrelated to content affects retrieval stability. Corporate documents vary in typeface by author.' },
    now: { ja: '10 ページを 3 書体で描画しました。検索順位の比較はこれから行います。', zh: '已把 10 页用 3 种字体渲染。检索排名的比较接下来做。', en: '10 pages rendered in 3 typefaces. The rank comparison is next.' },
    example: { ja: '「出願資格」の同じ文章を明朝・ゴシック・UD 書体で描き、同じ質問で検索します。', zh: '把「出愿资格」的同一段文字分别用明朝、黑体、UD 字体渲染，用同一个问题检索。', en: 'Render the same "eligibility" passage in Mincho, Gothic and UD, then search with the same question.' },
  },
  T04: {
    vt: { ja: '目立つ本則と、小さな例外', zh: '醒目的本则与小字例外', en: 'Bold rule, small exception' },
    q: { ja: '必要な根拠をすべて読み取れる状態でも、太さや大きさで目立つ方を根拠として選んでしまうのでしょうか。', zh: '所有需要的证据都能读到时，模型是否会把更醒目（粗体、更大）的那条当成"根据"？', en: 'When every needed piece of evidence is readable, does the model pick the bolder, larger one as "the evidence"?' },
    why: { ja: '例外が小さな注記にあると、目立つ本則だけを拾う仕組みは、例外の対象者に誤答するおそれがあります。', zh: '例外往往写在小字注记里。只拾取醒目本则的系统，会对适用例外的人答错。', en: 'Exceptions tend to live in small notes. A system that grabs the prominent main rule answers wrong for exactly the people the exception covers.' },
    now: { ja: '候補テーマです。実験は未着手で、観察もまだありません。', zh: '候选主题。实验未启动，也还没有观察。', en: 'Candidate theme. No experiment started, no observations yet.' },
    example: { ja: '本則の「TOEIC 600 点以上」を太字にし、例外の「数学系は 700 点」を小さく添えます。文字の大きさや太さを変えたとき、数学系への回答も変わるかを比較したいと考えています。実験はまだ始めていません。説明用の例です。', zh: '把本则「TOEIC 600 分以上」设为粗体，例外「数学系 700 分」用小字附在旁边。想比较：改变字号和粗细时，对数学系的回答是否也跟着变。实验还没开始（说明用的例子）。', en: 'Set the main rule "TOEIC 600+" in bold and the exception "Mathematics: 700" in small type. The comparison: when size and weight change, does the answer for a maths applicant change too? Not yet run (illustrative example).' },
  },
};

export const glossary: { key: L; text: L }[] = [
  { key: { ja: 'RAG', zh: 'RAG', en: 'RAG' }, text: { ja: '資料を検索して、その内容を根拠に回答を作る仕組みです。', zh: '先检索资料，再依据资料生成回答的机制。', en: 'Retrieve documents, then answer using their content as evidence.' } },
  { key: { ja: '根拠', zh: '根据', en: 'evidence' }, text: { ja: '回答のもとになる資料や記述です。', zh: '回答依据的是哪份资料的哪一处。', en: 'Which document and which passage an answer rests on.' } },
  { key: { ja: '状態', zh: '状态', en: 'status' }, text: { ja: '規則が「現行」か「廃止」かといった情報です。', zh: '规则是"现行"还是"已废止"这类文字之外的信息。', en: 'Information beyond the words, such as whether a rule is current or superseded.' } },
];
