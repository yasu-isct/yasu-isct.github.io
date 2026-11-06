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
    now: { ja: '英語の合成規則文書100問・候補500件で、状態ラベルの有無を比較しました。独立の再計算を経た結果はラベルなし53%、あり50%、差−3ポイント（95%区間 −13〜+8）。「ラベルだけで10ポイント以上改善する」は支持されませんでした（2026-10-25、限定条件の正式な結論）。', zh: '用 100 道英文合成规则文档问题、500 个候选，比较有无状态标签。经独立重算：无标签 53%、有标签 50%，差 −3 个百分点（95% 区间 −13〜+8）。"只加标签就能改善 10 个百分点以上"不成立（2026-10-25，限定条件下的正式结论）。', en: '100 questions over synthetic English rule documents, 500 candidates, with and without status labels. Independently recomputed: 53% without labels, 50% with, a −3-point difference (95% interval −13 to +8). "Labels alone improve ranking by at least 10 points" was not supported (2026-10-25, a formal conclusion under fixed conditions).' },
    example: { ja: '募集要項に「出願書類は 6 月 10 日必着（旧：6 月 4 日）」とあり、「今年の締切は？」と質問します。6 月 4 日が上位に来て採用されると、出典があっても誤答になります。', zh: '募集要项写着「出愿书类 6 月 10 日必达（旧：6 月 4 日）」。问"今年截止是哪天"，如果 6 月 4 日排在前面——有根据，但答错了。', en: 'A guideline says "documents due June 10 (formerly June 4)". Ask "this year\'s deadline?" — if June 4 ranks higher, the answer is wrong despite having a source.' },
  },
  T02: {
    vt: { ja: '読めなかったか、答えを誤ったか', zh: '没读出，还是读错了', en: 'Unread, or misread' },
    q: { ja: '同じ文章を画像として見せたとき、モデルは文字を読めなかったのでしょうか。それとも、読めても答えを間違えたのでしょうか。', zh: '同一段文字以图片呈现时，模型是"没读出字"，还是"读出了却答错"？', en: 'Shown the same text as an image, did the model fail to read the characters, or read them and still answer wrong?' },
    why: { ja: 'この二つを分けないと、OCR と推論のどちらを改善すべきか分かりません。', zh: '不分开这两种失败，就不知道该修 OCR 还是推理。', en: 'Without separating the two, you cannot tell whether to fix OCR or reasoning.' },
    now: { ja: '固定モデルで500件を一度だけ実行し、独立複核を終えました。文字・画像・転写のすべてが100%で、「転写は通るが画像問答は誤る」事例は200組中0。材料が易しすぎたため、問いにはまだ答えていません（2026-11-06）。', zh: '固定模型一次执行 500 条，已独立复核。文字、图像、转写全部 100%，"转写通过但图像问答错"的事例 200 组中 0 组。材料太容易，问题本身还没有回答（2026-11-06）。', en: '500 requests run once on a fixed model, independently re-checked. Text, image and transcription all scored 100%; "transcription passes but image QA fails" occurred 0 times in 200 pairs. The material was too easy, so the question itself is still open (2026-11-06).' },
    example: { ja: '同じ段落を文字と文字の画像で渡します。答えが変わったら、さらに転写だけを求め、文字を読み取れていたかを確かめます。', zh: '同一段落分别作为文本和图片输入；答案不同时，再单独让它转写，确认是否读出了字。', en: 'Give the same paragraph as text and as an image; if answers differ, ask only for a transcription to check whether it could read it.' },
  },
  T03: {
    vt: { ja: '書体と検索', zh: '字体与检索', en: 'Typeface and retrieval' },
    q: { ja: '同じページでも、書体を変えるだけで検索順位は変わるのでしょうか。', zh: '同一页内容，只换字体，检索排名会变吗？', en: 'Same page, typeface changed and nothing else — does the retrieval rank move?' },
    why: { ja: '内容とは無関係な書体の違いが、検索の安定性に影響するかを確かめたいと考えています。企業文書では、作成者によって書体が異なる場合があります。', zh: '想确认与内容无关的字体差异，是否影响检索的稳定性。企业文档的字体因作者而异。', en: 'To check whether a typeface difference unrelated to content affects retrieval stability. Corporate documents vary in typeface by author.' },
    now: { ja: '50ページ×3書体で700回の検索計算を完了しましたが、基準の書体で46/50ページが最初から1位で、事前に決めた難しさの条件を満たしませんでした。書体の効果は結論なし。材料を作り直しています（2026-10-29 複核）。', zh: '50 页 × 3 种字体共 700 次检索计算已完成，但基准字体下 46/50 页本来就排第一，不满足事先定的难度条件。字体效应无结论，正在重做材料（2026-10-29 复核）。', en: '700 retrieval runs over 50 pages × 3 typefaces completed, but 46 of 50 pages already ranked first in the baseline typeface, failing the pre-set difficulty condition. No conclusion on typeface; the material is being rebuilt (reviewed 2026-10-29).' },
    example: { ja: '「出願資格」の同じ文章を明朝・ゴシック・UD 書体で描き、同じ質問で検索します。', zh: '把「出愿资格」的同一段文字分别用明朝、黑体、UD 字体渲染，用同一个问题检索。', en: 'Render the same "eligibility" passage in Mincho, Gothic and UD, then search with the same question.' },
  },
  T04: {
    vt: { ja: '目立つ本則と、小さな例外', zh: '醒目的本则与小字例外', en: 'Bold rule, small exception' },
    q: { ja: '必要な根拠をすべて読み取れる状態でも、太さや大きさで目立つ方を根拠として選んでしまうのでしょうか。', zh: '所有需要的证据都能读到时，模型是否会把更醒目（粗体、更大）的那条当成"根据"？', en: 'When every needed piece of evidence is readable, does the model pick the bolder, larger one as "the evidence"?' },
    why: { ja: '例外が小さな注記にあると、目立つ本則だけを拾う仕組みは、例外の対象者に誤答するおそれがあります。', zh: '例外往往写在小字注记里。只拾取醒目本则的系统，会对适用例外的人答错。', en: 'Exceptions tend to live in small notes. A system that grabs the prominent main rule answers wrong for exactly the people the exception covers.' },
    now: { ja: '開発段階の130件を実行。純文字の問答が5/10で事前の門9/10に届かず、本番の候補は実行していません。字の太さの効果は結論なし。次は材料とモデルの見直しからです（2026-11-06 複核）。', zh: '开发阶段执行 130 条。纯文字问答 5/10，没到事前门槛 9/10，正式候选没有执行。字重效应无结论，下一步从材料和模型重看（2026-11-06 复核）。', en: '130 development requests run. Text-only QA scored 5/10 against a pre-set gate of 9/10, so the main candidates were not run. No conclusion on font weight; next step is to revisit material and model (reviewed 2026-11-06).' },
    example: { ja: '本則の「TOEIC 600 点以上」を太字にし、例外の「数学系は 700 点」を小さく添えます。文字の大きさや太さを変えたとき、数学系への回答も変わるかを比較したいと考えています。実験はまだ始めていません。説明用の例です。', zh: '把本则「TOEIC 600 分以上」设为粗体，例外「数学系 700 分」用小字附在旁边。想比较：改变字号和粗细时，对数学系的回答是否也跟着变。实验还没开始（说明用的例子）。', en: 'Set the main rule "TOEIC 600+" in bold and the exception "Mathematics: 700" in small type. The comparison: when size and weight change, does the answer for a maths applicant change too? Not yet run (illustrative example).' },
  },
};

export const glossary: { key: L; text: L }[] = [
  { key: { ja: 'RAG', zh: 'RAG', en: 'RAG' }, text: { ja: '資料を検索して、その内容を根拠に回答を作る仕組みです。', zh: '先检索资料，再依据资料生成回答的机制。', en: 'Retrieve documents, then answer using their content as evidence.' } },
  { key: { ja: '根拠', zh: '根据', en: 'evidence' }, text: { ja: '回答のもとになる資料や記述です。', zh: '回答依据的是哪份资料的哪一处。', en: 'Which document and which passage an answer rests on.' } },
  { key: { ja: '状態', zh: '状态', en: 'status' }, text: { ja: '規則が「現行」か「廃止」かといった情報です。', zh: '规则是"现行"还是"已废止"这类文字之外的信息。', en: 'Information beyond the words, such as whether a rule is current or superseded.' } },
];
