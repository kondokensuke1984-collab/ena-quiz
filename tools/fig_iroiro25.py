# 栄光 10月ターム 算数「いろいろな図形の面積」確認問題・練習問題A の図（images/ir25*.svg）
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from figlib_parallelogram import make, OUT
def inter(p1, p2, p3, p4):
    d = (p1[0]-p2[0])*(p3[1]-p4[1]) - (p1[1]-p2[1])*(p3[0]-p4[0])
    t = ((p1[0]-p3[0])*(p3[1]-p4[1]) - (p1[1]-p3[1])*(p3[0]-p4[0])) / d
    return (p1[0]+t*(p2[0]-p1[0]), p1[1]+t*(p2[1]-p1[1]))
def grid(name, cols, rows, poly, cs=34, pad=16):
    W = cols*cs + pad*2; H = rows*cs + pad*2
    P = lambda c, r: (pad + c*cs, pad + r*cs)
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">', '<rect width="100%" height="100%" fill="#fff"/>']
    for c in range(cols+1): o.append(f'<line x1="{P(c,0)[0]}" y1="{P(c,0)[1]}" x2="{P(c,rows)[0]}" y2="{P(c,rows)[1]}" stroke="#9ca3af" stroke-width="1"/>')
    for r in range(rows+1): o.append(f'<line x1="{P(0,r)[0]}" y1="{P(0,r)[1]}" x2="{P(cols,r)[0]}" y2="{P(cols,r)[1]}" stroke="#9ca3af" stroke-width="1"/>')
    o.append('<polygon points="' + ' '.join('%d,%d' % P(*q) for q in poly) + '" fill="#cbd5e1" fill-opacity="0.8" stroke="#111" stroke-width="2.5"/>')
    o.append('</svg>'); open(os.path.join(OUT, name), 'w').write('\n'.join(o))
V = lambda pairs: [(k, p, o) for k, p, o in pairs]
# ── 確認問題 ──
s = 5/math.sqrt(2)
make('ir25k_1_1.svg', [(0,0),(s,0),(s,s),(0,s)], dashed=[((0,0),(s,s))], dims=[((0,0),(s,s),'5cm',1)])
make('ir25k_1_2.svg', [(0,7.5),(12,0),(24,7.5),(12,15)], dashed=[((0,7.5),(24,7.5)),((12,0),(12,15))], rights=[((12,7.5),(-1,0),(0,-1))],
     dims=[((12,0),(12,15),'15cm',-1,0.78),((0,7.5),(24,7.5),'24cm',-1,0.3)])
grid('ir25k_2_1.svg', 10, 8, [(5,0),(10,3),(5,8),(0,3)])
grid('ir25k_2_2.svg', 9, 8, [(5,0),(9,4),(5,8),(0,4)])
B,C,D,A,P = (0,0),(12,0),(15,8),(3,8),(7,0)
make('ir25k_3_1.svg', [B,C,D,A], shade=[[A,B,P],[P,C,D]], dashed=[(D,(15,0))], dotted=[(C,(15,0))], rights=[((15,0),(-1,0),(0,1))],
     dims=[(B,C,'12cm',-1),((15,0),D,'8cm',-1)], verts=[('A',A,(-6,-18)),('B',B,(-16,18)),('C',C,(0,26)),('D',D,(14,-14))])
B,C,D,A,P = (0,0),(17,0),(20,11),(3,11),(4.5,5)
make('ir25k_3_2.svg', [B,C,D,A], shade=[[A,D,P],[P,B,C]], dashed=[(D,(20,0))], dotted=[(C,(20,0))], rights=[((20,0),(-1,0),(0,1))],
     dims=[(B,C,'17cm',-1),((20,0),D,'11cm',-1)], verts=[('A',A,(-6,-18)),('B',B,(-16,18)),('C',C,(0,26)),('D',D,(14,-14))])
B,C,D,A,F = (0,0),(15,0),(19,9),(4,9),(6,0); E = (6+4*6/9, 6)
make('ir25k_3_3.svg', [B,C,D,A], shade=[[A,E,F],[E,D,F]], dashed=[(E,(E[0],0))], rights=[((E[0],0),(1,0),(0,1))],
     dims=[(B,C,'15cm',-1),((E[0],0),E,'6cm',-1)],
     verts=[('A',A,(-6,-18)),('B',B,(-16,18)),('C',C,(14,20)),('D',D,(14,-14)),('E',E,(-16,-6)),('F',F,(-4,24))])
