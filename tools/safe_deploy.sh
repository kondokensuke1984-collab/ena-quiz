#!/bin/bash
# 本番に出す前の安全確認つきデプロイ。`vercel --prod` の代わりに、これを使う。
#   bash tools/safe_deploy.sh
# 止まる条件（どれかに当てはまると、本番には出さない）:
#   1. 手元に まだ保存（コミット）していない変更がある
#   2. 手元が origin/main より遅れている（ほかのMac・別セッションの変更が入っていない）
#   3. 手元の変更が origin/main に入っていない（main に入れないと、次に誰かが main から出したとき消える）
set -e
cd "$(dirname "$0")/.."
# GitHub への接続がときどき切れる・止まるので、20秒で見切って数回やり直す
export GIT_SSH_COMMAND="ssh -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=2"
ok=0
for i in 1 2 3 4; do
  if git fetch origin -q 2>/dev/null; then ok=1; break; fi
  echo "（GitHubに つながらなかったので やり直します: $i）"; sleep 4
done
[ "$ok" = 1 ] || { echo "✋ GitHub に つながりません。最新かどうか確かめられないので、本番には出しません。"; exit 1; }
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "✋ まだ保存していない変更があります。先に git commit してください。"; exit 1
fi
if ! git merge-base --is-ancestor origin/main HEAD; then
  echo "✋ 手元が origin/main より遅れています。次を実行してから、もういちど:"
  echo "    git merge origin/main"; exit 1
fi
if ! git merge-base --is-ancestor HEAD origin/main; then
  echo "✋ 手元の変更が origin/main に入っていません（いまの枝: $(git branch --show-current)）。"
  echo "   このまま出すと、次に main から本番に出した人の操作で、今回の変更が消えます。次を実行してから、もういちど:"
  echo "    git push origin HEAD:main"; exit 1
fi
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
vercel --yes --prod
echo "--- 本番の確認 ---"
curl -s "https://ena-quiz.vercel.app/?v=$(date +%s)" | grep -c 'data-chat-open' | sed 's/^/かぞくチャット(data-chat-open): /'
curl -s -o /dev/null -w 'api/chat: %{http_code}\n' https://ena-quiz.vercel.app/api/chat
echo "最後に git push を忘れずに（main に入っていれば、これで同期ずみ）"
