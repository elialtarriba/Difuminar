// =====================================================================
// Estilos de texto de Difuminar.
// Cada estilo se dibuja SIEMPRE con la misma función, tanto en la vista
// previa, como en los botones de muestra, como al fijarlo en la foto.
// Así lo que ves es exactamente lo que se guarda.
// =====================================================================
(function () {
    const F = {
        moderna: "'Inter', Arial, sans-serif",
        impacto: "'Anton', Impact, sans-serif",
        condensada: "'Bebas Neue', 'Anton', sans-serif",
        cursiva: "'Pacifico', cursive",
        firma: "'Dancing Script', cursive",
        clasica: "'Playfair Display', Georgia, serif",
        maquina: "'Special Elite', 'Courier New', monospace",
        rotulador: "'Permanent Marker', cursive",
        comic: "'Bangers', 'Anton', sans-serif",
        retro: "'Lobster', cursive",
        mano: "'Caveat', cursive"
    };

    // Lista para el selector de letra
    const FONT_OPTIONS = [
        ['Moderna', F.moderna], ['Impactante', F.impacto], ['Condensada', F.condensada],
        ['Cursiva', F.cursiva], ['Firma', F.firma], ['Clásica', F.clasica],
        ['Máquina de escribir', F.maquina], ['Rotulador', F.rotulador], ['Cómic', F.comic], ['Retro', F.retro], ['A mano', F.mano]
    ];

    // ---------- utilidades ----------
    const font = (o, weight = 'normal', style = 'normal', scale = 1, family) =>
        `${style} ${weight} ${Math.max(1, o.size * scale)}px ${family || o.font}`;

    function linesY(n, lh) { const start = -((n - 1) * lh) / 2; return i => start + i * lh; }

    function spacedWidth(c, text, spacing) {
        const chars = Array.from(text);
        return chars.reduce((w, ch) => w + c.measureText(ch).width, 0) + spacing * Math.max(0, chars.length - 1);
    }
    function fillSpaced(c, text, x, y, spacing, stroke) {
        const chars = Array.from(text);
        let cx = x - spacedWidth(c, text, spacing) / 2;
        const align = c.textAlign; c.textAlign = 'left';
        chars.forEach(ch => {
            if (stroke) c.strokeText(ch, cx, y);
            c.fillText(ch, cx, y);
            cx += c.measureText(ch).width + spacing;
        });
        c.textAlign = align;
    }
    function roundRect(c, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }
    function hexToRgb(hex) {
        const h = hex.replace('#', '');
        const n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function luminance(hex) { const [r, g, b] = hexToRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
    function shade(hex, f) { // f<0 oscurece, f>0 aclara
        const [r, g, b] = hexToRgb(hex);
        const m = v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f);
        return `rgb(${m(r)},${m(g)},${m(b)})`;
    }
    function hueShift(hex, deg) {
        let [r, g, b] = hexToRgb(hex).map(v => v / 255);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0; const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
            h /= 6;
        }
        if (s < 0.15) { s = 0.75; }   // con blanco/negro/gris usamos un degradado de colores
        h = (h + deg / 360) % 1;
        const l2 = Math.min(0.62, Math.max(0.45, l));
        return `hsl(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l2 * 100)}%)`;
    }
    const contrastText = hex => luminance(hex) > 0.6 ? '#111111' : '#ffffff';
    function heart(c, x, y, s) {
        c.beginPath();
        c.moveTo(x, y + s * 0.35);
        c.bezierCurveTo(x - s * 0.9, y - s * 0.3, x - s * 0.45, y - s * 0.95, x, y - s * 0.45);
        c.bezierCurveTo(x + s * 0.45, y - s * 0.95, x + s * 0.9, y - s * 0.3, x, y + s * 0.35);
        c.fill();
    }
    function star(c, x, y, r) {
        c.beginPath();
        for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
            c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        c.closePath(); c.fill();
    }

    // ---------- estilos ----------
    const STYLES = [
        {
            id: 'basico', name: 'Básico', sample: 'Hola', font: F.moderna,
            draw(c, L, o) {
                c.font = font(o, '600');
                c.fillStyle = o.color;
                c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = o.size * 0.12; c.shadowOffsetY = o.size * 0.04;
                const y = linesY(L.length, o.size * 1.2);
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'bloque', name: 'Bloque', sample: 'VERANO\nCON LA\nFAMILIA', font: F.impacto,
            draw(c, L, o) {
                // Cada línea se estira para que todas tengan el mismo ancho
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const widths = up.map(t => Math.max(1, c.measureText(t).width));
                const target = Math.max(...widths);
                const sizes = widths.map(w => Math.min(3, target / w) * o.size);
                const total = sizes.reduce((a, s) => a + s * 0.98, 0);
                let y = -total / 2;
                c.fillStyle = o.color;
                up.forEach((t, i) => {
                    c.font = `normal ${sizes[i]}px ${o.font}`;
                    c.fillText(t, 0, y + sizes[i] * 0.49);
                    y += sizes[i] * 0.98;
                });
            }
        },
        {
            id: 'cursiva', name: 'Cursiva', sample: 'momentos\nbonitos', font: F.cursiva,
            draw(c, L, o) {
                c.font = font(o);
                c.fillStyle = o.color;
                c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = o.size * 0.1; c.shadowOffsetY = o.size * 0.05;
                const y = linesY(L.length, o.size * 1.35);
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'accion', name: 'Acción', sample: '¡VAMOS\nA POR ELLO!', font: F.impacto,
            draw(c, L, o) {
                c.save();
                c.transform(1, 0, -0.2, 1, 0, 0);
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const maxW = Math.max(...up.map(t => c.measureText(t).width));
                const lh = o.size * 1.1, y = linesY(L.length, lh);
                const top = y(0) - o.size * 0.75, bottom = y(L.length - 1) + o.size * 0.75;
                c.fillStyle = o.color;
                const bar = Math.max(2, o.size * 0.1);
                c.fillRect(-maxW / 2 - o.size * 0.3, top - bar, maxW + o.size * 0.6, bar);
                c.fillRect(-maxW / 2 - o.size * 0.3, bottom, maxW + o.size * 0.6, bar);
                up.forEach((t, i) => c.fillText(t, 0, y(i)));
                c.restore();
            }
        },
        {
            id: 'poster', name: 'Póster', sample: 'DISFRUTA\nDEL TIEMPO\ncon la gente\nQUE TE HACE\nfeliz', font: F.impacto,
            draw(c, L, o) {
                const s = o.size, col = o.color;
                c.fillStyle = col; c.strokeStyle = col;
                const parts = L.map((t, i) => {
                    if (i === 0) return { t: t.toUpperCase(), f: `normal 400 ${s * 0.7}px ${F.condensada}`, sp: s * 0.35, h: s * 0.9 };
                    if (i === 1) return { t: t.toUpperCase(), f: `normal 400 ${s * 1.25}px ${F.impacto}`, sp: 0, h: s * 1.45 };
                    if (i === 2) return { t, f: `italic 400 ${s * 0.85}px ${F.clasica}`, sp: 0, h: s * 1.2, lines: true };
                    if (i === 3) return { t: t.toUpperCase(), f: `normal 700 ${s * 0.55}px ${F.moderna}`, sp: s * 0.08, h: s * 1.15, banner: true };
                    return { t, f: `normal 400 ${s * 1.05}px ${F.cursiva}`, sp: 0, h: s * 1.5 };
                });
                let maxW = 0;
                parts.forEach(p => { c.font = p.f; maxW = Math.max(maxW, spacedWidth(c, p.t, p.sp) + (p.lines ? s * 2.6 : 0) + (p.banner ? s * 1.4 : 0)); });
                const starH = s * 1.0;
                const totalH = starH + parts.reduce((a, p) => a + p.h, 0);
                const boxW = maxW + s * 1.6, boxH = totalH + s * 1.2;
                c.lineWidth = Math.max(2, s * 0.08);
                c.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);
                let y = -totalH / 2;
                star(c, 0, y + starH * 0.45, s * 0.32);
                y += starH;
                parts.forEach(p => {
                    const cy = y + p.h / 2;
                    c.font = p.f;
                    const w = spacedWidth(c, p.t, p.sp);
                    if (p.banner) {
                        const bw = w + s * 0.9, bh = s * 0.85;
                        c.fillStyle = col;
                        c.beginPath();
                        c.moveTo(-bw / 2 - s * 0.35, cy - bh / 2); c.lineTo(bw / 2 + s * 0.35, cy - bh / 2);
                        c.lineTo(bw / 2, cy); c.lineTo(bw / 2 + s * 0.35, cy + bh / 2);
                        c.lineTo(-bw / 2 - s * 0.35, cy + bh / 2); c.lineTo(-bw / 2, cy); c.closePath(); c.fill();
                        c.fillStyle = contrastText(col);
                        fillSpaced(c, p.t, 0, cy, p.sp);
                        c.fillStyle = col;
                    } else {
                        fillSpaced(c, p.t, 0, cy, p.sp);
                    }
                    if (p.lines) {
                        c.lineWidth = Math.max(1, s * 0.05);
                        [-1, 1].forEach(side => {
                            const x0 = side * (w / 2 + s * 0.3), x1 = side * (w / 2 + s * 1.3);
                            [-s * 0.12, s * 0.12].forEach(dy => { c.beginPath(); c.moveTo(x0, cy + dy); c.lineTo(x1, cy + dy); c.stroke(); });
                        });
                    }
                    y += p.h;
                });
            }
        },
        {
            id: 'neon', name: 'Neón', sample: 'Fiesta', font: F.cursiva,
            draw(c, L, o) {
                c.font = font(o);
                const y = linesY(L.length, o.size * 1.4);
                L.forEach((t, i) => {
                    c.fillStyle = o.color; c.shadowColor = o.color;
                    [o.size * 0.9, o.size * 0.45, o.size * 0.2].forEach(b => { c.shadowBlur = b; c.fillText(t, 0, y(i)); });
                    c.shadowBlur = o.size * 0.08; c.shadowColor = '#ffffff';
                    c.fillStyle = shade(o.color, 0.75);
                    c.fillText(t, 0, y(i));
                });
            }
        },
        {
            id: 'sticker', name: 'Pegatina', sample: '¡GUAU!', font: F.comic,
            draw(c, L, o) {
                c.font = font(o);
                c.lineJoin = 'round';
                const y = linesY(L.length, o.size * 1.15);
                L.forEach((t, i) => {
                    c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = o.size * 0.15; c.shadowOffsetY = o.size * 0.08;
                    c.strokeStyle = '#ffffff'; c.lineWidth = o.size * 0.3;
                    c.strokeText(t, 0, y(i));
                    c.shadowColor = 'transparent';
                    c.strokeStyle = shade(o.color, -0.45); c.lineWidth = o.size * 0.06;
                    c.strokeText(t, 0, y(i));
                    c.fillStyle = o.color;
                    c.fillText(t, 0, y(i));
                });
            }
        },
        {
            id: 'sombra3d', name: '3D', sample: '3D', font: F.impacto,
            draw(c, L, o) {
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const y = linesY(L.length, o.size * 1.15);
                const depth = Math.max(3, Math.round(o.size * 0.14));
                up.forEach((t, i) => {
                    for (let d = depth; d > 0; d--) {
                        c.fillStyle = shade(o.color, -0.55 - 0.25 * (d / depth));
                        c.fillText(t, d, y(i) + d);
                    }
                    c.fillStyle = o.color;
                    c.fillText(t, 0, y(i));
                    c.strokeStyle = shade(o.color, -0.6); c.lineWidth = Math.max(1, o.size * 0.02);
                    c.strokeText(t, 0, y(i));
                });
            }
        },
        {
            id: 'elegante', name: 'Elegante', sample: 'ELEGANCIA', font: F.clasica,
            draw(c, L, o) {
                c.font = font(o);
                const sp = o.size * 0.35, lh = o.size * 1.35;
                const up = L.map(t => t.toUpperCase());
                const maxW = Math.max(...up.map(t => spacedWidth(c, t, sp)));
                const y = linesY(L.length, lh);
                const top = y(0) - o.size * 0.85, bottom = y(L.length - 1) + o.size * 0.85;
                c.fillStyle = o.color; c.strokeStyle = o.color;
                c.lineWidth = Math.max(1, o.size * 0.03);
                [top, bottom].forEach(yy => {
                    c.beginPath(); c.moveTo(-maxW / 2 - o.size * 0.4, yy); c.lineTo(-o.size * 0.3, yy); c.stroke();
                    c.beginPath(); c.moveTo(o.size * 0.3, yy); c.lineTo(maxW / 2 + o.size * 0.4, yy); c.stroke();
                    c.beginPath(); c.moveTo(0, yy - o.size * 0.16); c.lineTo(o.size * 0.16, yy); c.lineTo(0, yy + o.size * 0.16); c.lineTo(-o.size * 0.16, yy); c.closePath(); c.fill();
                });
                up.forEach((t, i) => fillSpaced(c, t, 0, y(i), sp));
            }
        },
        {
            id: 'cita', name: 'Cita', sample: 'Vive\nel momento', font: F.clasica,
            draw(c, L, o) {
                c.font = font(o, '400', 'italic');
                const lh = o.size * 1.3, y = linesY(L.length, lh);
                const maxW = Math.max(...L.map(t => c.measureText(t).width));
                c.fillStyle = o.color;
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
                c.globalAlpha = 0.45;
                c.font = font(o, '700', 'normal', 3, F.clasica);
                c.fillText('“', -maxW / 2 - o.size * 0.6, y(0) - o.size * 0.2);
                c.fillText('”', maxW / 2 + o.size * 0.6, y(L.length - 1) + o.size * 1.1);
                c.globalAlpha = 1;
            }
        },
        {
            id: 'minimal', name: 'Minimal', sample: 'MINIMAL', font: F.moderna,
            draw(c, L, o) {
                c.font = font(o, '500');
                const sp = o.size * 0.4, lh = o.size * 1.4;
                const up = L.map(t => t.toUpperCase());
                const maxW = Math.max(...up.map(t => spacedWidth(c, t, sp)));
                const y = linesY(L.length, lh);
                const bw = maxW + o.size * 1.6, bh = L.length * lh + o.size * 0.9;
                c.strokeStyle = o.color; c.lineWidth = Math.max(1, o.size * 0.04);
                c.strokeRect(-bw / 2, -bh / 2, bw, bh);
                c.fillStyle = o.color;
                up.forEach((t, i) => fillSpaced(c, t, 0, y(i), sp));
            }
        },
        {
            id: 'sello', name: 'Sello', sample: 'SELLO\nOFICIAL', font: F.maquina,
            draw(c, L, o) {
                c.save();
                c.rotate(-0.14);
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const lh = o.size * 1.15, y = linesY(L.length, lh);
                const maxW = Math.max(...up.map(t => c.measureText(t).width));
                const r = Math.max(maxW / 2, (L.length * lh) / 2) + o.size * 0.9;
                c.strokeStyle = o.color; c.fillStyle = o.color;
                c.lineWidth = Math.max(2, o.size * 0.1);
                c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
                c.lineWidth = Math.max(1, o.size * 0.04);
                c.beginPath(); c.arc(0, 0, r - o.size * 0.22, 0, Math.PI * 2); c.stroke();
                star(c, -r + o.size * 0.55, 0, o.size * 0.18);
                star(c, r - o.size * 0.55, 0, o.size * 0.18);
                up.forEach((t, i) => c.fillText(t, 0, y(i)));
                // efecto de tinta gastada
                c.globalCompositeOperation = 'destination-out';
                let seed = 7;
                const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
                for (let k = 0; k < 140; k++) {
                    c.globalAlpha = 0.25 + rnd() * 0.4;
                    c.beginPath(); c.arc((rnd() - 0.5) * r * 2, (rnd() - 0.5) * r * 2, o.size * (0.02 + rnd() * 0.05), 0, Math.PI * 2); c.fill();
                }
                c.restore();
            }
        },
        {
            id: 'firma', name: 'Firma', sample: 'Firma', font: F.firma,
            draw(c, L, o) {
                c.font = font(o, '700', 'normal', 1.4);
                const lh = o.size * 1.5, y = linesY(L.length, lh);
                const maxW = Math.max(...L.map(t => c.measureText(t).width));
                c.fillStyle = o.color; c.strokeStyle = o.color;
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
                const by = y(L.length - 1) + o.size * 0.7;
                c.lineWidth = Math.max(1.5, o.size * 0.06); c.lineCap = 'round';
                c.beginPath();
                c.moveTo(-maxW / 2 - o.size * 0.2, by + o.size * 0.1);
                c.bezierCurveTo(-maxW / 6, by - o.size * 0.25, maxW / 6, by + o.size * 0.35, maxW / 2 + o.size * 0.4, by - o.size * 0.2);
                c.stroke();
            }
        },
        {
            id: 'cinta', name: 'Cinta', sample: 'CINTA', font: F.condensada,
            draw(c, L, o) {
                c.font = font(o);
                const lh = o.size * 1.35, y = linesY(L.length, lh);
                L.map(t => t.toUpperCase()).forEach((t, i) => {
                    const w = c.measureText(t).width + o.size * 1.0;
                    c.save();
                    c.translate(0, y(i));
                    c.rotate(i % 2 ? 0.03 : -0.03);
                    c.fillStyle = o.color;
                    // bordes de cinta rasgada
                    c.beginPath();
                    const h = o.size * 1.15, steps = 6;
                    c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2);
                    for (let k = 1; k <= steps; k++) c.lineTo(w / 2 + (k % 2 ? o.size * 0.08 : 0), -h / 2 + h * k / steps);
                    c.lineTo(-w / 2, h / 2);
                    for (let k = steps - 1; k >= 0; k--) c.lineTo(-w / 2 - (k % 2 ? o.size * 0.08 : 0), -h / 2 + h * k / steps);
                    c.closePath(); c.fill();
                    c.globalCompositeOperation = 'destination-out';
                    c.fillText(t, 0, o.size * 0.04);
                    c.restore();
                });
            }
        },
        {
            id: 'retro', name: 'Retro', sample: 'Retro', font: F.retro,
            draw(c, L, o) {
                c.save();
                c.rotate(-0.12);
                c.font = font(o);
                const lh = o.size * 1.25, y = linesY(L.length, lh);
                const off = Math.max(2, o.size * 0.09);
                L.forEach((t, i) => {
                    c.fillStyle = shade(o.color, -0.5);
                    c.fillText(t, off * 1.6, y(i) + off * 1.6);
                    c.fillStyle = o.color;
                    c.fillText(t, off * 0.8, y(i) + off * 0.8);
                    c.fillStyle = '#ffffff';
                    c.fillText(t, 0, y(i));
                    c.strokeStyle = shade(o.color, -0.5); c.lineWidth = Math.max(1, o.size * 0.03);
                    c.strokeText(t, 0, y(i));
                });
                c.restore();
            }
        },
        {
            id: 'vertical', name: 'Vertical', sample: 'SOL', font: F.condensada,
            draw(c, L, o) {
                c.font = font(o);
                c.fillStyle = o.color;
                const colW = o.size * 1.1;
                const x0 = -((L.length - 1) * colW) / 2;
                L.forEach((t, col) => {
                    const chars = Array.from(t.toUpperCase());
                    const y = linesY(chars.length, o.size * 0.95);
                    chars.forEach((ch, r) => c.fillText(ch, x0 + col * colW, y(r)));
                });
            }
        },
        {
            id: 'romantico', name: 'Romántico', sample: 'Amor', font: F.clasica,
            draw(c, L, o) {
                c.font = font(o, '400', 'italic');
                const lh = o.size * 1.3, y = linesY(L.length, lh);
                c.fillStyle = o.color;
                L.forEach((t, i) => {
                    const w = c.measureText(t).width;
                    c.fillText(t, 0, y(i));
                    heart(c, -w / 2 - o.size * 0.55, y(i), o.size * 0.35);
                    heart(c, w / 2 + o.size * 0.55, y(i), o.size * 0.35);
                });
            }
        },
        // ---------- NUEVOS ----------
        {
            id: 'degradado', name: 'Degradado', sample: 'VERANO', font: F.impacto,
            draw(c, L, o) {
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const lh = o.size * 1.1, y = linesY(L.length, lh);
                const top = y(0) - o.size * 0.6, bottom = y(L.length - 1) + o.size * 0.6;
                const g = c.createLinearGradient(0, top, 0, bottom);
                g.addColorStop(0, hueShift(o.color, -35));
                g.addColorStop(0.5, hueShift(o.color, 0));
                g.addColorStop(1, hueShift(o.color, 45));
                c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = o.size * 0.15; c.shadowOffsetY = o.size * 0.06;
                c.fillStyle = g;
                up.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'etiqueta', name: 'Etiqueta', sample: 'Hoy toca\nplaya', font: F.moderna,
            draw(c, L, o) {
                c.font = font(o, '700');
                const lh = o.size * 1.45, y = linesY(L.length, lh);
                L.forEach((t, i) => {
                    const w = c.measureText(t).width + o.size * 0.9;
                    c.fillStyle = o.color;
                    roundRect(c, -w / 2, y(i) - o.size * 0.68, w, o.size * 1.36, o.size * 0.35);
                    c.fill();
                });
                c.fillStyle = contrastText(o.color);
                L.forEach((t, i) => c.fillText(t, 0, y(i) + o.size * 0.03));
            }
        },
        {
            id: 'contorno', name: 'Contorno', sample: 'CONTORNO', font: F.impacto,
            draw(c, L, o) {
                c.font = font(o);
                c.lineJoin = 'round';
                const up = L.map(t => t.toUpperCase());
                const y = linesY(L.length, o.size * 1.15);
                c.strokeStyle = o.color;
                up.forEach((t, i) => { c.lineWidth = o.size * 0.13; c.strokeText(t, 0, y(i)); });
                c.globalCompositeOperation = 'destination-out';
                up.forEach((t, i) => { c.lineWidth = o.size * 0.05; c.strokeText(t, 0, y(i)); c.fillText(t, 0, y(i)); });
                c.globalCompositeOperation = 'source-over';
            }
        },
        {
            id: 'marcador', name: 'Marcador', sample: 'Importante', font: F.rotulador,
            draw(c, L, o) {
                c.font = font(o);
                const lh = o.size * 1.4, y = linesY(L.length, lh);
                L.forEach((t, i) => {
                    const w = c.measureText(t).width + o.size * 0.5;
                    c.save();
                    c.translate(0, y(i));
                    c.rotate(-0.025);
                    c.globalAlpha = 0.85;
                    c.fillStyle = o.color;
                    c.beginPath();
                    c.moveTo(-w / 2, -o.size * 0.42);
                    c.quadraticCurveTo(0, -o.size * 0.5, w / 2, -o.size * 0.4);
                    c.lineTo(w / 2 + o.size * 0.1, o.size * 0.45);
                    c.quadraticCurveTo(0, o.size * 0.52, -w / 2 - o.size * 0.08, o.size * 0.42);
                    c.closePath(); c.fill();
                    c.restore();
                });
                c.fillStyle = contrastText(o.color);
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'glitch', name: 'Glitch', sample: 'GLITCH', font: F.impacto,
            draw(c, L, o) {
                c.font = font(o);
                const up = L.map(t => t.toUpperCase());
                const y = linesY(L.length, o.size * 1.15);
                const k = Math.max(2, o.size * 0.06);
                up.forEach((t, i) => {
                    c.fillStyle = 'rgba(0,229,255,0.9)'; c.fillText(t, -k, y(i));
                    c.fillStyle = 'rgba(255,0,90,0.9)'; c.fillText(t, k, y(i));
                    c.fillStyle = o.color; c.fillText(t, 0, y(i));
                    // franjas desplazadas
                    const w = c.measureText(t).width;
                    [[-0.15, 0.1, 1.6], [0.2, 0.08, -1.3]].forEach(([fy, fh, dx]) => {
                        c.save();
                        c.beginPath(); c.rect(-w, y(i) + o.size * fy, w * 2, o.size * fh); c.clip();
                        c.clearRect(-w, y(i) + o.size * fy, w * 2, o.size * fh);
                        c.fillStyle = o.color; c.fillText(t, k * dx, y(i));
                        c.restore();
                    });
                });
            }
        },
        {
            id: 'dymo', name: 'Etiquetadora', sample: 'COCINA', font: F.maquina,
            draw(c, L, o) {
                c.font = font(o);
                const sp = o.size * 0.15;
                const lh = o.size * 1.55, y = linesY(L.length, lh);
                L.map(t => t.toUpperCase()).forEach((t, i) => {
                    const w = spacedWidth(c, t, sp) + o.size * 1.0;
                    c.fillStyle = o.color;
                    roundRect(c, -w / 2, y(i) - o.size * 0.62, w, o.size * 1.24, o.size * 0.12);
                    c.fill();
                    c.fillStyle = 'rgba(255,255,255,0.12)';
                    c.fillRect(-w / 2, y(i) - o.size * 0.62, w, o.size * 0.3);
                    c.fillStyle = contrastText(o.color);
                    c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowOffsetY = Math.max(1, o.size * 0.03);
                    fillSpaced(c, t, 0, y(i) + o.size * 0.04, sp);
                    c.shadowColor = 'transparent';
                });
            }
        },
        {
            id: 'arco', name: 'Arco', sample: 'BUEN VIAJE', font: F.condensada,
            draw(c, L, o) {
                const text = L.join(' ').toUpperCase();
                c.font = font(o);
                const sp = o.size * 0.08;
                const total = spacedWidth(c, text, sp);
                const radius = Math.max(o.size * 2.2, total / 2.2);
                const angle = total / radius;
                c.fillStyle = o.color;
                c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = o.size * 0.1;
                let a = -Math.PI / 2 - angle / 2;
                const cy = radius * 0.75;
                Array.from(text).forEach(ch => {
                    const cw = c.measureText(ch).width;
                    a += (cw / 2) / radius;
                    c.save();
                    c.translate(Math.cos(a) * radius, cy + Math.sin(a) * radius);
                    c.rotate(a + Math.PI / 2);
                    c.fillText(ch, 0, 0);
                    c.restore();
                    a += (cw / 2 + sp) / radius;
                });
            }
        },
        {
            id: 'comic', name: 'Bocadillo', sample: '¡Hola!', font: F.comic,
            draw(c, L, o) {
                c.font = font(o);
                const lh = o.size * 1.1, y = linesY(L.length, lh);
                const maxW = Math.max(...L.map(t => c.measureText(t).width));
                const rx = maxW / 2 + o.size * 0.9, ry = (L.length * lh) / 2 + o.size * 0.6;
                c.fillStyle = '#ffffff'; c.strokeStyle = '#111111';
                c.lineWidth = Math.max(2, o.size * 0.07); c.lineJoin = 'round';
                c.beginPath();
                c.ellipse(0, 0, rx, ry, 0, Math.PI * 0.62, Math.PI * 0.45 + Math.PI * 2);
                c.lineTo(-rx * 0.55, ry + o.size * 0.9);
                c.closePath();
                c.fill(); c.stroke();
                c.fillStyle = luminance(o.color) > 0.85 ? '#111111' : o.color;
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'dorado', name: 'Dorado', sample: 'ORO', font: F.clasica,
            draw(c, L, o) {
                c.font = font(o, '700');
                const lh = o.size * 1.2, y = linesY(L.length, lh);
                const top = y(0) - o.size * 0.6, bottom = y(L.length - 1) + o.size * 0.6;
                const g = c.createLinearGradient(0, top, 0, bottom);
                g.addColorStop(0, '#fff6c9'); g.addColorStop(0.35, '#f2c94c');
                g.addColorStop(0.55, '#b8860b'); g.addColorStop(0.75, '#f7dd7a'); g.addColorStop(1, '#8a6212');
                L.forEach((t, i) => {
                    c.shadowColor = 'rgba(0,0,0,0.45)'; c.shadowBlur = o.size * 0.12; c.shadowOffsetY = o.size * 0.05;
                    c.fillStyle = g; c.fillText(t, 0, y(i));
                    c.shadowColor = 'transparent';
                    c.strokeStyle = '#6b4a08'; c.lineWidth = Math.max(1, o.size * 0.025);
                    c.strokeText(t, 0, y(i));
                });
            }
        },
        // ---------- NUEVOS (2) ----------
        {
            id: 'polaroid', name: 'Polaroid', sample: 'Verano 2026', font: F.mano,
            draw(c, L, o) {
                c.save();
                c.rotate(-0.05);
                c.font = font(o, '700', 'normal', 1.1);
                const tw = Math.max(...L.map(t => c.measureText(t).width));
                const hole = Math.max(tw + o.size * 1.5, o.size * 7);
                const pad = hole * 0.06;
                const lh = o.size * 1.15;
                const bottom = L.length * lh + o.size * 1.2;
                const W = hole + pad * 2, H = hole * 0.85 + pad + bottom;
                const x = -W / 2, y = -H / 2;
                c.shadowColor = 'rgba(0,0,0,0.35)'; c.shadowBlur = o.size * 0.5; c.shadowOffsetY = o.size * 0.15;
                c.fillStyle = '#fbfaf6';
                c.fillRect(x, y, W, H);
                c.shadowColor = 'transparent';
                // hueco para que se vea la foto
                c.globalCompositeOperation = 'destination-out';
                c.fillRect(x + pad, y + pad, hole, hole * 0.85);
                c.globalCompositeOperation = 'source-over';
                c.strokeStyle = 'rgba(0,0,0,0.08)'; c.lineWidth = 1;
                c.strokeRect(x + pad, y + pad, hole, hole * 0.85);
                // trozo de celo
                c.fillStyle = 'rgba(255,255,240,0.65)';
                c.save(); c.translate(0, y); c.rotate(0.06);
                c.fillRect(-o.size * 1.6, -o.size * 0.35, o.size * 3.2, o.size * 0.75);
                c.restore();
                c.fillStyle = luminance(o.color) > 0.75 ? '#2b2b2b' : o.color;
                const ty = y + pad + hole * 0.85 + (bottom - (L.length - 1) * lh) / 2;
                L.forEach((t, i) => c.fillText(t, 0, ty + i * lh));
                c.restore();
            }
        },
        {
            id: 'cine', name: 'Cine', sample: 'UNA PELÍCULA DE\nLA GRAN\nAVENTURA\nPRÓXIMAMENTE', font: F.condensada,
            draw(c, L, o) {
                const s = o.size;
                let top = '', bottom = '', title = L;
                if (L.length >= 3) { top = L[0]; bottom = L[L.length - 1]; title = L.slice(1, -1); }
                title = title.map(t => t.toUpperCase());
                c.font = `normal 400 ${s * 1.9}px ${o.font}`;
                const tlh = s * 1.75;
                const titleW = Math.max(...title.map(t => c.measureText(t).width));
                const titleH = title.length * tlh;
                let y = -titleH / 2 - (top ? s * 0.6 : 0);
                // texto pequeño de arriba
                if (top) {
                    c.font = `normal 600 ${s * 0.42}px ${F.moderna}`;
                    c.fillStyle = o.color;
                    fillSpaced(c, top.toUpperCase(), 0, y - s * 0.55, s * 0.18);
                }
                // título con brillo
                c.font = `normal 400 ${s * 1.9}px ${o.font}`;
                const g = c.createLinearGradient(0, y, 0, y + titleH);
                g.addColorStop(0, shade(o.color, 0.4)); g.addColorStop(0.55, o.color); g.addColorStop(1, shade(o.color, -0.35));
                c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = s * 0.35; c.shadowOffsetY = s * 0.08;
                c.fillStyle = g;
                title.forEach((t, i) => c.fillText(t, 0, y + tlh * (i + 0.5)));
                c.shadowColor = 'transparent';
                y += titleH;
                // estrellas
                c.fillStyle = '#f5c518';
                for (let k = -2; k <= 2; k++) star(c, k * s * 0.55, y + s * 0.45, s * 0.2);
                // texto de abajo entre líneas
                if (bottom) {
                    c.font = `normal 400 ${s * 0.75}px ${o.font}`;
                    const bw = spacedWidth(c, bottom.toUpperCase(), s * 0.2);
                    const by = y + s * 1.35;
                    c.fillStyle = o.color;
                    fillSpaced(c, bottom.toUpperCase(), 0, by, s * 0.2);
                    c.strokeStyle = o.color; c.lineWidth = Math.max(1, s * 0.04);
                    [[-bw / 2 - s * 0.3, -Math.max(bw, titleW) / 2], [bw / 2 + s * 0.3, Math.max(bw, titleW) / 2]].forEach(([a, b]) => {
                        c.beginPath(); c.moveTo(a, by); c.lineTo(b, by); c.stroke();
                    });
                }
            }
        },
        {
            id: 'pizarra', name: 'Pizarra', sample: 'Menú del día\nPaella', font: F.mano,
            draw(c, L, o) {
                c.font = font(o, '700', 'normal', 1.15);
                const lh = o.size * 1.3;
                const tw = Math.max(...L.map(t => c.measureText(t).width));
                const W = tw + o.size * 2.4, H = L.length * lh + o.size * 1.8;
                const fr = o.size * 0.35;
                // marco de madera
                c.shadowColor = 'rgba(0,0,0,0.4)'; c.shadowBlur = o.size * 0.4; c.shadowOffsetY = o.size * 0.1;
                c.fillStyle = '#8b5a2b';
                roundRect(c, -W / 2 - fr, -H / 2 - fr, W + fr * 2, H + fr * 2, o.size * 0.25); c.fill();
                c.shadowColor = 'transparent';
                c.fillStyle = '#a8713a';
                roundRect(c, -W / 2 - fr * 0.6, -H / 2 - fr * 0.6, W + fr * 1.2, H + fr * 1.2, o.size * 0.2); c.fill();
                // pizarra
                const g = c.createRadialGradient(0, 0, o.size, 0, 0, W);
                g.addColorStop(0, '#3a5a46'); g.addColorStop(1, '#22362a');
                c.fillStyle = g;
                c.fillRect(-W / 2, -H / 2, W, H);
                // texto de tiza (en una capa aparte para que los huecos no agujereen la pizarra)
                const off = document.createElement('canvas');
                off.width = c.canvas.width; off.height = c.canvas.height;
                const oc = off.getContext('2d');
                oc.setTransform(c.getTransform());
                oc.font = c.font; oc.textAlign = 'center'; oc.textBaseline = 'middle';
                const y = linesY(L.length, lh);
                oc.fillStyle = luminance(o.color) < 0.35 ? '#f4f1e8' : o.color;
                oc.globalAlpha = 0.92;
                L.forEach((t, i) => oc.fillText(t, 0, y(i)));
                oc.globalCompositeOperation = 'destination-out';
                let seed = 3; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
                const dot = Math.max(1, o.size * 0.045);
                for (let k = 0; k < 1400; k++) {
                    oc.globalAlpha = 0.3 + rnd() * 0.4;
                    oc.fillRect((rnd() - 0.5) * (tw + o.size), (rnd() - 0.5) * L.length * lh, dot, dot);
                }
                c.save();
                c.setTransform(1, 0, 0, 1, 0, 0);
                c.drawImage(off, 0, 0);
                c.restore();
            }
        },
        {
            id: 'confeti', name: 'Confeti', sample: '¡Felicidades!', font: F.cursiva,
            draw(c, L, o) {
                c.font = font(o, '400', 'normal', 1.2);
                const lh = o.size * 1.5, y = linesY(L.length, lh);
                const tw = Math.max(...L.map(t => c.measureText(t).width));
                const rx = tw / 2 + o.size * 1.4, ry = L.length * lh / 2 + o.size * 1.2;
                const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f1c'];
                let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
                for (let k = 0; k < 70; k++) {
                    const a = rnd() * Math.PI * 2, r = 0.55 + rnd() * 0.45;
                    const px = Math.cos(a) * rx * r, py = Math.sin(a) * ry * r;
                    c.fillStyle = colors[k % colors.length];
                    c.save(); c.translate(px, py); c.rotate(rnd() * Math.PI);
                    const kind = k % 3, sz = o.size * (0.12 + rnd() * 0.12);
                    if (kind === 0) c.fillRect(-sz, -sz * 0.4, sz * 2, sz * 0.8);
                    else if (kind === 1) { c.beginPath(); c.arc(0, 0, sz * 0.6, 0, Math.PI * 2); c.fill(); }
                    else star(c, 0, 0, sz);
                    c.restore();
                }
                c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = o.size * 0.15; c.shadowOffsetY = o.size * 0.06;
                c.lineJoin = 'round'; c.strokeStyle = '#ffffff'; c.lineWidth = o.size * 0.16;
                L.forEach((t, i) => c.strokeText(t, 0, y(i)));
                c.shadowColor = 'transparent';
                c.fillStyle = luminance(o.color) > 0.85 ? '#ff4d6d' : o.color;
                L.forEach((t, i) => c.fillText(t, 0, y(i)));
            }
        },
        {
            id: 'cumple', name: 'Cumpleaños', sample: '¡Feliz\ncumpleaños!', font: F.retro,
            draw(c, L, o) {
                c.font = font(o, '400', 'normal', 1.2);
                const lh = o.size * 1.35;
                const tw = Math.max(...L.map(t => c.measureText(t).width));
                const colors = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f1c'];
                const top = -(L.length * lh) / 2 - o.size * 1.3;
                // banderines
                const span = tw + o.size * 2.5, n = Math.max(5, Math.round(span / (o.size * 0.9)));
                c.strokeStyle = '#555'; c.lineWidth = Math.max(1, o.size * 0.03);
                c.beginPath(); c.moveTo(-span / 2, top); c.quadraticCurveTo(0, top + o.size * 0.5, span / 2, top); c.stroke();
                for (let k = 0; k < n; k++) {
                    const t = (k + 0.5) / n, x = -span / 2 + span * t;
                    const yy = top + o.size * 0.5 * 4 * t * (1 - t) * 0.5;
                    c.fillStyle = colors[k % colors.length];
                    c.beginPath(); c.moveTo(x - o.size * 0.3, yy); c.lineTo(x + o.size * 0.3, yy); c.lineTo(x, yy + o.size * 0.6); c.closePath(); c.fill();
                }
                // globos
                [[-1, '#ff4d6d'], [1, '#4cc9f0']].forEach(([side, col]) => {
                    const bx = side * (tw / 2 + o.size * 1.0), by = -o.size * 0.2;
                    c.strokeStyle = '#777'; c.lineWidth = Math.max(1, o.size * 0.025);
                    c.beginPath(); c.moveTo(bx, by + o.size * 0.75); c.quadraticCurveTo(bx + side * o.size * 0.3, by + o.size * 1.5, bx, by + o.size * 2.2); c.stroke();
                    c.fillStyle = col;
                    c.beginPath(); c.ellipse(bx, by, o.size * 0.55, o.size * 0.72, 0, 0, Math.PI * 2); c.fill();
                    c.fillStyle = 'rgba(255,255,255,0.45)';
                    c.beginPath(); c.ellipse(bx - o.size * 0.18, by - o.size * 0.25, o.size * 0.12, o.size * 0.2, -0.4, 0, Math.PI * 2); c.fill();
                });
                // texto: cada letra de un color
                const y = linesY(L.length, lh);
                c.shadowColor = 'rgba(0,0,0,0.3)'; c.shadowBlur = o.size * 0.12; c.shadowOffsetY = o.size * 0.05;
                let ci = 0;
                L.forEach((t, i) => {
                    const chars = Array.from(t);
                    let x = -c.measureText(t).width / 2;
                    const al = c.textAlign; c.textAlign = 'left';
                    chars.forEach(ch => {
                        c.fillStyle = ch.trim() ? colors[ci++ % colors.length] : 'transparent';
                        c.fillText(ch, x, y(i));
                        x += c.measureText(ch).width;
                    });
                    c.textAlign = al;
                });
            }
        },
        {
            id: 'sombralarga', name: 'Sombra larga', sample: 'HOLA', font: F.impacto,
            draw(c, L, o) {
                c.font = font(o, 'normal', 'normal', 1.2);
                const up = L.map(t => t.toUpperCase());
                const y = linesY(L.length, o.size * 1.35);
                const len = Math.round(o.size * 0.9);
                const step = Math.max(1, Math.round(len / 40));
                up.forEach((t, i) => {
                    for (let d = len; d > 0; d -= step) {
                        c.globalAlpha = 0.55 * (1 - d / len) + 0.05;
                        c.fillStyle = shade(o.color, -0.7);
                        c.fillText(t, d, y(i) + d);
                    }
                    c.globalAlpha = 1;
                    c.fillStyle = o.color;
                    c.fillText(t, 0, y(i));
                });
            }
        }
    ];
    const MAP = Object.fromEntries(STYLES.map(s => [s.id, s]));

    // Recorta los bordes transparentes de un canvas
    function trim(canvas, pad) {
        const c = canvas.getContext('2d');
        const { width: w, height: h } = canvas;
        const d = c.getImageData(0, 0, w, h).data;
        let x0 = w, y0 = h, x1 = -1, y1 = -1;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (d[(y * w + x) * 4 + 3] > 4) {
                    if (x < x0) x0 = x; if (x > x1) x1 = x;
                    if (y < y0) y0 = y; if (y > y1) y1 = y;
                }
            }
        }
        if (x1 < 0) { const e = document.createElement('canvas'); e.width = e.height = 1; return e; }
        x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
        x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
        const out = document.createElement('canvas');
        out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
        out.getContext('2d').drawImage(canvas, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
        return out;
    }

    // Dibuja el texto con el estilo y devuelve un canvas recortado
    function render(styleId, text, opts) {
        const st = MAP[styleId] || MAP.basico;
        const o = { size: opts.size, font: opts.font || st.font, color: opts.color || '#ffffff' };
        const L = (text || ' ').split('\n');
        const longest = Math.max(1, ...L.map(t => Array.from(t).length));
        // Lienzo amplio para que nada se corte; luego se recorta
        const W = Math.ceil(o.size * (longest * 1.6 + 10) + (styleId === 'arco' ? o.size * longest * 0.6 : 0));
        const H = Math.ceil(o.size * (Math.max(L.length * 2.2, styleId === 'vertical' ? longest * 1.1 : 0, styleId === 'polaroid' ? longest * 1.4 : 0) + 12));
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(W, 8000); canvas.height = Math.min(H, 8000);
        const c = canvas.getContext('2d');
        c.translate(canvas.width / 2, canvas.height / 2);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        st.draw(c, L, o);
        return trim(canvas, Math.ceil(o.size * 0.08) + 2);
    }

    // Espera a que estén cargadas las letras que usa el estilo
    function familiesOf(fontStack) { return (fontStack.match(/'([^']+)'/g) || []).map(s => s.replace(/'/g, '')); }
    const loading = {};
    async function ensureFonts(extra) {
        if (!document.fonts || !document.fonts.load) return;
        const fams = new Set(Object.values(F).flatMap(familiesOf));
        if (extra) familiesOf(extra).forEach(f => fams.add(f));
        const jobs = [];
        fams.forEach(f => {
            if (!loading[f]) {
                loading[f] = Promise.all([
                    document.fonts.load(`400 20px '${f}'`),
                    document.fonts.load(`700 20px '${f}'`),
                    document.fonts.load(`italic 400 20px '${f}'`)
                ]).catch(() => {});
            }
            jobs.push(loading[f]);   // esperar también si ya se estaba cargando
        });
        await Promise.all(jobs);
    }

    window.TextStyles = { list: STYLES, render, ensureFonts, fonts: FONT_OPTIONS, luminance };
})();
