"""小学校の英単語 → ANRINO の SUBJECTS と QUESTIONS（JS）を作る"""
import json, random, sys

# (month, key, label, icon, [(英語, 日本語, ひとこと)...])
T = []
def g(month, key, label, icon, words):
    T.append((month, key, label, icon, words))

# ===== 3・4年 =====
g('eng_sho34', 'kazu', 'かず', '🔢', [
    ('one','1',''),('two','2',''),('three','3',''),('four','4',''),('five','5',''),
    ('six','6',''),('seven','7',''),('eight','8','gh は読まない（エイト）。'),('nine','9',''),('ten','10',''),
    ('eleven','11',''),('twelve','12','12 は twelve。twoteen とは言わない。'),
    ('thirteen','13','-teen は 13〜19。30 の thirty とまちがえない。'),
    ('fifteen','15','five → fifteen。v が f にかわる。'),('twenty','20','-ty は 20・30…の「〜十」。'),
    ('thirty','30','13 thirteen と 30 thirty をまちがえない。'),
    ('forty','40','four（4）だが forty（40）は u が入らない。'),('fifty','50','five → fifty。'),
    ('one hundred','100',''),
])
g('eng_sho34', 'iro', 'いろ・かたち', '🎨', [
    ('red','赤',''),('blue','青',''),('yellow','黄色',''),('green','緑',''),('white','白',''),
    ('black','黒',''),('pink','ピンク',''),('orange','オレンジ色','くだものの「オレンジ」も orange。'),
    ('purple','むらさき',''),('brown','茶色',''),
    ('circle','丸',''),('square','四角（正方形）',''),('triangle','三角',''),('star','星',''),('heart','ハート',''),
])
g('eng_sho34', 'doubutsu', 'どうぶつ', '🐶', [
    ('dog','犬',''),('cat','ねこ',''),('bird','鳥',''),('rabbit','うさぎ',''),('bear','くま',''),
    ('lion','ライオン',''),('tiger','トラ',''),('elephant','ゾウ',''),('monkey','サル',''),
    ('panda','パンダ',''),('horse','馬',''),('cow','牛',''),('pig','ぶた',''),
    ('mouse','ネズミ',''),('fish','魚',''),('frog','カエル',''),('snake','ヘビ',''),
    ('sheep','ひつじ',''),('penguin','ペンギン',''),('koala','コアラ',''),
])
g('eng_sho34', 'tabemono', 'たべもの', '🍎', [
    ('apple','りんご',''),('banana','バナナ',''),('strawberry','いちご',''),('grapes','ぶどう','ぶどうは ふつう ふさで grapes（s がつく）。'),
    ('melon','メロン',''),('peach','もも',''),('lemon','レモン',''),('cherry','さくらんぼ',''),
    ('rice','ごはん（米）',''),('bread','パン',''),('egg','たまご',''),('milk','牛にゅう',''),
    ('juice','ジュース',''),('water','水',''),('cake','ケーキ',''),('ice cream','アイスクリーム',''),
    ('tomato','トマト',''),('potato','じゃがいも',''),('carrot','にんじん',''),('onion','たまねぎ',''),
])
g('eng_sho34', 'karada', 'からだ', '👀', [
    ('head','頭',''),('face','顔',''),('eye','目',''),('ear','耳',''),('nose','鼻',''),
    ('mouth','口',''),('hand','手',''),('arm','うで',''),('leg','あし（太ももから足首）','足首から下は foot。'),
    ('foot','足（足首から下）','2つなら feet。'),('shoulder','かた',''),('knee','ひざ','k は読まない（ニー）。'),
])
g('eng_sho34', 'youbi', '曜日', '📅', [
    ('Sunday','日曜日','曜日は大文字で始める。'),('Monday','月曜日','曜日は大文字で始める。'),
    ('Tuesday','火曜日','つづり注意：Tu-es-day。'),('Wednesday','水曜日','d を読まない（ウェンズデイ）。つづり注意。'),
    ('Thursday','木曜日','Tuesday（火）と まちがえやすい。Th が木曜日。'),('Friday','金曜日',''),('Saturday','土曜日',''),
])
g('eng_sho34', 'tenki', '天気・季節', '☀️', [
    ('sunny','晴れの',''),('rainy','雨の',''),('cloudy','くもりの',''),('snowy','雪の',''),('windy','風の強い',''),
    ('hot','暑い',''),('cold','寒い',''),('warm','あたたかい',''),('cool','すずしい','「かっこいい」の意味もある。'),
    ('spring','春',''),('summer','夏',''),('fall','秋','autumn とも言う。'),('winter','冬',''),
])
g('eng_sho34', 'sports', 'スポーツ', '⚽', [
    ('soccer','サッカー',''),('baseball','野球',''),('basketball','バスケットボール',''),('tennis','テニス',''),
    ('volleyball','バレーボール',''),('swimming','水泳',''),('table tennis','たっきゅう','「テーブルでするテニス」。'),
    ('badminton','バドミントン',''),('dodgeball','ドッジボール',''),('rugby','ラグビー',''),
])
g('eng_sho34', 'bunbougu', '文ぼうぐ', '✏️', [
    ('pencil','えんぴつ',''),('pen','ペン',''),('eraser','消しゴム',''),('ruler','じょうぎ',''),
    ('notebook','ノート',''),('textbook','教科書',''),('desk','つくえ',''),('chair','いす',''),
    ('bag','かばん',''),('pencil case','筆箱',''),('scissors','はさみ',''),('glue','のり',''),
])

