// =====================================================================
// IA de Difuminar (MediaPipe). Todo se carga desde la propia carpeta de
// la app (todos los archivos juntos), así que funciona sin internet.
// =====================================================================

let imageSegmenter = null;
let faceLandmarker = null;
let aiInitPromise = null;

const AI_PATHS = {
    bundle: new URL('vision_bundle.js', document.baseURI).href,
    wasm: new URL('.', document.baseURI).href.replace(/\/$/, ''),
    segmenter: new URL('selfie_segmenter.tflite', document.baseURI).href,
    face: new URL('face_landmarker.task', document.baseURI).href
};

async function createWithFallback(Klass, fileset, options) {
    // Primero con la tarjeta gráfica (más rápido); si falla, con el procesador
    try {
        return await Klass.createFromOptions(fileset, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'GPU' }
        });
    } catch (e) {
        console.warn('GPU no disponible para la IA, usando CPU', e);
        return await Klass.createFromOptions(fileset, {
            ...options,
            baseOptions: { ...options.baseOptions, delegate: 'CPU' }
        });
    }
}

async function initAI() {
    if (imageSegmenter && faceLandmarker) return true;
    if (!aiInitPromise) {
        aiInitPromise = (async () => {
            const loadingText = document.getElementById('loading-text');
            if (loadingText) loadingText.textContent = "Preparando la IA...";

            const vision = await import(AI_PATHS.bundle);
            const fileset = await vision.FilesetResolver.forVisionTasks(AI_PATHS.wasm);

            if (loadingText) loadingText.textContent = "Cargando modelo de fondo...";
            imageSegmenter = await createWithFallback(vision.ImageSegmenter, fileset, {
                baseOptions: { modelAssetPath: AI_PATHS.segmenter },
                runningMode: "IMAGE",
                outputCategoryMask: false,
                outputConfidenceMasks: true
            });

            if (loadingText) loadingText.textContent = "Cargando modelo facial...";
            faceLandmarker = await createWithFallback(vision.FaceLandmarker, fileset, {
                baseOptions: { modelAssetPath: AI_PATHS.face },
                runningMode: "IMAGE",
                numFaces: 6
            });
            return true;
        })().catch(err => {
            console.error("Error iniciando la IA", err);
            aiInitPromise = null; // permitir reintentar la próxima vez
            imageSegmenter = null;
            faceLandmarker = null;
            return false;
        });
    }
    return aiInitPromise;
}

// Máscara de persona (0..1 por píxel). Comprobamos hacia qué lado viene la máscara
// usando la posición de la cara (o el centro de la foto) para no difuminar a la persona.
function getPersonMask(segmentationResult, w, h, faceCenter) {
    const masks = segmentationResult.confidenceMasks || [];
    if (!masks.length) return null;
    // En modelos de varias clases la última suele ser "persona"; en selfie hay una sola
    const mpMask = masks[masks.length - 1];
    const mask = mpMask.getAsFloat32Array();
    let values;
    const mw = mpMask.width || w, mh = mpMask.height || h;
    if (mw === w && mh === h) {
        values = new Float32Array(mask); // copia: la memoria original se libera
    } else {
        // Ajustar la máscara al tamaño de la foto
        values = new Float32Array(w * h);
        for (let y = 0; y < h; y++) {
            const sy = Math.min(mh - 1, Math.floor(y * mh / h));
            for (let x = 0; x < w; x++) {
                values[y * w + x] = mask[sy * mw + Math.min(mw - 1, Math.floor(x * mw / w))];
            }
        }
    }

    const sample = (cx, cy, r) => {
        let sum = 0, n = 0;
        for (let y = Math.max(0, cy - r); y < Math.min(h, cy + r); y += 2) {
            for (let x = Math.max(0, cx - r); x < Math.min(w, cx + r); x += 2) {
                sum += values[y * w + x]; n++;
            }
        }
        return n ? sum / n : 0.5;
    };

    let personScore;
    if (faceCenter) {
        personScore = sample(Math.round(faceCenter.x), Math.round(faceCenter.y), Math.max(4, Math.round(Math.min(w, h) * 0.03)));
    } else {
        const r = Math.max(4, Math.round(Math.min(w, h) * 0.05));
        const centre = sample(Math.round(w / 2), Math.round(h * 0.6), r);
        const corners = (sample(r, r, r) + sample(w - r, r, r)) / 2;
        personScore = centre >= corners ? 1 : 0;
    }
    if (personScore < 0.5) {
        for (let i = 0; i < values.length; i++) values[i] = 1 - values[i];
    }
    masks.forEach(m => m.close && m.close());

    // Si no hay una persona clara (casi nada o casi todo es "persona"), no difuminamos el fondo
    let personPixels = 0;
    for (let i = 0; i < values.length; i += 7) if (values[i] > 0.5) personPixels++;
    const fraction = personPixels / Math.ceil(values.length / 7);
    if (fraction < 0.02 || fraction > 0.97) return null;
    return values;
}

