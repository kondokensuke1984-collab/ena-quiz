# ena-quiz（ANRINO）の決まり

## 本番に出す前（2台のMacで作業しているので）
- `vercel --prod` は、手元のフォルダの中身をそのまま本番に出す。GitHub は見ない。手元が古いと、ほかのMacや別のセッションが入れた新しい機能（例：かぞくチャットの `api/chat.js`・`js/chat.js`）が、本番から消える（2026-11-01 に実際に起きた）
- 出す前に、必ず `git pull --rebase` で最新にし、`git status -sb` で origin/main より遅れていない（behind がない）ことを確かめる
- 出したあとは、`curl` で新しい機能が本番に入っているか確かめる
  - かぞくチャット：`/` と `/sora/` に `data-chat-open` があり、`/api/chat` が 200 を返すこと
- 本番に出したら、すぐ `git push` する