# ===== 5・6年 =====
g('eng_sho56', 'tsuki', '月', '🗓️', [
    ('January','1月','月の名前は大文字で始める。'),('February','2月','つづり注意：Feb-ru-ary。'),('March','3月',''),
    ('April','4月',''),('May','5月',''),('June','6月','July（7月）と まちがえやすい。'),('July','7月','June（6月）と まちがえやすい。'),
    ('August','8月',''),('September','9月',''),('October','10月',''),('November','11月',''),('December','12月',''),
])
g('eng_sho56', 'kyouka', '教科', '📚', [
    ('Japanese','国語','「日本語・日本人」の意味もある。'),('math','算数',''),('science','理科',''),
    ('social studies','社会',''),('English','英語',''),('music','音楽',''),('P.E.','体育','physical education の略。'),
    ('arts and crafts','図工',''),('home economics','家庭科',''),('calligraphy','書写（習字）',''),
])
g('eng_sho56', 'gakkou', '学校', '🏫', [
    ('school','学校',''),('classroom','教室',''),('library','図書館（図書室）',''),('gym','体育館',''),
    ('music room','音楽室',''),('science room','理科室',''),('playground','校庭',''),('teacher','先生',''),
    ('student','生徒',''),('friend','友だち','つづり注意：fr-ie-nd（i が先）。'),('principal','校長先生',''),('nurse\'s office','保健室',''),
])
g('eng_sho56', 'kazoku', '家族', '👪', [
    ('father','父',''),('mother','母',''),('brother','兄・弟',''),('sister','姉・妹',''),
    ('grandfather','祖父（おじいさん）',''),('grandmother','祖母（おばあさん）',''),('family','家族',''),
    ('baby','赤ちゃん',''),('boy','男の子',''),('girl','女の子',''),
])
g('eng_sho56', 'shigoto', 'しごと', '👩‍⚕️', [
    ('doctor','医者',''),('nurse','看護師',''),('pilot','パイロット',''),('police officer','警察官',''),
    ('firefighter','消防士',''),('singer','歌手',''),('farmer','農家の人',''),('baker','パン屋さん',''),
    ('florist','花屋さん',''),('vet','じゅう医','動物のお医者さん。'),('astronaut','宇宙飛行士',''),
    ('scientist','科学者',''),('zookeeper','動物園の飼育員',''),('cook','料理人','「料理する」の意味もある。'),
])
g('eng_sho56', 'fuku', '服', '👕', [
    ('hat','ぼうし',''),('T-shirt','Tシャツ',''),('sweater','セーター',''),('jacket','上着（ジャケット）',''),
    ('pants','ズボン',''),('skirt','スカート',''),('shoes','くつ','2つで1組なので s がつく。'),('socks','くつした',''),
    ('gloves','手ぶくろ',''),('umbrella','かさ',''),('glasses','めがね',''),('watch','うで時計','「見る」の意味もある。'),
])
g('eng_sho56', 'doushi', '動作', '🏃', [
    ('run','走る',''),('walk','歩く',''),('swim','泳ぐ',''),('jump','とぶ（ジャンプする）',''),
    ('eat','食べる',''),('drink','飲む',''),('sing','歌う',''),('dance','おどる',''),
    ('read','読む',''),('write','書く','w は読まない（ライト）。'),('study','勉強する',''),('sleep','ねる',''),
    ('see','見る',''),('go','行く',''),('like','好きだ',''),('want','ほしい',''),('play','（スポーツ・楽器を）する',''),
    ('ride','乗る',''),
])
g('eng_sho56', 'yousu', 'ようす', '😊', [
    ('big','大きい',''),('small','小さい',''),('long','長い',''),('short','短い','「背が低い」の意味もある。'),
    ('tall','背が高い',''),('new','新しい',''),('old','古い','「年をとった」の意味もある。'),
    ('happy','うれしい',''),('sad','悲しい',''),('hungry','おなかがすいた',''),('sleepy','ねむい',''),
    ('tired','つかれた',''),('beautiful','美しい',''),('cute','かわいい',''),('delicious','とてもおいしい',''),
    ('fun','楽しい',''),('kind','親切な',''),('strong','強い',''),('fast','速い',''),
])
g('eng_sho56', 'machi', 'まち', '🏙️', [
    ('park','公園',''),('station','駅',''),('hospital','病院',''),('post office','郵便局',''),
    ('zoo','動物園',''),('aquarium','水族館',''),('museum','博物館（美術館）',''),('restaurant','レストラン',''),
    ('supermarket','スーパーマーケット',''),('bookstore','本屋',''),('house','家',''),('bridge','橋',''),
    ('river','川',''),('mountain','山',''),('sea','海',''),('castle','城',''),('temple','寺',''),('shrine','神社',''),
])
g('eng_sho56', 'gyouji', '行事', '🎂', [
    ('birthday','たんじょう日',''),('New Year\'s Day','元日',''),('Christmas','クリスマス',''),
    ('summer vacation','夏休み',''),('school trip','修学旅行',''),('sports day','運動会',''),
    ('music festival','音楽会',''),('field trip','遠足',''),('graduation ceremony','卒業式',''),
    ('entrance ceremony','入学式',''),
])
g('eng_sho56', 'ichinichi', '1日', '⏰', [
    ('morning','朝',''),('afternoon','午後',''),('evening','夕方',''),('night','夜','gh は読まない（ナイト）。'),
    ('breakfast','朝ごはん',''),('lunch','昼ごはん',''),('dinner','夕ごはん',''),
    ('today','今日',''),('tomorrow','明日',''),('yesterday','昨日',''),('get up','起きる',''),('go to bed','ねる（ふとんに入る）',''),
])


