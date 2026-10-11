// 学判・四科・合判模試の データを 保存するときの 保護者の 合言葉（サーバーの ANRINO_EDIT_TOKEN）。
// この端末で 1回 入れたら 覚えておき、ちがっていたら（401）わすれて もう1回 きく。
//   使い方：const r = await saveWithEditToken('/api/gakuhan', { data, sha });
(function () {
  const KEY = 'ena_edit_token';
  const get = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const set = (v) => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) { /* 覚えられなくても 今回は つかう */ } };

  window.saveWithEditToken = async function (url, body) {
    for (let i = 0; i < 2; i++) {
      let token = get();
      if (!token) {
        token = (prompt('保護者の 合言葉を 入れてください（この端末で 1回だけ）') || '').trim();
        if (!token) throw new Error('合言葉が 入っていません');
      }
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, token }),
      });
      if (r.status === 401) { set(''); alert('合言葉が ちがいます'); continue; }
      if (r.ok) set(token);
      return r;
    }
    throw new Error('合言葉が ちがいます');
  };
})();
