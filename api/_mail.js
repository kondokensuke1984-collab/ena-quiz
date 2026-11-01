// 保護者の メールあて先（名前が _ で はじまるので Vercel は API として 公開しない）。
//   send-report.js と chat.js が つかう。あて先は ここだけに 書く
const PARENTS = {
  kensuke: 'kondokensuke1984@gmail.com',
  mitsuki: 'm.moon.u.94@gmail.com',
};
module.exports = { PARENTS, RECIPIENTS: Object.values(PARENTS) };