rnd = random.Random(20261020)
prefix = {'eng_sho34': 'et34', 'eng_sho56': 'et56'}
subjects, questions = [], []
seen_ids = set()
for month, key, label, icon, words in T:
    # 同じグループ内で 英語・日本語が かぶらないか
    assert len({w[0] for w in words}) == len(words), key
    assert len({w[1] for w in words}) == len(words), key
    gk = f'et_{key}'
    subjects.append(f"  {gk}: {{ label: '{label}', icon: '{icon}', tag: 'tag-eitan', category: 'eigo', month: '{month}', isGroup: true }},")
    subjects.append(f"  {gk}_imi: {{ label: 'いみ', icon: '💬', tag: 'tag-eitan', category: 'eigo', month: '{month}', parent: '{gk}' }},")
    subjects.append(f"  {gk}_ei: {{ label: '英語で', icon: '🔤', tag: 'tag-eitan', category: 'eigo', month: '{month}', parent: '{gk}' }},")
    for i, (en, ja, note) in enumerate(words, 1):
        others = [w for w in words if w[0] != en]
        d = rnd.sample(others, 3)
        tip = ('\n' + note) if note else ''
        exp = f'{en} ＝ {ja}{tip}'
        # いみ（英→日）
        opts = [ja] + [x[1] for x in d]; rnd.shuffle(opts)
        qid = f'{prefix[month]}_{key}_i{i:02d}'; assert qid not in seen_ids; seen_ids.add(qid)
        questions.append({'id': qid, 'subject': f'{gk}_imi', 'month': month,
                          'q': f'{label} {i}\n"{en}" の意味はどれですか？', 'options': opts, 'answer': opts.index(ja), 'explanation': exp})
        # 英語で（日→英）
        d2 = rnd.sample(others, 3)
        opts = [en] + [x[0] for x in d2]; rnd.shuffle(opts)
        qid = f'{prefix[month]}_{key}_e{i:02d}'; assert qid not in seen_ids; seen_ids.add(qid)
        questions.append({'id': qid, 'subject': f'{gk}_ei', 'month': month,
                          'q': f'{label} {i}\n「{ja}」を英語で言うと、どれですか？', 'options': opts, 'answer': opts.index(en), 'explanation': exp})

def js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n') + "'"
qlines = ['  // ===== 英語 小学校の英単語（eng_sho34・eng_sho56）gen_eitan.py で作成 ====='] + [
    "  { id:%s, subject:%s, month:%s,\n    q:%s,\n    options:[%s], answer:%d,\n    explanation:%s }," % (
        js_str(q['id']), js_str(q['subject']), js_str(q['month']), js_str(q['q']),
        ','.join(js_str(o) for o in q['options']), q['answer'], js_str(q['explanation']))
    for q in questions]
open(sys.argv[1], 'w').write('\n'.join(['  // ===== 英語 小学校の英単語 ====='] + subjects) + '\n')
open(sys.argv[2], 'w').write('\n'.join(qlines) + '\n')
from collections import Counter
print(len(questions), 'questions', Counter(q['month'] for q in questions), len([s for s in subjects if 'isGroup' in s]), 'groups')
