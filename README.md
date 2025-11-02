# ASPメンテナンスポータル

メンテナンス予定／履歴を公開する React + Vite + Tailwind のシングルページです。  
**JSON運用**・**月別分割**・**ドラフト/公開フラグ**・**複数月読み込み**に対応。

## セットアップ

```bash
npm i
npm run dev
```

## 本番ビルド

```bash
# GitHub Pages で /<repo>/ 配下に出す場合は .env に以下を設定
# VITE_BASE=/your-repo-name/
npm run build
npm run preview
```

## データ配置

- `public/maintenance/2025-11.json` のように **月別JSON** を配置します。
- レコードに `published: false` を付けると **ドラフト** 扱いになり、本番では非表示です。

## クエリと読み込み範囲

- `?month=YYYY-MM` で基準月を切替。
- **予定タブ**: 基準月 + 翌月を読み込み
- **履歴タブ**: 前月 + 基準月を読み込み

## ライセンス

MIT