B,C,A,D,F = (0,0),(24,0),(-5,13),(19,13),(5,13); E = (5+5*9/13, 4)
make('ir25k_3_4.svg', [B,C,D,A], shade=[[F,B,E],[F,E,C]], dashed=[((E[0],13),E)], rights=[((E[0],13),(1,0),(0,-1))],
     dims=[(B,C,'24cm',-1),(E,(E[0],13),'9cm',-1)],
     verts=[('A',A,(-14,-12)),('B',B,(-14,20)),('C',C,(14,20)),('D',D,(14,-14)),('E',E,(-16,10)),('F',F,(0,-16))])
# ── 練習問題A ──
make('ir25r_2_1.svg', [(0,14),(6,21),(24,14),(6,0)], dashed=[((0,14),(24,14)),((6,0),(6,21))], rights=[((6,14),(-1,0),(0,-1))],
     dims=[((6,0),(6,21),'21cm',-1,0.3),((0,14),(24,14),'24cm',-1,0.65)])
make('ir25r_2_2.svg', [(0,13),(16,17),(25,13),(16,0)], dashed=[((0,13),(25,13)),((16,0),(16,17))], rights=[((16,13),(1,0),(0,1))],
     dims=[((16,0),(16,17),'17cm',-1),((0,13),(25,13),'25cm',-1)])
B,C,D,A,P = (0,0),(27,0),(30,16),(3,16),(26,4)
make('ir25r_3_1.svg', [B,C,D,A], shade=[[A,D,P],[B,C,P]], dashed=[(D,(30,0))], dotted=[(C,(30,0))], rights=[((30,0),(-1,0),(0,1))],
     dims=[(B,C,'27cm',-1),((30,0),D,'16cm',-1)], verts=[('A',A,(-6,-18)),('B',B,(-16,18)),('C',C,(0,26)),('D',D,(14,-14))])
B,C,A,D = (5,0),(31,0),(0,18),(26,18); X = inter(A,C,B,D)
make('ir25r_3_2.svg', [B,C,D,A], shade=[[A,B,X],[D,C,X]], lines=[(A,C),(B,D)], dashed=[(A,(0,0))], dotted=[((0,0),B)], rights=[((0,0),(1,0),(0,1))],
     dims=[(B,C,'26cm',-1),((0,0),A,'18cm',1)], verts=[('A',A,(-14,-12)),('B',B,(0,26)),('C',C,(14,20)),('D',D,(14,-14))])
A,B,C,P = (20,24),(0,0),(35,0),(20,10)
make('ir25r_3_3.svg', [B,C,A], shade=[[A,B,P],[A,P,C]], dashed=[(P,(20,0))], rights=[((20,0),(1,0),(0,1))],
     dims=[(B,C,'35cm',-1),(P,A,'14cm',-1)])
T,Bt,P,R = (0,25),(0,0),(7,12.5),(30,12.5)
make('ir25r_3_4.svg', [T,R,Bt], shade=[[T,P,R],[P,Bt,R]], dashed=[((0,12.5),P),(P,R)], rights=[((0,12.5),(0,1),(1,0))],
     dims=[(Bt,T,'25cm',1),(P,R,'23cm',-1)])
B,C,A,D = (0,0),(28,0),(4,15),(32,15); p1,p2,a1,a2 = (11,0),(15,0),(10,15),(17,15)
make('ir25r_4_1.svg', [B,C,D,A], shade=[[B,p1,a1],[p1,p2,a2],[p2,C,D]], dashed=[(D,(32,0))], dotted=[(C,(32,0))], rights=[((32,0),(-1,0),(0,1))],
     dims=[(B,C,'28cm',-1),((32,0),D,'15cm',-1)], verts=[('A',A,(-6,-18)),('B',B,(-16,18)),('C',C,(0,26)),('D',D,(14,-14))])
B,C,A,D = (0,0),(18,0),(6,15),(24,15); M,N = (15,15),(9,0); Pp = (3.6,9); Q = (18+0.4*6, 0.4*15)
make('ir25r_4_2.svg', [B,C,D,A], shade=[[M,Pp,N,Q]], dashed=[(D,(24,0))], dotted=[(C,(24,0))], rights=[((24,0),(-1,0),(0,1))],
     dims=[(A,M,'9cm',1),(M,D,'9cm',1),(B,N,'9cm',-1),(N,C,'9cm',-1),((24,0),D,'15cm',-1)],
     verts=[('A',A,(-14,-10)),('B',B,(-16,18)),('C',C,(4,28)),('D',D,(14,-14))])
print('ok')
