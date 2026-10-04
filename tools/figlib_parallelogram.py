BOX = '□'
import math, os
OUT = os.path.expanduser('~/Desktop/開発/ena-quiz/images')

def make(name, poly, dashed=(), dotted=(), rights=(), dims=(), area=None, s=12, verts=(), polys=(), lines=(), marks=(), target=400, shade=()):
    pts = list(poly) + [q for pl in shade for q in pl] + [q for pl in polys for q in pl] + [q for ln in lines for q in ln]
    for a, b in list(dashed) + list(dotted): pts += [a, b]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
    s = target / max(maxx - minx, (maxy - miny) * 1.1)
    pad = 95
    W = (maxx - minx) * s + pad * 2 + (190 if area else 0)
    H = (maxy - miny) * s + pad * 2
    T = lambda p: ((p[0] - minx) * s + pad, (maxy - p[1]) * s + pad)
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}" font-family="sans-serif">',
         f'<rect width="100%" height="100%" fill="#fff"/>']
    o.append('<polygon points="' + ' '.join('%.1f,%.1f' % T(p) for p in poly) + '" fill="#fff" stroke="#111" stroke-width="2.5"/>')
    for pl in shade:
        o.append('<polygon points="' + ' '.join('%.1f,%.1f' % T(p) for p in pl) + '" fill="#cbd5e1" stroke="#111" stroke-width="2"/>')
    for pl in polys:
        o.append('<polygon points="' + ' '.join('%.1f,%.1f' % T(p) for p in pl) + '" fill="#fff" stroke="#111" stroke-width="2.5"/>')
    for a, b in lines:
        (x1, y1), (x2, y2) = T(a), T(b)
        o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#111" stroke-width="2"/>')
    for lab, p in marks:
        x, y = T(p)
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="16" fill="#fff" stroke="#111" stroke-width="2"/>')
        o.append(f'<text x="{x:.1f}" y="{y + 8:.1f}" font-size="22" text-anchor="middle" fill="#111">{lab}</text>')
    for a, b in dashed:
        (x1, y1), (x2, y2) = T(a), T(b)
        o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#111" stroke-width="2" stroke-dasharray="6,5"/>')
    for a, b in dotted:
        (x1, y1), (x2, y2) = T(a), T(b)
        o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#111" stroke-width="2" stroke-dasharray="2,4"/>')
    for f, u, v in rights:   # foot, toward-line dir, toward-dashed dir (math coords)
        k = 14 / s
        nu = math.hypot(*u); nv = math.hypot(*v)
        u = (u[0] / nu * k, u[1] / nu * k); v = (v[0] / nv * k, v[1] / nv * k)
        p1 = (f[0] + u[0], f[1] + u[1]); p2 = (p1[0] + v[0], p1[1] + v[1]); p3 = (f[0] + v[0], f[1] + v[1])
        o.append('<polyline points="' + ' '.join('%.1f,%.1f' % T(p) for p in (p1, p2, p3)) + '" fill="none" stroke="#111" stroke-width="1.8"/>')
    for dm in dims:
        a, b, label, side = dm[:4]; lt = dm[4] if len(dm) > 4 else 0.5
        (x1, y1), (x2, y2) = T(a), T(b)
        dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy)
        nx, ny = dy / L * side, -dx / L * side
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        cx, cy = mx + nx * 36, my + ny * 36
        o.append(f'<path d="M{x1:.1f},{y1:.1f} Q{cx:.1f},{cy:.1f} {x2:.1f},{y2:.1f}" fill="none" stroke="#555" stroke-width="1.5"/>')
        if lt == 0.5:
            tx, ty = mx + nx * 46, my + ny * 46
        else:
            bx = (1-lt)**2*x1 + 2*lt*(1-lt)*cx + lt**2*x2; by = (1-lt)**2*y1 + 2*lt*(1-lt)*cy + lt**2*y2
            tx, ty = bx + nx * 28, by + ny * 28
        if label.startswith('@'):
            o.append(f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="16" fill="#fff" stroke="#111" stroke-width="2"/>')
            o.append(f'<text x="{tx:.1f}" y="{ty + 8:.1f}" font-size="22" text-anchor="middle" fill="#111">{label[1:]}</text>')
        elif label.startswith(BOX):
            o.append(f'<rect x="{tx-30:.1f}" y="{ty-11:.1f}" width="22" height="22" fill="#fff" stroke="#111" stroke-width="2"/>')
            o.append(f'<text x="{tx-4:.1f}" y="{ty + 8:.1f}" font-size="24" fill="#111" paint-order="stroke" stroke="#fff" stroke-width="6">cm</text>')
        else:
            o.append(f'<text x="{tx:.1f}" y="{ty + 8:.1f}" font-size="24" text-anchor="middle" fill="#111" paint-order="stroke" stroke="#fff" stroke-width="6">{label}</text>')
    for lab, p, (ox, oy) in verts:
        x, y = T(p)
        o.append(f'<text x="{x+ox:.1f}" y="{y+oy+8:.1f}" font-size="24" text-anchor="middle" fill="#111">{lab}</text>')
    if area:
        ax = (maxx - minx) * s + pad * 2 + 40
        o.append(f'<text x="{ax:.0f}" y="{H/2 - 6:.0f}" font-size="24" fill="#111">面積</text>')
        o.append(f'<text x="{ax:.0f}" y="{H/2 + 22:.0f}" font-size="24" fill="#111">{area}</text>')
    o.append('</svg>')
    open(os.path.join(OUT, name), 'w').write('\n'.join(o))

