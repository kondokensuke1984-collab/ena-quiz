// 🤫 がっこうの けいじばんの「ひみつの あいことば」。
// あいことば そのものは 書かず、SHA-256 だけを おく（ソースを 見ても わからないように）。
// 足すときは この表に1行：python3 -c "import hashlib;print(hashlib.sha256('ねこ'.encode()).hexdigest())"
// （ひらがな・はんかく・こもじに そろえてから ハッシュ。カタカナ・ぜんかく・スペースは ここで そろえる）
// 1かい だけ：メダル台帳の '<月>|bonus:<id>' が あれば もう もらえない（lib/medals.ts grantBonus）。

export interface SecretBonus { id: string; month: string; n: number; label: string }

const SECRETS: Record<string, SecretBonus> = {
  '2d35a5a9753e27d92d5916a0392282a91b24594a1bc62dd2823e8cefbbc66794': { id: '202609-kenken89', month: '202609', n: 80, label: 'けんけん もし 89％ ボーナス' },
};

export function normalizeSecret(s: string): string {
  return s
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/\s+/g, '');
}

export async function findSecret(input: string): Promise<SecretBonus | null> {
  const t = normalizeSecret(input);
  if (!t) return null;
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    return SECRETS[hex] ?? null;
  } catch {
    return null;
  }
}
