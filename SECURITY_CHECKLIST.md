# Web Security Checklist

このポートフォリオを公開するときのセキュリティ確認リストです。  
このサイトは `output: "export"` の静的サイトなので、HTTPセキュリティヘッダーはNext.jsアプリ本体ではなく、ホスティング/CDN側で必ず効かせます。

## 実装済み

- [x] `X-Powered-By` を無効化: `next.config.ts`
- [x] Cloudflare Pages / Netlify 用ヘッダー: `public/_headers`
- [x] Vercel 用ヘッダー: `vercel.json`
- [x] CSPを設定
  - `default-src 'self'`
  - `object-src 'none'`
  - `base-uri 'self'`
  - `frame-ancestors 'none'`
  - `form-action 'self'`
  - `upgrade-insecure-requests`
- [x] HSTSを設定: `Strict-Transport-Security`
- [x] MIME sniffingを禁止: `X-Content-Type-Options: nosniff`
- [x] iframe埋め込みを禁止: `X-Frame-Options: DENY` / `frame-ancestors 'none'`
- [x] Referrer漏れを抑制: `Referrer-Policy: strict-origin-when-cross-origin`
- [x] 権限APIを原則拒否: `Permissions-Policy`
- [x] Cross-origin分離系ヘッダーを設定: `COOP` / `CORP`
- [x] 静的アセットに長期キャッシュを設定
- [x] 検証ハーネスを追加: `npm run security:check`

## 公開前に毎回やる

- [ ] `npm install` 後に `npm audit --audit-level=moderate` を実行する
- [ ] `npm run build` が通る
- [ ] `npm run security:check` が通る
- [ ] `out/_headers` が生成されている
- [ ] 公開URLがHTTPSになっている
- [ ] 公開URLでセキュリティヘッダーを確認する
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`

## ホスティング別の注意

- Cloudflare Pages / Netlify:
  - `public/_headers` が `out/_headers` にコピーされるため、このまま使える。
- Vercel:
  - `vercel.json` の `headers` が使われる。
- GitHub Pages:
  - GitHub Pages単体では任意のHTTPレスポンスヘッダーを設定できない。
  - ガチガチにするなら、GitHub Pagesの前段にCloudflareを置くか、Cloudflare Pages / Netlify / Vercelへ移す。

## CSPについて

現在のCSPは静的Nextサイトを壊さない現実ラインです。Nextの静的書き出しではリクエストごとのnonceを注入できないため、`script-src` と `style-src` には `'unsafe-inline'` を残しています。

より強いnonceベースCSPにする場合は、静的exportをやめてSSR/Edge/Proxyでリクエストごとにnonceを発行する構成へ変えます。

## コード側で禁止

- [ ] `dangerouslySetInnerHTML` を使わない
- [ ] `eval()` を使わない
- [ ] `.innerHTML` を使わない
- [ ] `http://` の外部URLを入れない
- [ ] `target="_blank"` を使う場合は `rel="noopener noreferrer"` を付ける
- [ ] APIキーや秘密情報をクライアントコード、`.env.local`、Gitに入れない

## 公開後の確認コマンド例

```bash
curl -I https://example.com/
```

ブラウザDevToolsのNetworkタブでも、トップページHTMLのResponse Headersを確認します。
