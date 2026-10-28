# CHEN YI AN — Portfolio

[yasu-isct.github.io](https://yasu-isct.github.io/) は、文書構造の理解と RAG 検索を軸にした個人サイトです。日本語（`/`）・中文（`/zh/`）・English（`/en/`）で、次の三本柱を紹介します。

- **成果物**：J-Grad Admission RAG と japanese-speaking-coach。実際の画面、担当範囲、検証方法、出典へ辿れる数値を掲載しています。
- **研究マップ**：文献、テーマ、問い、関係、読み進めるストーリーを整理した地図です。状態は四段階で示し、研究の実験結果は掲載していません。
- **AI 協働の記録**：提案を採用・修正した理由と、確かめた方法を記録しています。

## データと構成

Astro による静的サイトです。`src/pages/` が三言語のルート、`src/components/` が共通ページ、`src/i18n/ui.ts` が UI 翻訳、`src/content/` が成果物と協働記録を持ちます。

研究マップは R が管理する研究地図の公開用スナップショット（`data/public/research-map/`）から構築します。文献書誌・関係と日本語サイドカーを含み、フィールドと状態の定義は同ディレクトリの [README](data/public/research-map/README.md) にあります。`public: false` は元データの内部管理フィールドとして保持し、この値から公開範囲を変更しません。

成果物の画像・動画（`public/media/j-grad/`、`public/media/coach/`）は公開デモの実画面です。出典と撮影日は各キャプションに記載しています。`public/media/atlas/` は自作資料による説明図で、モデル出力や実験結果ではありません。

## ローカル開発

Node.js **22.23.4 以上**と npm を使います。リポジトリ直下で実行してください。

```sh
npm ci
npm run astro -- dev --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

開発サーバーは通常 `http://localhost:4321/` です。本番出力と公開データを確認するには、次を実行します。

```sh
node scripts/verify-public-data.mjs
npm run build
node scripts/verify-public-data.mjs --dist
```

`dist/` が配信対象です。`main` への push で GitHub Pages にデプロイし、`main` 向けの Pull Request ではビルドと公開データ検証を行います。

## 公開データの検証

`scripts/verify-public-data.mjs` は、内部パス・非公開フィールドなどの混入、ID の重複、参照先、元の `public` 値、レイアウト入力のハッシュ、衝突検証値、公開プロトタイプのファイル許可リストを確認します。`--dist` は生成物も走査し、非公開アセットの混入がなく、`noindex` と内部プレビューの表記が残っていないことを確認します。CI でもソースとビルド後の両方に実行します。

## License

本リポジトリのコードは [MIT License](LICENSE)（Copyright © 2026 CHEN YI AN）です。

`data/public/research-map/` および `public/media/` のコンテンツは MIT の対象外です。**All rights reserved. 引用時は出典明記。** 公開閲覧できることは、転載・再配布の許諾を意味しません。

第三者のコード・資料の権利と個別ライセンスは各権利者に帰属します。配布している D3 には `public/prototype-lineage/d3.LICENSE` の ISC ライセンスが適用されます。