// Función principal que usa app.js. Devuelve true si se aplicó la IA.
window.runMagicCarnet = async function() {
    const mainCanvas = document.getElementById('main-canvas');
    if (!mainCanvas || mainCanvas.width === 0) return false;

    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    loadingOverlay.classList.remove('hidden');
    if (loadingText) loadingText.textContent = "Iniciando magia...";

    try {
        const ready = await initAI();
        if (!ready || !imageSegmenter || !faceLandmarker) return false;

        const w = mainCanvas.width;
        const h = mainCanvas.height;
        const ctx = mainCanvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, w, h);

        if (loadingText) loadingText.textContent = "Analizando rostro...";
        const faceResult = faceLandmarker.detect(mainCanvas);
        const landmarks = faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks[0];
        const faceCenter = landmarks ? { x: landmarks[1].x * w, y: landmarks[1].y * h } : null;

        if (loadingText) loadingText.textContent = "Separando el fondo...";
        const segmentationResult = imageSegmenter.segment(mainCanvas);
        const personMask = getPersonMask(segmentationResult, w, h, faceCenter);
        if (segmentationResult.close) segmentationResult.close();

        if (loadingText) loadingText.textContent = "Aplicando retoques mágicos...";
        await new Promise(r => setTimeout(r, 30));

        // 1. Fondo difuminado (la persona queda nítida, con bordes suaves)
        const blurPx = Math.max(8, Math.round(Math.max(w, h) / 90));
        const processCanvas = document.createElement('canvas');
        processCanvas.width = w;
        processCanvas.height = h;
        const pCtx = processCanvas.getContext('2d');
        pCtx.filter = `blur(${blurPx}px)`;
        pCtx.drawImage(mainCanvas, 0, 0);
        pCtx.filter = 'none';
        const blurredBg = pCtx.getImageData(0, 0, w, h).data;

        const newData = new Uint8ClampedArray(imgData.data);
        if (personMask) {
            for (let i = 0; i < personMask.length; i++) {
                const person = Math.min(1, Math.max(0, (personMask[i] - 0.15) / 0.7));
                const bg = 1 - person;
                if (bg <= 0) continue;
                const px = i * 4;
                newData[px] = newData[px] * person + blurredBg[px] * bg;
                newData[px + 1] = newData[px + 1] * person + blurredBg[px + 1] * bg;
                newData[px + 2] = newData[px + 2] * person + blurredBg[px + 2] * bg;
            }
        }
        const intermediateData = new ImageData(newData, w, h);
        pCtx.putImageData(intermediateData, 0, 0);

        // 2. Retoque de la cara
        if (landmarks) {
            const faceTemp = document.createElement('canvas');
            faceTemp.width = w; faceTemp.height = h;
            const fCtx = faceTemp.getContext('2d');
            const skinBlur = Math.max(2, Math.round(Math.max(w, h) / 450));
            fCtx.filter = `blur(${skinBlur}px) brightness(108%) saturate(105%)`;
            fCtx.drawImage(processCanvas, 0, 0);
            fCtx.filter = 'none';
            fCtx.globalCompositeOperation = 'soft-light';
            fCtx.fillStyle = 'rgba(255, 160, 80, 0.2)';
            fCtx.fillRect(0, 0, w, h);
            fCtx.globalCompositeOperation = 'source-over';
            const beautyData = fCtx.getImageData(0, 0, w, h).data;

            const feCanvas = document.createElement('canvas');
            feCanvas.width = w; feCanvas.height = h;
            const feCtx = feCanvas.getContext('2d');
            feCtx.filter = 'brightness(110%) contrast(112%) saturate(115%)';
            feCtx.drawImage(processCanvas, 0, 0);
            feCtx.filter = 'none';
            const featuresData = feCtx.getImageData(0, 0, w, h).data;

            const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
            const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
            const RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
            const LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];

            const drawPoly = (c, indices) => {
                c.beginPath();
                indices.forEach((idx, i) => {
                    const pt = landmarks[idx];
                    if (i === 0) c.moveTo(pt.x * w, pt.y * h);
                    else c.lineTo(pt.x * w, pt.y * h);
                });
                c.closePath();
                c.fill();
            };

            // Máscara de piel: óvalo de la cara sin ojos ni boca, con bordes suaves
            const rawFace = document.createElement('canvas');
            rawFace.width = w; rawFace.height = h;
            const rCtx = rawFace.getContext('2d');
            rCtx.fillStyle = 'white';
            drawPoly(rCtx, FACE_OVAL);
            rCtx.globalCompositeOperation = 'destination-out';
            drawPoly(rCtx, LEFT_EYE);
            drawPoly(rCtx, RIGHT_EYE);
            drawPoly(rCtx, LIPS);
            const softFace = document.createElement('canvas');
            softFace.width = w; softFace.height = h;
            const sCtx = softFace.getContext('2d');
            sCtx.filter = `blur(${Math.max(4, Math.round(Math.max(w, h) / 150))}px)`;
            sCtx.drawImage(rawFace, 0, 0);
            const faceMask = sCtx.getImageData(0, 0, w, h).data;

            // Máscara de ojos y labios
            const rawFeat = document.createElement('canvas');
            rawFeat.width = w; rawFeat.height = h;
            const rfCtx = rawFeat.getContext('2d');
            rfCtx.fillStyle = 'white';
            drawPoly(rfCtx, LEFT_EYE);
            drawPoly(rfCtx, RIGHT_EYE);
            drawPoly(rfCtx, LIPS);
            const softFeat = document.createElement('canvas');
            softFeat.width = w; softFeat.height = h;
            const sfCtx = softFeat.getContext('2d');
            sfCtx.filter = `blur(${Math.max(2, Math.round(Math.max(w, h) / 400))}px)`;
            sfCtx.drawImage(rawFeat, 0, 0);
            const featMask = sfCtx.getImageData(0, 0, w, h).data;

            const finalData = new Uint8ClampedArray(newData);
            for (let px = 0; px < finalData.length; px += 4) {
                const aFace = (faceMask[px + 3] / 255) * 0.75;
                if (aFace > 0) {
                    finalData[px] = finalData[px] * (1 - aFace) + beautyData[px] * aFace;
                    finalData[px + 1] = finalData[px + 1] * (1 - aFace) + beautyData[px + 1] * aFace;
                    finalData[px + 2] = finalData[px + 2] * (1 - aFace) + beautyData[px + 2] * aFace;
                }
                const aFeat = (featMask[px + 3] / 255) * 0.6;
                if (aFeat > 0) {
                    finalData[px] = finalData[px] * (1 - aFeat) + featuresData[px] * aFeat;
                    finalData[px + 1] = finalData[px + 1] * (1 - aFeat) + featuresData[px + 1] * aFeat;
                    finalData[px + 2] = finalData[px + 2] * (1 - aFeat) + featuresData[px + 2] * aFeat;
                }
            }
            ctx.putImageData(new ImageData(finalData, w, h), 0, 0);
        } else {
            ctx.putImageData(intermediateData, 0, 0);
        }

        if (window.triggerSaveState) window.triggerSaveState("Carnet Mágico");
        return true;
    } catch (err) {
        console.error("Error aplicando la IA", err);
        return false;
    } finally {
        loadingOverlay.classList.add('hidden');
        if (loadingText) loadingText.textContent = "Cargando...";
    }
};

