# 栄光 10月ターム 算数「三角形の面積」練習問題A の図（images/tr23r_*.svg）
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from figlib_parallelogram import make, OUT
def foot(P, C, d):
    t = (P[0]-C[0])*d[0] + (P[1]-C[1])*d[1]; return (C[0]+t*d[0], C[1]+t*d[1])
# 1 方眼（27×6、1目もり1cm）。座標は (列, 上からの行)
cs = 30; pad = 20; W = 27*cs + pad*2; H = 6*cs + pad*2
P = lambda c, r: (pad + c*cs, pad + r*cs)
o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="sans-serif">', '<rect width="100%" height="100%" fill="#fff"/>']
for c in range(28): o.append(f'<line x1="{P(c,0)[0]}" y1="{P(c,0)[1]}" x2="{P(c,6)[0]}" y2="{P(c,6)[1]}" stroke="#9ca3af" stroke-width="1"/>')
for r in range(7): o.append(f'<line x1="{P(0,r)[0]}" y1="{P(0,r)[1]}" x2="{P(27,r)[0]}" y2="{P(27,r)[1]}" stroke="#9ca3af" stroke-width="1"/>')
tris = {'ア': [(1,5),(7,0),(7,5)], 'イ': [(9,2),(9,5),(16,0)], 'ウ': [(18,1),(27,1),(24,6)]}
for lab, t in tris.items():
    o.append('<polygon points="' + ' '.join('%d,%d' % P(*q) for q in t) + '" fill="#d1d5db" fill-opacity="0.75" stroke="#111" stroke-width="2.5"/>')
    cx = sum(q[0] for q in t)/3; cy = sum(q[1] for q in t)/3; x, y = P(cx, cy)
    o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="14" fill="#fff" stroke="#111" stroke-width="2"/>')
    o.append(f'<text x="{x:.1f}" y="{y+7:.1f}" font-size="20" text-anchor="middle" fill="#111">{lab}</text>')
o.append('</svg>'); open(os.path.join(OUT, 'tr23r_1.svg'), 'w').write('\n'.join(o))
# 2-(1) 直角三角形 12・16・20
A = (7.2, 9.6); B = (0,0); C = (20,0)
make('tr23r_2_1.svg', [B,C,A], rights=[(A,(B[0]-A[0],B[1]-A[1]),(C[0]-A[0],C[1]-A[1]))],
     dims=[(B,C,'20cm',-1),(B,A,'12cm',1),(A,C,'16cm',1)])
# 2-(2) 底辺14 高さ28（外） 斜辺38
h = math.sqrt(38**2-28**2); L = (0,h); M = (28,14); R = (28,0); Q = (28,h)
make('tr23r_2_2.svg', [L,M,R], dotted=[(L,Q),(Q,M)], rights=[(Q,(-1,0),(0,-1))],
     dims=[(L,Q,'28cm',1),(R,M,'14cm',-1),(L,R,'38cm',-1)])
# 2-(3) 上の辺21 高さ7 辺12
L = (0,7); R = (21,7); B = (math.sqrt(144-49),0); Fq = (B[0],7)
make('tr23r_2_3.svg', [L,R,B], dashed=[(B,Fq)], rights=[(Fq,(1,0),(0,-1))],
     dims=[(L,R,'21cm',1),(B,Fq,'7cm',-1),(L,B,'12cm',-1)])
# 4 面積75 BC12.5 BからACへの高さ10
B = (0,0); C = (12.5,0); A = (3.5,12); d = (-0.6,0.8); F = foot(B,C,d)
make('tr23r_4.svg', [B,C,A], dashed=[(B,F)], rights=[(F,(d[0],d[1]),(-F[0],-F[1]))],
     dims=[(B,C,'12.5cm',-1),(B,F,'10cm',-1)],
     verts=[('A',A,(0,-22)),('B',B,(-16,18)),('C',C,(16,18))])
# 5 高さ9（外） BC18 AC22.5
B = (0,0); C = (18,0); A = (18-math.sqrt(22.5**2-81), 9); E = (A[0],0)
make('tr23r_5.svg', [B,C,A], dashed=[(A,E)], dotted=[(E,B)], rights=[(E,(1,0),(0,1))],
     dims=[(B,C,'18cm',-1),(E,A,'9cm',1),(A,C,'22.5cm',1)],
     verts=[('A',A,(10,-20)),('B',B,(0,26)),('C',C,(16,18))])
print('ok')