// ---------------------------------------------------------------------
// Máscara de piel para "Piel Perfecta"
// Devuelve { mask: Float32Array (0..1 por píxel), faces: nº de caras } o null si la IA no carga.
// ---------------------------------------------------------------------
const SKIN_FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const SKIN_LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const SKIN_RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
const SKIN_LEFT_BROW = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
const SKIN_RIGHT_BROW = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276];
const SKIN_LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];

// ¿Parece piel por el color? (0..1) — funciona con pieles claras y oscuras
function skinLikeness(r, g, b) {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    if (y < 35 || y > 250) return 0;
    const dCr = cr < 133 ? (133 - cr) / 8 : cr > 180 ? (cr - 180) / 8 : 0;
    const dCb = cb < 75 ? (75 - cb) / 8 : cb > 130 ? (cb - 130) / 8 : 0;
    return Math.max(0, 1 - Math.max(dCr, dCb));
}
window.skinLikeness = skinLikeness;

window.detectSkinMask = async function(canvas) {
    const ready = await initAI();
    if (!ready || !faceLandmarker) return null;
    const w = canvas.width, h = canvas.height;
    const result = faceLandmarker.detect(canvas);
    const faces = (result && result.faceLandmarks) || [];
    if (!faces.length) return { mask: null, faces: 0 };

    const px = canvas.getContext('2d').getImageData(0, 0, w, h).data;
    const newCanvas = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const toYCC = (r, g, b) => [
        0.299 * r + 0.587 * g + 0.114 * b,
        128 - 0.168736 * r - 0.331264 * g + 0.5 * b,
        128 + 0.5 * r - 0.418688 * g - 0.081312 * b
    ];
    // Desenfoca una máscara (0..1) con el navegador para que no tenga bordes
    const blurMask = (m, radius) => {
        const c = newCanvas(), x = c.getContext('2d');
        const img = x.createImageData(w, h);
        for (let i = 0; i < m.length; i++) img.data[i * 4 + 3] = Math.round(m[i] * 255);
        x.putImageData(img, 0, 0);
        const c2 = newCanvas(), x2 = c2.getContext('2d');
        x2.filter = `blur(${Math.max(1, Math.round(radius))}px)`;
        x2.drawImage(c, 0, 0);
        const d = x2.getImageData(0, 0, w, h).data;
        const out = new Float32Array(w * h);
        for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] / 255;
        return out;
    };
    const readAlpha = (c, radius) => {
        let src = c;
        if (radius) {
            src = newCanvas();
            const x = src.getContext('2d');
            x.filter = `blur(${Math.max(1, Math.round(radius))}px)`;
            x.drawImage(c, 0, 0);
        }
        const d = src.getContext('2d').getImageData(0, 0, w, h).data;
        const out = new Float32Array(w * h);
        for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] / 255;
        return out;
    };

    const mask = new Float32Array(w * h);
    let sizeSum = 0;

    faces.forEach(lm => {
        let minX = 1, maxX = 0, minY = 1, maxY = 0;
        lm.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
        const bx = { x: minX * w, y: minY * h, w: (maxX - minX) * w, h: (maxY - minY) * h };
        sizeSum += bx.w;
        const poly = (ctx2, idx) => {
            ctx2.beginPath();
            idx.forEach((k, i) => { const p = lm[k]; i ? ctx2.lineTo(p.x * w, p.y * h) : ctx2.moveTo(p.x * w, p.y * h); });
            ctx2.closePath();
        };

        // Óvalo de la cara (bordes muy suaves) y huecos de ojos, cejas y boca (bordes suaves)
        const ovalC = newCanvas(), oc = ovalC.getContext('2d');
        oc.fillStyle = '#fff'; poly(oc, SKIN_FACE_OVAL); oc.fill();
        const holesC = newCanvas(), hc = holesC.getContext('2d');
        hc.fillStyle = '#fff'; hc.strokeStyle = '#fff'; hc.lineJoin = 'round';
        hc.lineWidth = Math.max(3, bx.w * 0.04);
        [SKIN_LEFT_EYE, SKIN_RIGHT_EYE, SKIN_LEFT_BROW, SKIN_RIGHT_BROW, SKIN_LIPS].forEach(part => { poly(hc, part); hc.fill(); hc.stroke(); });
        const ovalHard = readAlpha(ovalC, 0);
        const ovalSoft = readAlpha(ovalC, bx.w / 10);
        const holes = readAlpha(holesC, bx.w / 30);
        const holesHard = readAlpha(holesC, 0);

        // Tono medio de la piel de esta cara
        let sy = 0, scb = 0, scr = 0, n = 0;
        for (let y = Math.max(0, Math.floor(bx.y)); y < Math.min(h, bx.y + bx.h); y += 2) {
            for (let x = Math.max(0, Math.floor(bx.x)); x < Math.min(w, bx.x + bx.w); x += 2) {
                const i = y * w + x;
                if (ovalHard[i] < 0.9 || holesHard[i] > 0) continue;
                const j = i * 4, c = toYCC(px[j], px[j + 1], px[j + 2]);
                sy += c[0]; scb += c[1]; scr += c[2]; n++;
            }
        }
        if (!n) return;
        const my = sy / n, mcb = scb / n, mcr = scr / n;

        // Parecido de cada píxel con el tono de la cara (evita pelo, fondo, gafas, ropa)
        const x0 = Math.max(0, Math.floor(bx.x - bx.w * 0.6)), x1 = Math.min(w, Math.ceil(bx.x + bx.w * 1.6));
        const y0 = Math.max(0, Math.floor(bx.y - bx.h * 0.3)), y1 = Math.min(h, Math.ceil(bx.y + bx.h * 2.0));
        const tone = new Float32Array(w * h);
        const neck = new Float32Array(w * h);
        const cx = bx.x + bx.w / 2, cy = bx.y + bx.h * 0.8, rx = bx.w * 0.85, ry = bx.h * 1.1;
        for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
                const i = y * w + x, j = i * 4;
                const c = toYCC(px[j], px[j + 1], px[j + 2]);
                const dist = Math.hypot(c[1] - mcb, c[2] - mcr);
                const t = Math.max(0, Math.min(1, 1 - (dist - 7) / 12)) * Math.max(0, Math.min(1, 1 - (Math.abs(c[0] - my) - 50) / 45));
                tone[i] = t;
                // cuello y orejas (fuera de la cara, por debajo y a los lados)
                const er = Math.hypot((x - cx) / rx, (y - cy) / ry);
                if (er < 1 && y > bx.y + bx.h * 0.45) neck[i] = t * Math.min(1, (1 - er) / 0.35) * 0.8;
            }
        }
        const toneSoft = blurMask(tone, bx.w / 45);
        for (let i = 0; i < mask.length; i++) {
            const face = ovalSoft[i] * (1 - holes[i]) * (0.15 + 0.85 * toneSoft[i]);
            const v = Math.max(face, neck[i] * (1 - holes[i]));
            if (v > mask[i]) mask[i] = v;
        }
    });

    const avgFace = sizeSum / faces.length;
    // Último suavizado para que no se note ningún borde
    const finalMask = blurMask(mask, avgFace / 60);
    return { mask: finalMask, faces: faces.length, faceSize: avgFace };
};

// ---------------------------------------------------------------------
// Partes de la cara para "Dientes" y "Ojos"
// Devuelve una lista de caras con sus polígonos en píxeles, o null si la IA no carga.
// ---------------------------------------------------------------------
const PART_MOUTH_INNER = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];

window.detectFaceParts = async function(canvas) {
    const ready = await initAI();
    if (!ready || !faceLandmarker) return null;
    const w = canvas.width, h = canvas.height;
    const result = faceLandmarker.detect(canvas);
    const faces = (result && result.faceLandmarks) || [];
    const toPx = (lm, idx) => idx.map(k => ({ x: lm[k].x * w, y: lm[k].y * h }));
    return faces.map(lm => {
        const face = {
            mouth: toPx(lm, PART_MOUTH_INNER),
            leftEye: toPx(lm, SKIN_LEFT_EYE),
            rightEye: toPx(lm, SKIN_RIGHT_EYE),
            irises: []
        };
        if (lm.length >= 478) {
            [[468, 469, 470, 471, 472], [473, 474, 475, 476, 477]].forEach(([c, ...ring]) => {
                const cx = lm[c].x * w, cy = lm[c].y * h;
                const r = ring.reduce((a, k) => a + Math.hypot(lm[k].x * w - cx, lm[k].y * h - cy), 0) / ring.length;
                face.irises.push({ x: cx, y: cy, r });
            });
        }
        return face;
    });
};
