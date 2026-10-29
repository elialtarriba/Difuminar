// No static import

const DOM = {
    upload: document.getElementById('image-upload'),
    canvasContainer: document.getElementById('canvas-container'),
    mainCanvas: document.getElementById('main-canvas'),
    originalCanvas: document.getElementById('original-canvas'),
    placeholder: document.getElementById('placeholder-text'),
    
    // Sliders
    sBrightness: document.getElementById('adj-brightness'),
    sContrast: document.getElementById('adj-contrast'),
    sTemp: document.getElementById('adj-temperature'),
    vTemp: document.getElementById('val-temperature'),
    sBlackPoint: document.getElementById('adj-blackpoint'),
    vBlackPoint: document.getElementById('val-blackpoint'),
    sWhites: document.getElementById('adj-whites'),
    vWhites: document.getElementById('val-whites'),
    sClarity: document.getElementById('adj-clarity'),
    vClarity: document.getElementById('val-clarity'),
    sHaze: document.getElementById('adj-haze'),
    vHaze: document.getElementById('val-haze'),
    sBrushSize: document.getElementById('brush-size'),
    
    // Values displays
    vBrightness: document.getElementById('val-brightness'),
    vContrast: document.getElementById('val-contrast'),
    vBrushSize: document.getElementById('val-brush-size'),
    
    // Buttons
    btnCompare: document.getElementById('btn-compare'),
    btnCopy: document.getElementById('btn-copy'),
    btnSave: document.getElementById('btn-save'),
    btnExit: document.getElementById('btn-exit'),
    btnClone: document.getElementById('tool-clone'),
    btnManualBlur: document.getElementById('tool-manual-blur'),
    btnMagic: document.getElementById('tool-magic'),
    btnMagicSkin: document.getElementById('tool-magic-skin'),
    btnMagicTeeth: document.getElementById('tool-magic-teeth'),
    btnMagicEyes: document.getElementById('tool-magic-eyes'),
    btnCrop: document.getElementById('tool-crop'),
    btnCompress: document.getElementById('tool-compress'),
    btnPng: document.getElementById('tool-png'),
    btnPdf: document.getElementById('tool-pdf'),
    btnPdfDocs: document.getElementById('tool-pdf-docs'),
    btnPdfToWord: document.getElementById('tool-pdf-to-word'),
    btnText: document.getElementById('tool-text'),

    // Inputs ocultos
    pdfFileInput: document.getElementById('pdf-file-input'),
    pdfDocsInput: document.getElementById('pdf-docs-input'),
    pdfToWordInput: document.getElementById('pdf-to-word-input'),

    // Modal de formato
    formatModal: document.getElementById('format-modal'),
    formatModalDocx: document.getElementById('format-modal-docx'),
    formatModalCancel: document.getElementById('format-modal-cancel'),

    // Modal de confirmación
    confirmModal: document.getElementById('confirm-modal'),
    confirmModalTitle: document.getElementById('confirm-modal-title'),
    confirmModalText: document.getElementById('confirm-modal-text'),
    confirmModalYes: document.getElementById('confirm-modal-yes'),
    confirmModalNo: document.getElementById('confirm-modal-no'),

    // Paneles de configuración
    adjustmentsSettings: document.getElementById('adjustments-sliders-container'),
    brushSettings: document.getElementById('brush-settings'),
    cropSettings: document.getElementById('crop-settings'),
    textSettings: document.getElementById('text-settings'),
    magicSettings: document.getElementById('magic-tools-settings'),
    
    // Controles Magic Settings
    magicActiveTitle: document.getElementById('magic-active-title'),
    magicActiveIcon: document.getElementById('magic-active-icon'),
    adjMagicIntensity: document.getElementById('adj-magic-intensity'),
    valMagicIntensity: document.getElementById('val-magic-intensity'),
    btnCancelMagic: document.getElementById('btn-cancel-magic'),
    btnApplyMagic: document.getElementById('btn-apply-magic'),
    magicBrushSettings: document.getElementById('magic-brush-settings'),
    sMagicBrush: document.getElementById('s-magic-brush'),
    vMagicBrush: document.getElementById('val-magic-brush'),
    btnMagicClear: document.getElementById('btn-magic-clear'),
    
    // Controles de Texto
    textInput: document.getElementById('text-input'),
    textFont: document.getElementById('text-font'),
    textColor: document.getElementById('text-color'),
    textSize: document.getElementById('text-size'),
    textOpacity: document.getElementById('text-opacity'),
    valTextSize: document.getElementById('val-text-size'),
    valTextOpacity: document.getElementById('val-text-opacity'),
    textOverlay: document.getElementById('text-overlay-element'),
    btnApplyText: document.getElementById('btn-apply-text'),
    btnCancelText: document.getElementById('btn-cancel-text'),
    presetTextBtns: document.querySelectorAll('.preset-text-btn'),
    
    // UI Elements
    themeSelector: document.getElementById('theme-selector'),
    toolCursor: document.getElementById('tool-cursor'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    logoTitle: document.querySelector('.logo h1'),
    historyActions: document.getElementById('history-actions'),
    btnUndo: document.getElementById('btn-undo'),
    btnRedo: document.getElementById('btn-redo'),
    btnResetImg: document.getElementById('btn-reset-img'),
    btnSetCloneSource: document.getElementById('btn-set-clone-source'),
    modalReset: document.getElementById('reset-modal'),
    btnConfirmReset: document.getElementById('modal-btn-confirm'),
    btnCancelReset: document.getElementById('modal-btn-cancel'),
    
    // Crop Elements
    cropOverlay: document.getElementById('crop-overlay'),
    cropBox: document.getElementById('crop-box'),
    btnApplyCrop: document.getElementById('btn-apply-crop'),
    btnCancelCrop: document.getElementById('btn-cancel-crop'),
    
    // Export Settings
    exportFormat: document.getElementById('export-format'),
    exportQualityContainer: document.getElementById('export-quality-container'),
    exportQuality: document.getElementById('export-quality'),
    valExportQuality: document.getElementById('val-export-quality'),
    maskCanvas: document.getElementById('mask-canvas'),
    btnApplyEraser: document.getElementById('btn-apply-eraser'),
    btnApplyBlur: document.getElementById('btn-apply-blur'),
    btnCancelBrush: document.getElementById('btn-cancel-brush'),
    btnClearEraser: document.getElementById('btn-clear-eraser')
};

const ctx = DOM.mainCanvas.getContext('2d', { willReadFrequently: true });
const origCtx = DOM.originalCanvas.getContext('2d', { willReadFrequently: true });
const maskCtx = DOM.maskCanvas.getContext('2d', { willReadFrequently: true });

// Navigation & Tabs
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel-content');
const toolPanelsContainer = document.querySelector('.tool-panels');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cancel active tool if switching tabs
        if (typeof currentTool !== 'undefined' && currentTool !== null) {
            toggleTool(currentTool);
        }
        
        // Remove active class from all
        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        
        if (isActive) {
            // If it was already active, we just close the whole panel container
            toolPanelsContainer.classList.add('closed');
        } else {
            // Otherwise, open the panel container and activate the clicked tab
            toolPanelsContainer.classList.remove('closed');
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        }
    });
});

// Swipe down to close panels
let panelTouchStartY = 0;
let panelTouchStartScroll = 0;
toolPanelsContainer.addEventListener('touchstart', e => {
    panelTouchStartY = e.touches[0].clientY;
    panelTouchStartScroll = toolPanelsContainer.scrollTop;
}, {passive: true});

toolPanelsContainer.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const dy = touchEndY - panelTouchStartY;
    // Solo cerramos si el panel estaba arriba del todo y no se está usando un deslizador
    const onSlider = e.target && e.target.tagName === 'INPUT';
    if (dy > 60 && panelTouchStartScroll <= 0 && !onSlider) { // Deslizar hacia abajo
        if (typeof currentTool !== 'undefined' && currentTool !== null) {
            toggleTool(currentTool);
        }
        toolPanelsContainer.classList.add('closed');
        navItems.forEach(nav => nav.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
    }
});

// Horizontal Adjustments Toolbar Logic
document.querySelectorAll('.adj-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Find closest button in case icon is clicked
        const targetBtn = e.target.closest('.adj-btn');
        if (!targetBtn) return;
        
        // Remove active class from all buttons
        document.querySelectorAll('.adj-btn').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        
        // Hide all sliders
        [DOM.adjustmentsSettings, DOM.brushSettings, DOM.cropSettings, DOM.textSettings].forEach(el => {
            if (el) el.classList.add('hidden');
        });
        
        // Show target slider
        const targetId = targetBtn.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.classList.remove('hidden');
        }
    });
});

// App Reset (Home Button & Exit Button)
function resetApp() {
    if (hasImage) {
        showConfirmModal('Salir y borrar', '¿Seguro que quieres borrar la foto actual y volver al inicio?', () => location.reload());
    } else {
        location.reload();
    }
}
DOM.logoTitle.addEventListener('click', resetApp);
if (DOM.btnExit) {
    DOM.btnExit.addEventListener('click', resetApp);
}

// State
let img = new Image();
let originalImageData = null;
let currentImageData = null;
let hasImage = false;
let currentImageInfo = null;
let currentTool = null;

let isDrawing = false;
let lastPointerPos = null;
let cloneSource = null;

// History State
const MAX_HISTORY = 10;
let history = [];
let historyIndex = -1;

window.updateOriginalImageData = function() {
    const w = DOM.mainCanvas.width;
    const h = DOM.mainCanvas.height;
    originalImageData = ctx.getImageData(0, 0, w, h);
};

// Guarda en la foto base lo que se ve ahora en pantalla (incluidos los ajustes de los
// deslizadores) y pone los deslizadores a 0. Así los ajustes no se aplican dos veces.
function commitCanvas(actionName = "Edición") {
    window.updateOriginalImageData();
    resetAdjustments();
    saveState(actionName);
    applyAdjustments();
}

window.triggerSaveState = function(actionName = "Edición") {
    commitCanvas(actionName);
};

// Variables del recorte (antes no estaban declaradas y daban errores al mover el ratón)
let cropRect = { x: 0, y: 0, w: 0, h: 0 };
let isDraggingCrop = false;
let dragHandle = null;
let cropDragStart = { x: 0, y: 0 };

function saveState(actionName = "Ajustes") {
    if (!originalImageData) return;
    
    // If we are not at the end of the history, truncate the future
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    const copy = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );
    
    copy.actionName = actionName;
    history.push(copy);
    if (history.length > MAX_HISTORY) {
        history.shift();
    } else {
        historyIndex++;
    }
    updateHistoryUI();
}

function updateHistoryUI() {
    DOM.btnUndo.disabled = historyIndex <= 0;
    DOM.btnRedo.disabled = historyIndex >= history.length - 1;
    DOM.btnResetImg.disabled = !hasImage;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

// Mensaje breve en la parte de abajo (sustituye a los alert)
let toastTimer = null;
function showToast(message) {
    let el = document.getElementById('app-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'app-toast';
        el.className = 'app-toast';
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 2600);
}
window.showToast = showToast;

function restoreState(index) {
    const state = history[index];
    
    if (DOM.mainCanvas.width !== state.width || DOM.mainCanvas.height !== state.height) {
        DOM.mainCanvas.width = state.width;
        DOM.mainCanvas.height = state.height;
        DOM.maskCanvas.width = state.width;
        DOM.maskCanvas.height = state.height;
        // Also update info modal width/height if applicable
        if (currentImageInfo) {
            currentImageInfo.width = state.width;
            currentImageInfo.height = state.height;
        }
    }
    
    originalImageData = new ImageData(
        new Uint8ClampedArray(state.data),
        state.width,
        state.height
    );
    applyAdjustments();
    updateHistoryUI();
}

DOM.btnUndo.addEventListener('click', () => {
    if (historyIndex > 0) {
        playClickSound();
        historyIndex--;
        restoreState(historyIndex);
    }
});
DOM.btnRedo.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        playClickSound();
        historyIndex++;
        restoreState(historyIndex);
    }
});
DOM.btnResetImg.addEventListener('click', () => {
    if (hasImage) {
        playClickSound();
        DOM.modalReset.classList.add('active');
    }
});

DOM.btnCancelReset.addEventListener('click', () => {
    DOM.modalReset.classList.remove('active');
});

DOM.btnConfirmReset.addEventListener('click', () => {
    DOM.modalReset.classList.remove('active');
    
    // Restablecer deslizadores
    DOM.sBrightness.value = 0;
    DOM.sContrast.value = 0;
    DOM.sTemp.value = 0;
    DOM.sBlackPoint.value = 0;
    DOM.sWhites.value = 0;
    DOM.sClarity.value = 0;
    DOM.sHaze.value = 0;
    
    if (history.length > 0) {
        historyIndex = 0;
        restoreState(0);
        saveState("Imagen Original");
    } else {
        updateDisplayValues();
        applyAdjustments();
    }
});

// --- Image Loading ---

async function loadImage(url, file) {
    const tempImg = new Image();
    if (file) {
        currentImageInfo = {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            location: 'No disponible',
            author: 'No disponible'
        };
        try {
            if (window.exifr) {
                const exifData = await exifr.parse(file, {tiff: true, gps: true, exif: true});
                if (exifData) {
                    if (exifData.latitude !== undefined && exifData.longitude !== undefined) {
                        currentImageInfo.location = `${exifData.latitude.toFixed(4)}, ${exifData.longitude.toFixed(4)}`;
                    }
                    if (exifData.Artist || exifData.creator || exifData.Software) {
                        currentImageInfo.author = exifData.Artist || exifData.creator || exifData.Software;
                    }
                }
            }
        } catch (e) {
            console.log("Error parsing EXIF", e);
        }
    } else {
        currentImageInfo = { name: 'Desconocido', size: 'N/A', type: 'N/A', location: 'No disponible', author: 'No disponible' };
    }
    tempImg.crossOrigin = "Anonymous";
    tempImg.onload = () => {
        if (currentImageInfo) {
            currentImageInfo.width = tempImg.width;
            currentImageInfo.height = tempImg.height;
            currentImageInfo.ratio = (tempImg.width / tempImg.height).toFixed(2);
        }
        // Redimensionar imágenes enormes de móviles para no bloquear la IA ni la memoria
        const MAX_SIZE = 1920;
        let w = tempImg.width;
        let h = tempImg.height;
        
        if (w > MAX_SIZE || h > MAX_SIZE) {
            const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
            
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const tCtx = canvas.getContext('2d');
            tCtx.drawImage(tempImg, 0, 0, w, h);
            
            img = new Image();
            img.onload = finishLoading;
            img.src = canvas.toDataURL('image/jpeg', 0.9);
        } else {
            img = tempImg;
            finishLoading();
        }
    };
    tempImg.src = url;
}

async function finishLoading() {
    setupCanvases();
    DOM.placeholder.classList.add('hidden');
    DOM.canvasContainer.classList.add('has-image');
    hasImage = true;
    resetAdjustments();
    
    // Reset crop box
    DOM.cropOverlay.classList.add('hidden');
    if (currentTool === 'crop') toggleTool('crop');
    
    // Setup history
    originalImageData = ctx.getImageData(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);
    currentImageData = ctx.getImageData(0, 0, DOM.mainCanvas.width, DOM.mainCanvas.height);
    history = [];
    historyIndex = -1;
    // Activar botones de la cabecera (info, comparar, restablecer)
    document.querySelectorAll('.history-actions .history-btn').forEach(btn => btn.disabled = false);
    saveState("Imagen Cargada");
    
    DOM.btnCompare.classList.remove('hidden');
    
    applyAdjustments();
    
    // Ocultar el cargador en caso de que estuviera visible por alguna otra razón
    setTimeout(() => {
        DOM.loadingOverlay.classList.add('hidden');
    }, 50);
}

DOM.upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadImage(url, file);
    }
    // reset input so same file can be selected again
    e.target.value = ''; 
});

DOM.canvasContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.canvasContainer.style.borderColor = 'var(--accent-color)';
});
DOM.canvasContainer.addEventListener('dragleave', () => {
    DOM.canvasContainer.style.borderColor = '';
});
DOM.canvasContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.canvasContainer.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(URL.createObjectURL(file), file);
    }
});

function setupCanvases() {
    const w = img.width;
    const h = img.height;
    
    DOM.mainCanvas.width = w;
    DOM.mainCanvas.height = h;
    DOM.originalCanvas.width = w;
    DOM.originalCanvas.height = h;
    DOM.maskCanvas.width = w;
    DOM.maskCanvas.height = h;
    
    origCtx.drawImage(img, 0, 0);
    ctx.drawImage(img, 0, 0);
    originalImageData = origCtx.getImageData(0, 0, w, h);
    currentImageData = new ImageData(new Uint8ClampedArray(originalImageData.data), w, h);
}

// --- AI Processing ---
// --- Splash Screen ---
const splashScreen = document.getElementById('splash-screen');
if (splashScreen) {
    const hideSplash = function(e) {
        if (e) e.preventDefault(); // Prevent double firing if click follows touchstart
        splashScreen.style.opacity = '0';
        splashScreen.style.pointerEvents = 'none';
        setTimeout(() => splashScreen.classList.add('hidden'), 500);
    };
    splashScreen.addEventListener('click', hideSplash);
    splashScreen.addEventListener('touchstart', hideSplash, {passive: false});
}

// --- Image Processing (Filters) ---

function resetAdjustments() {
    DOM.sBrightness.value = 0;
    DOM.sContrast.value = 0;
    DOM.sTemp.value = 0;
    DOM.sBlackPoint.value = 0;
    DOM.sWhites.value = 0;
    DOM.sClarity.value = 0;
    DOM.sHaze.value = 0;
    
    updateDisplayValues();
}

function updateDisplayValues() {
    DOM.vBrightness.textContent = DOM.sBrightness.value;
    DOM.vContrast.textContent = DOM.sContrast.value;
    DOM.vTemp.textContent = DOM.sTemp.value;
    DOM.vBlackPoint.textContent = DOM.sBlackPoint.value;
    DOM.vBlackPoint.textContent = DOM.sBlackPoint.value;
    DOM.vWhites.textContent = DOM.sWhites.value;
    DOM.vClarity.textContent = DOM.sClarity.value;
    DOM.vHaze.textContent = DOM.sHaze.value;
    DOM.vBrushSize.textContent = DOM.sBrushSize.value + 'px';
}

function applyAdjustments() {
    if (!hasImage) return;
    
    const brightness = parseInt(DOM.sBrightness.value);
    const contrast = parseInt(DOM.sContrast.value);
    const temp = parseInt(DOM.sTemp.value);
    const blackPt = parseInt(DOM.sBlackPoint.value);
    const whitePt = parseInt(DOM.sWhites.value);
    const clarity = parseInt(DOM.sClarity.value);
    const haze = parseInt(DOM.sHaze.value);

    const outData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );
    const data = outData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

        r += brightness; g += brightness; b += brightness;

        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
        
        // Punto Negro y Blancos
        if (blackPt !== 0) {
            r = r - blackPt * ((255 - r) / 255);
            g = g - blackPt * ((255 - g) / 255);
            b = b - blackPt * ((255 - b) / 255);
        }
        if (whitePt !== 0) {
            r = r + whitePt * (r / 255);
            g = g + whitePt * (g / 255);
            b = b + whitePt * (b / 255);
        }

        // Temperatura
        r += temp;
        b -= temp;

        data[i] = r; data[i+1] = g; data[i+2] = b;
    }
    
    ctx.putImageData(outData, 0, 0);
    
    // Claridad y Neblina (post-procesado con ctx.filter y blend modes)
    if (clarity !== 0 || haze !== 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = ctx.canvas.width;
        tempCanvas.height = ctx.canvas.height;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.drawImage(ctx.canvas, 0, 0);

        // 1. Neblina (Haze/Dehaze)
        if (haze !== 0) {
            if (haze > 0) {
                // Dehaze: overlay increases contrast and saturation
                ctx.globalCompositeOperation = 'overlay';
                ctx.globalAlpha = haze / 100;
                ctx.drawImage(tempCanvas, 0, 0);
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1.0;
                tCtx.drawImage(ctx.canvas, 0, 0);
            } else {
                // Haze: white/grey semi-transparent layer
                ctx.fillStyle = `rgba(220, 225, 230, ${Math.abs(haze) / 100})`;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                tCtx.drawImage(ctx.canvas, 0, 0);
            }
        }

        // 2. Claridad
        if (clarity !== 0) {
            if (clarity > 0) {
                // Sharpen (via SVG filter)
                const amt = clarity / 25.0; 
                const matrix = `0 ${-amt} 0 ${-amt} ${1 + 4*amt} ${-amt} 0 ${-amt} 0`;
                const matrixEl = document.getElementById('sharpen-matrix');
                if (matrixEl) matrixEl.setAttribute('kernelMatrix', matrix);
                ctx.filter = 'url(#sharpen-filter)';
            } else {
                // Blur
                const bAmt = Math.abs(clarity) / 10;
                ctx.filter = `blur(${bAmt}px)`;
            }
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.filter = 'none';
        }
    }

    if (currentTool && currentTool.startsWith('magic-')) {
        const magicIntensity = parseInt(DOM.adjMagicIntensity.value);
        if (currentTool === 'magic-skin') {
            applySmartSkinSmoothing(ctx, magicIntensity);
        } else if (currentTool === 'magic-teeth') {
            applySmartWhiten(ctx, magicIntensity, 'teeth');
        } else if (currentTool === 'magic-eyes') {
            applySmartWhiten(ctx, magicIntensity, 'eyes');
        }
    }
}





// Se agrupan los cambios del deslizador en un solo dibujo por fotograma (más fluido en móvil)
let adjustFrame = null;
function scheduleAdjustments() {
    if (adjustFrame) return;
    adjustFrame = requestAnimationFrame(() => {
        adjustFrame = null;
        applyAdjustments();
    });
}

[DOM.sBrightness, DOM.sContrast, DOM.sTemp, DOM.sBlackPoint, DOM.sWhites, DOM.sClarity, DOM.sHaze].forEach(el => {
    if (el) el.addEventListener('input', () => { updateDisplayValues(); scheduleAdjustments(); });
});


// --- Manual Tools & Crop ---

function getImageVisualBounds() {
    const rect = DOM.mainCanvas.getBoundingClientRect();
    const canvasRatio = rect.width / rect.height;
    const imageRatio = DOM.mainCanvas.width / DOM.mainCanvas.height;
    
    let w = rect.width;
    let h = rect.height;
    let x = 0;
    let y = 0;
    
    if (imageRatio > canvasRatio) { // Image is wider
        h = rect.width / imageRatio;
        y = (rect.height - h) / 2;
    } else { // Image is taller
        w = rect.height * imageRatio;
        x = (rect.width - w) / 2;
    }
    
    return {
        left: rect.left + x,
        top: rect.top + y,
        width: w,
        height: h,
        renderScaleX: DOM.mainCanvas.width / w,
        renderScaleY: DOM.mainCanvas.height / h
    };
}

function getMousePos(evt) {
    const e = evt.touches && evt.touches.length > 0 ? evt.touches[0] : evt;
    const bounds = getImageVisualBounds();

    return {
        x: (e.clientX - bounds.left) * bounds.renderScaleX,
        y: (e.clientY - bounds.top) * bounds.renderScaleY,
        clientX: e.clientX,
        clientY: e.clientY,
        renderScaleX: bounds.renderScaleX
    };
}

DOM.btnClone.addEventListener('click', () => toggleTool('clone'));
    DOM.btnManualBlur.addEventListener('click', () => toggleTool('blur'));

    
    if (DOM.btnCompress) {
        DOM.btnCompress.addEventListener('click', () => {
            if (currentTool) toggleTool(currentTool);
        });
    }
    
    if (DOM.btnText) {
        DOM.btnText.addEventListener('click', () => {
            if (!hasImage) return;
            toggleTool('text');
        });
    }
    function applySmartSkinSmoothing(ctxTarget, intensity) {
        if (intensity <= 0) return;
        const w = ctxTarget.canvas.width;
        const h = ctxTarget.canvas.height;
        
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = w; blurCanvas.height = h;
        const bCtx = blurCanvas.getContext('2d');
        // Aumentar el blur para que alise más (w/150)
        bCtx.filter = `blur(${Math.max(3, w/150)}px)`;
        bCtx.drawImage(ctxTarget.canvas, 0, 0);
        bCtx.filter = 'none';

        const origData = ctxTarget.getImageData(0, 0, w, h);
        const blurData = bCtx.getImageData(0, 0, w, h);
        const outData = new ImageData(new Uint8ClampedArray(origData.data), w, h);
        const strength = intensity / 100;
        
        for (let i = 0; i < origData.data.length; i += 4) {
            const r1 = origData.data[i], g1 = origData.data[i+1], b1 = origData.data[i+2];
            const r2 = blurData.data[i], g2 = blurData.data[i+1], b2 = blurData.data[i+2];
            
            const l1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;
            const l2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
            const diff = Math.abs(l1 - l2);
            
            // Aumentar la tolerancia de bordes (diff/30) para que afecte a más piel
            let blurWeight = Math.max(0, 1 - (diff / 30)); 
            blurWeight *= (strength * 1.5); // Multiplicador para que llegue al 100% real de blur
            if (blurWeight > 1) blurWeight = 1;
            
            outData.data[i] = r1 * (1 - blurWeight) + r2 * blurWeight;
            outData.data[i+1] = g1 * (1 - blurWeight) + g2 * blurWeight;
            outData.data[i+2] = b1 * (1 - blurWeight) + b2 * blurWeight;
        }
        
        ctxTarget.putImageData(outData, 0, 0);
        
        // Ligero brillo global
        ctxTarget.globalCompositeOperation = 'soft-light';
        ctxTarget.globalAlpha = 0.15 * strength;
        ctxTarget.fillStyle = '#ffaa66';
        ctxTarget.fillRect(0, 0, w, h);
        ctxTarget.globalCompositeOperation = 'source-over';
        ctxTarget.globalAlpha = 1.0;
    }

    function applySmartWhiten(ctxTarget, intensity, type) {
        if (intensity <= 0) return;
        const w = ctxTarget.canvas.width;
        const h = ctxTarget.canvas.height;
        
        const imgData = ctxTarget.getImageData(0, 0, w, h);
        const data = imgData.data;
        const strength = (intensity / 100);
        // Obtenemos los datos de la máscara dibujada por el usuario
        const maskData = maskCtx.getImageData(0, 0, w, h).data;
            
        for (let i = 0; i < data.length; i += 4) {
            // Check if user painted here (alpha channel of mask > 0)
            const maskAlpha = maskData[i+3];
            if (maskAlpha === 0) continue; // Skip pixels not brushed
            
            const brushWeight = maskAlpha / 255.0; // Soft brush support
            
            let r = data[i], g = data[i+1], b = data[i+2];
            
            let targetWeight = strength * brushWeight;
            const boost = type === 'eyes' ? 0.7 : 0.8; 
            
            // Screen blend
            let dr = r + ((255 - r) * targetWeight * boost);
            let dg = g + ((255 - g) * targetWeight * boost);
            let db = b + ((255 - b) * targetWeight * boost);
            
            // Desaturate slightly to remove yellow/red tint
            const newL = 0.299 * dr + 0.587 * dg + 0.114 * db;
            dr = dr * (1 - targetWeight) + newL * targetWeight;
            dg = dg * (1 - targetWeight) + newL * targetWeight;
            db = db * (1 - targetWeight) + newL * targetWeight;
            
            data[i] = Math.min(255, dr);
            data[i+1] = Math.min(255, dg);
            data[i+2] = Math.min(255, db);
        }
        
        ctxTarget.putImageData(imgData, 0, 0);
    }

    // "Carnet Mágico": usa la IA (difumina el fondo y retoca la cara).
    // Si la IA no se puede cargar, aplica un retoque suave de piel como plan B.
    async function runMagic() {
        if (!hasImage) return;
        if (currentTool) toggleTool(currentTool);

        let done = false;
        if (typeof window.runMagicCarnet === 'function') {
            try {
                done = await window.runMagicCarnet();
            } catch (err) {
                console.error('Error en Carnet Mágico', err);
                done = false;
            }
        }

        if (!done) {
            DOM.loadingOverlay.classList.remove('hidden');
            DOM.loadingText.textContent = "Aplicando retoque...";
            await new Promise(r => setTimeout(r, 50));
            applySmartSkinSmoothing(ctx, 75);
            commitCanvas("Carnet Mágico (sin IA)");
            DOM.loadingOverlay.classList.add('hidden');
            DOM.loadingText.textContent = "Cargando...";
            showToast("La IA no está disponible: se ha aplicado solo el retoque de piel");
        } else {
            showToast("¡Magia aplicada!");
        }
    }

    if (DOM.btnMagic) DOM.btnMagic.addEventListener('click', () => runMagic());
    if (DOM.btnMagicSkin) DOM.btnMagicSkin.addEventListener('click', () => toggleTool('magic-skin'));
    if (DOM.btnMagicTeeth) DOM.btnMagicTeeth.addEventListener('click', () => toggleTool('magic-teeth'));
    if (DOM.btnMagicEyes) DOM.btnMagicEyes.addEventListener('click', () => toggleTool('magic-eyes'));

    if (DOM.btnCancelMagic) DOM.btnCancelMagic.addEventListener('click', () => {
        maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
        toggleTool(currentTool);
    });

    if (DOM.btnApplyMagic) DOM.btnApplyMagic.addEventListener('click', () => {
        const tool = currentTool;
        const intensity = parseInt(DOM.adjMagicIntensity.value) || 0;
        if (intensity > 0) {
            // Lo que se ve ahora (con el efecto) pasa a ser la foto base
            commitCanvas("Efecto " + DOM.magicActiveTitle.textContent);
        }
        maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
        toggleTool(tool);
    });
    
    if (DOM.adjMagicIntensity) {
        DOM.adjMagicIntensity.addEventListener('input', () => {
            DOM.valMagicIntensity.textContent = DOM.adjMagicIntensity.value;
            applyAdjustments();
        });
    }

    if (DOM.btnCrop) {
        DOM.btnCrop.addEventListener('click', () => toggleTool('crop'));
    }

    DOM.btnCancelCrop.addEventListener('click', () => {
    if(currentTool === 'crop') toggleTool('crop');
});
document.getElementById('btn-cancel-brush').addEventListener('click', () => {
    if(currentTool === 'clone' || currentTool === 'blur') toggleTool(currentTool);
});


function toggleTool(tool) {
    if (currentTool === tool) {
        currentTool = null;
        DOM.btnClone.classList.remove('active');
        DOM.btnManualBlur.classList.remove('active');
        DOM.btnCrop.classList.remove('active');
        if (DOM.btnText) DOM.btnText.classList.remove('active');
        if (DOM.btnMagicSkin) DOM.btnMagicSkin.classList.remove('active');
        if (DOM.btnMagicTeeth) DOM.btnMagicTeeth.classList.remove('active');
        if (DOM.btnMagicEyes) DOM.btnMagicEyes.classList.remove('active');
        DOM.brushSettings.classList.add('hidden');
        DOM.magicSettings.classList.add('hidden');
        DOM.cropSettings.classList.add('hidden');
        if (DOM.textSettings) DOM.textSettings.classList.add('hidden');
        if (DOM.textOverlay) DOM.textOverlay.classList.add('hidden');
        // Volver a mostrar los deslizadores de Ajustes (se ocultan al usar una herramienta)
        DOM.adjustmentsSettings.classList.remove('hidden');
        DOM.toolCursor.classList.add('hidden');
        DOM.cropOverlay.classList.add('hidden');
        DOM.mainCanvas.style.cursor = 'default';
        document.getElementById('tools-toolbar').style.display = 'flex';
        const bottomNav = document.querySelector('.bottom-nav');
        if(bottomNav) bottomNav.style.display = 'flex';
        // Force re-render without preview
        applyAdjustments();
    } else {
        currentTool = tool;
        DOM.btnClone.classList.toggle('active', tool === 'clone');
        DOM.btnManualBlur.classList.toggle('active', tool === 'blur');
        DOM.btnCrop.classList.toggle('active', tool === 'crop');
        if (DOM.btnText) DOM.btnText.classList.toggle('active', tool === 'text');
        
        const isMagic = tool.startsWith('magic-');
        if (DOM.btnMagicSkin) DOM.btnMagicSkin.classList.toggle('active', tool === 'magic-skin');
        if (DOM.btnMagicTeeth) DOM.btnMagicTeeth.classList.toggle('active', tool === 'magic-teeth');
        if (DOM.btnMagicEyes) DOM.btnMagicEyes.classList.toggle('active', tool === 'magic-eyes');
        
        // Mostrar panel correspondiente
        DOM.adjustmentsSettings.classList.toggle('hidden', tool !== null);
        DOM.brushSettings.classList.toggle('hidden', tool !== 'clone' && tool !== 'blur');
        DOM.cropSettings.classList.toggle('hidden', tool !== 'crop');
        if (DOM.textSettings) DOM.textSettings.classList.toggle('hidden', tool !== 'text');
        if (DOM.magicSettings) DOM.magicSettings.classList.toggle('hidden', !isMagic);
        if (DOM.textOverlay) DOM.textOverlay.classList.toggle('hidden', tool !== 'text');
        DOM.cropOverlay.classList.toggle('hidden', tool !== 'crop');
        
        document.getElementById('tools-toolbar').style.display = 'none';
        const bottomNav = document.querySelector('.bottom-nav');
        if(bottomNav) bottomNav.style.display = 'none';
        
        if (isMagic) {
            DOM.adjMagicIntensity.value = 0;
            DOM.valMagicIntensity.textContent = 0;
            
            if (tool === 'magic-skin') {
                DOM.magicActiveTitle.textContent = "Piel Perfecta";
                DOM.magicActiveIcon.className = "fas fa-smile";
                if (DOM.magicBrushSettings) DOM.magicBrushSettings.classList.add('hidden');
            } else if (tool === 'magic-teeth') {
                DOM.magicActiveTitle.textContent = "Blanquear Dientes";
                DOM.magicActiveIcon.className = "fas fa-tooth";
                if (DOM.magicBrushSettings) DOM.magicBrushSettings.classList.remove('hidden');
                maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
                DOM.maskCanvas.style.opacity = '0';
            } else if (tool === 'magic-eyes') {
                DOM.magicActiveTitle.textContent = "Ojos Brillantes";
                DOM.magicActiveIcon.className = "fas fa-eye";
                if (DOM.magicBrushSettings) DOM.magicBrushSettings.classList.remove('hidden');
                maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
                DOM.maskCanvas.style.opacity = '0';
            }
            applyAdjustments();
        }
        
        switch(tool) {
        case 'crop':
            if (DOM.cropSettings) DOM.cropSettings.classList.remove('hidden');
            if (DOM.cropOverlay) DOM.cropOverlay.classList.remove('hidden');
            break;
        case 'text':
            if (DOM.textSettings) DOM.textSettings.classList.remove('hidden');
            if (DOM.textOverlay) {
                // Mostrar la vista previa con el estilo actual, centrada en la foto
                updateTextPreview();
                requestAnimationFrame(() => {
                    const b = getImageVisualBounds();
                    const cont = DOM.canvasContainer.getBoundingClientRect();
                    DOM.textOverlay.style.left = (b.left - cont.left + b.width / 2 - DOM.textOverlay.offsetWidth / 2) + 'px';
                    DOM.textOverlay.style.top = (b.top - cont.top + b.height / 2 - DOM.textOverlay.offsetHeight / 2) + 'px';
                });
            }
            break;
    }
        
        if (tool === 'clone' || tool === 'blur') {
            // El borrado rellena la zona automáticamente; ya no hace falta fijar un origen
            if (DOM.btnSetCloneSource) DOM.btnSetCloneSource.classList.add('hidden');
            DOM.btnApplyEraser.classList.toggle('hidden', tool !== 'clone');
            DOM.btnApplyBlur.classList.toggle('hidden', tool !== 'blur');
        }
        
        DOM.cropSettings.classList.toggle('hidden', tool !== 'crop');
        
        const isBrushingTool = tool === 'clone' || tool === 'blur' || tool === 'magic-teeth' || tool === 'magic-eyes';
        DOM.mainCanvas.style.cursor = tool === 'crop' ? 'crosshair' : (isBrushingTool ? 'none' : 'default');
        DOM.toolCursor.classList.toggle('hidden', !isBrushingTool);
        updateCursorSize();
        
        // Hide overlay if switching away from text tool
        if (tool !== 'text' && DOM.textOverlay) {
            DOM.textOverlay.classList.add('hidden');
        }     
        if (tool === 'crop' && hasImage) initCropBox();
        else DOM.cropOverlay.classList.add('hidden');
        
        cloneSource = null;
    }
}

DOM.sBrushSize.addEventListener('input', () => {
    DOM.vBrushSize.textContent = DOM.sBrushSize.value + 'px';
    updateCursorSize();
});

if (DOM.sMagicBrush) {
    DOM.sMagicBrush.addEventListener('input', () => {
        DOM.vMagicBrush.textContent = DOM.sMagicBrush.value + 'px';
        updateCursorSize();
    });
}

if (DOM.btnMagicClear) {
    DOM.btnMagicClear.addEventListener('click', () => {
        maskCtx.clearRect(0, 0, maskCtx.canvas.width, maskCtx.canvas.height);
        applyAdjustments();
    });
}

function updateCursorSize() {
    const size = currentBrushSize();
    DOM.toolCursor.style.width = size + 'px';
    DOM.toolCursor.style.height = size + 'px';
}
updateCursorSize();

// Interaction for Brush Tools
DOM.mainCanvas.addEventListener('mousemove', handlePointerMove);
DOM.mainCanvas.addEventListener('touchmove', handlePointerMove, {passive: false});

DOM.mainCanvas.addEventListener('mousedown', handlePointerDown);
DOM.mainCanvas.addEventListener('touchstart', handlePointerDown, {passive: false});

window.addEventListener('mouseup', handlePointerUp);
window.addEventListener('touchend', handlePointerUp);

function isBrushTool(tool) {
    return tool === 'clone' || tool === 'blur' || tool === 'magic-teeth' || tool === 'magic-eyes';
}

function currentBrushSize() {
    if (currentTool === 'magic-teeth' || currentTool === 'magic-eyes') {
        return DOM.sMagicBrush ? parseInt(DOM.sMagicBrush.value) : 20;
    }
    return parseInt(DOM.sBrushSize.value);
}

function handlePointerMove(e) {
    if (!isBrushTool(currentTool) || !hasImage) return;
    if (e.type === 'touchmove') e.preventDefault(); // evitar que la página se mueva al pintar
    
    const size = currentBrushSize();
    const pt = e.touches && e.touches.length ? e.touches[0] : e;
    DOM.toolCursor.style.left = (pt.clientX - size/2) + 'px';
    DOM.toolCursor.style.top = (pt.clientY - size/2) + 'px';
    
    if (isDrawing) {
        const pos = getMousePos(e);
        applyTool(pos);
        lastPointerPos = pos;
    }
}

function handlePointerDown(e) {
    // Solo las herramientas de pincel dibujan sobre la foto
    if (!isBrushTool(currentTool) || !hasImage) return;
    if (e.type === 'touchstart') e.preventDefault();
    const pt = e.touches && e.touches.length ? e.touches[0] : e;
    const size = currentBrushSize();
    DOM.toolCursor.style.left = (pt.clientX - size/2) + 'px';
    DOM.toolCursor.style.top = (pt.clientY - size/2) + 'px';
    
    if (currentTool === 'magic-teeth' || currentTool === 'magic-eyes') {
        DOM.maskCanvas.style.opacity = '1';
    }
    
    const pos = getMousePos(e);
    isDrawing = true;
    lastPointerPos = pos;
    applyTool(pos);
}

function handlePointerUp() {
    if(isDrawing) {
        isDrawing = false;
        
        if (currentTool === 'magic-teeth' || currentTool === 'magic-eyes') {
            DOM.maskCanvas.style.opacity = '0';
        }
        
        // Update live preview for magic brushes after drawing stroke
        if (currentTool === 'magic-teeth' || currentTool === 'magic-eyes') {
            applyAdjustments();
        }
    }
    isDraggingCrop = false;
    dragHandle = null;
}

function applyTool(pos) {
    let size = parseInt(DOM.sBrushSize.value);
    if (currentTool === 'magic-teeth' || currentTool === 'magic-eyes') {
        size = DOM.sMagicBrush ? parseInt(DOM.sMagicBrush.value) : 20;
    }
    const actualSize = size * (pos.renderScaleX || 1);

    if (currentTool === 'clone' || currentTool === 'blur' || currentTool === 'magic-teeth' || currentTool === 'magic-eyes') { 
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
        maskCtx.lineWidth = actualSize;
        maskCtx.strokeStyle = 'rgba(255, 0, 0, 0.6)'; // Always red for mask
        
        // For magic brushes, we can just use composite over to build opacity
        maskCtx.globalCompositeOperation = 'source-over';
        
        maskCtx.beginPath();
        maskCtx.moveTo(lastPointerPos.x, lastPointerPos.y);
        maskCtx.lineTo(pos.x, pos.y);
        maskCtx.stroke();
        
        // We only trigger real-time preview for magic tools on mouseUp to save performance,
        // but we draw the mask path continuously here
    }
}

// --- CROP TOOL LOGIC ---

function initCropBox() {
    DOM.cropOverlay.classList.remove('hidden');
    const bounds = getImageVisualBounds();
    const padding = 20;
    
    // Scale padding to image coordinates
    const scaledPaddingX = padding * bounds.renderScaleX;
    const scaledPaddingY = padding * bounds.renderScaleY;
    
    cropRect = {
        x: scaledPaddingX,
        y: scaledPaddingY,
        w: DOM.mainCanvas.width - scaledPaddingX * 2,
        h: DOM.mainCanvas.height - scaledPaddingY * 2
    };
    enforceCropRatio();
    updateCropBoxUI();
}

function updateCropBoxUI() {
    const bounds = getImageVisualBounds();
    const contRect = DOM.canvasContainer.getBoundingClientRect();
    
    // Convert canvas coordinates back to screen pixels
    const visualW = cropRect.w / bounds.renderScaleX;
    const visualH = cropRect.h / bounds.renderScaleY;
    const visualX = cropRect.x / bounds.renderScaleX;
    const visualY = cropRect.y / bounds.renderScaleY;

    // Offset relative to canvasContainer
    const offsetX = bounds.left - contRect.left;
    const offsetY = bounds.top - contRect.top;

    DOM.cropBox.style.left = (offsetX + visualX) + 'px';
    DOM.cropBox.style.top = (offsetY + visualY) + 'px';
    DOM.cropBox.style.width = visualW + 'px';
    DOM.cropBox.style.height = visualH + 'px';
}

let currentCropRatio = 'free';

document.querySelectorAll('.crop-ratio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.crop-ratio-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentCropRatio = e.currentTarget.getAttribute('data-ratio');
        
        // When clicking a preset, we want to start from the maximum possible size for that ratio
        const bounds = getImageVisualBounds();
        const padding = 20;
        const scaledPaddingX = padding * bounds.renderScaleX;
        const scaledPaddingY = padding * bounds.renderScaleY;
        cropRect.w = DOM.mainCanvas.width - scaledPaddingX * 2;
        cropRect.h = DOM.mainCanvas.height - scaledPaddingY * 2;
        
        enforceCropRatio();
        
        // Recenter after applying ratio
        cropRect.x = (DOM.mainCanvas.width - cropRect.w) / 2;
        cropRect.y = (DOM.mainCanvas.height - cropRect.h) / 2;
        
        updateCropBoxUI();
    });
});

function enforceCropRatio() {
    if (currentCropRatio === 'free') return;
    const targetRatio = parseFloat(currentCropRatio);
    
    // adjust height based on width
    cropRect.h = cropRect.w / targetRatio;
    
    // ensure it fits in canvas
    if (cropRect.h > DOM.mainCanvas.height) {
        cropRect.h = DOM.mainCanvas.height;
        cropRect.w = cropRect.h * targetRatio;
    }
    if (cropRect.w > DOM.mainCanvas.width) {
        cropRect.w = DOM.mainCanvas.width;
        cropRect.h = cropRect.w / targetRatio;
    }
}

// Dragging Logic for Crop
function startCropDrag(e) {
    const evt = e.touches ? e.touches[0] : e;
    if (e.target && e.target.classList && e.target.classList.contains('crop-handle')) {
        dragHandle = Array.from(e.target.classList).find(c => c !== 'crop-handle');
    } else {
        dragHandle = 'box';
    }
    isDraggingCrop = true;
    cropDragStart = { x: evt.clientX, y: evt.clientY };
    if(e.stopPropagation) e.stopPropagation();
}

DOM.cropBox.addEventListener('mousedown', startCropDrag);
DOM.cropBox.addEventListener('touchstart', startCropDrag, {passive: false});

function moveCropDrag(e) {
    if (!isDraggingCrop || currentTool !== 'crop') return;
    if (e.type === 'touchmove') e.preventDefault(); // prevent scroll
    
    const evt = e.touches ? e.touches[0] : e;
    const bounds = getImageVisualBounds();
    
    const dx = (evt.clientX - cropDragStart.x) * bounds.renderScaleX;
    const dy = (evt.clientY - cropDragStart.y) * bounds.renderScaleY;
    cropDragStart = { x: evt.clientX, y: evt.clientY };
    
    const ratio = currentCropRatio;
    const keepRatio = ratio !== 'free';
    const targetRatio = keepRatio ? parseFloat(ratio) : null;

    if (dragHandle === 'box') {
        cropRect.x += dx;
        cropRect.y += dy;
    } else {
        if (dragHandle.includes('left')) {
            cropRect.x += dx; cropRect.w -= dx;
        }
        if (dragHandle.includes('right')) {
            cropRect.w += dx;
        }
        if (dragHandle.includes('top')) {
            cropRect.y += dy; cropRect.h -= dy;
        }
        if (dragHandle.includes('bottom')) {
            cropRect.h += dy;
        }
        
        // Enforce aspect ratio when resizing
        if (keepRatio) {
            if (dragHandle.includes('left') || dragHandle.includes('right')) {
                cropRect.h = cropRect.w / targetRatio;
            } else {
                cropRect.w = cropRect.h * targetRatio;
            }
        }
    }

    // Constraints (in image coordinates)
    if (cropRect.w < 50) cropRect.w = 50;
    if (cropRect.h < 50) cropRect.h = 50;
    if (cropRect.x < 0) cropRect.x = 0;
    if (cropRect.y < 0) cropRect.y = 0;
    if (cropRect.x + cropRect.w > DOM.mainCanvas.width) {
        if(dragHandle === 'box') cropRect.x = DOM.mainCanvas.width - cropRect.w;
        else cropRect.w = DOM.mainCanvas.width - cropRect.x;
    }
    if (cropRect.y + cropRect.h > DOM.mainCanvas.height) {
        if(dragHandle === 'box') cropRect.y = DOM.mainCanvas.height - cropRect.h;
        else cropRect.h = DOM.mainCanvas.height - cropRect.y;
    }

    updateCropBoxUI();
}

window.addEventListener('mousemove', moveCropDrag);
window.addEventListener('touchmove', moveCropDrag, {passive: false});


DOM.btnApplyCrop.addEventListener('click', async () => {
    if (!hasImage) return;
    
    // cropRect está en píxeles reales; redondeamos para no perder líneas al recortar
    const sX = Math.max(0, Math.round(cropRect.x));
    const sY = Math.max(0, Math.round(cropRect.y));
    const sW = Math.min(DOM.mainCanvas.width - sX, Math.round(cropRect.w));
    const sH = Math.min(DOM.mainCanvas.height - sY, Math.round(cropRect.h));
    if (sW < 1 || sH < 1) return;
    
    // 1. Recortar originalImageData (para no quemar los ajustes)
    const origCanvas = document.createElement('canvas');
    origCanvas.width = originalImageData.width;
    origCanvas.height = originalImageData.height;
    origCanvas.getContext('2d').putImageData(originalImageData, 0, 0);
    
    const croppedOrigCanvas = document.createElement('canvas');
    croppedOrigCanvas.width = sW;
    croppedOrigCanvas.height = sH;
    const coCtx = croppedOrigCanvas.getContext('2d');
    coCtx.drawImage(origCanvas, sX, sY, sW, sH, 0, 0, sW, sH);
    
    // 2. Recortar máscara (para no perder el historial de clonado/rejuvenecer)
    const tempMask = document.createElement('canvas');
    tempMask.width = sW;
    tempMask.height = sH;
    tempMask.getContext('2d').drawImage(DOM.maskCanvas, sX, sY, sW, sH, 0, 0, sW, sH);
    
    // 3. Ajustar tamaño de todos los canvas
    DOM.mainCanvas.width = sW;
    DOM.mainCanvas.height = sH;
    DOM.originalCanvas.width = sW;
    DOM.originalCanvas.height = sH;
    DOM.maskCanvas.width = sW;
    DOM.maskCanvas.height = sH;
    
    // 4. Restaurar máscara y guardar original
    maskCtx.drawImage(tempMask, 0, 0);
    originalImageData = coCtx.getImageData(0, 0, sW, sH);
    
    // 5. Guardar estado y aplicar
    saveState("Recortar");
    applyAdjustments();
    toggleTool('crop');
});

// --- Export Settings & Logic ---

DOM.exportFormat.addEventListener('change', () => {
    if (DOM.exportFormat.value === 'image/png') {
        DOM.exportQualityContainer.classList.add('hidden');
    } else {
        DOM.exportQualityContainer.classList.remove('hidden');
    }
});

DOM.exportQuality.addEventListener('input', () => {
    DOM.valExportQuality.textContent = DOM.exportQuality.value + '%';
});

// --- Theme Selector ---
DOM.themeSelector.addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.target.value);
});

// --- Export & Compare ---

function startCompare() {
    if(hasImage && currentTool !== 'crop') {
        DOM.mainCanvas.classList.add('hidden');
        DOM.originalCanvas.classList.remove('hidden');
    }
}
function stopCompare() {
    if(hasImage) {
        DOM.mainCanvas.classList.remove('hidden');
        DOM.originalCanvas.classList.add('hidden');
    }
}

DOM.btnCompare.addEventListener('mousedown', startCompare);
DOM.btnCompare.addEventListener('touchstart', startCompare, {passive: true});
DOM.btnCompare.addEventListener('mouseup', stopCompare);
DOM.btnCompare.addEventListener('touchend', stopCompare);
DOM.btnCompare.addEventListener('mouseleave', stopCompare);

// --- Guardar / Copiar ---

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('No se pudo crear la imagen')), type, quality);
    });
}

// Descarga un archivo. En iPhone/iPad abre el menú "Compartir" para poder "Guardar imagen"
// en Fotos o "Guardar en Archivos" (las descargas normales no funcionan bien en la app instalada).
async function deliverFile(blob, filename) {
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && navigator.canShare) {
        try {
            const file = new File([blob], filename, { type: blob.type });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: filename });
                return;
            }
        } catch (err) {
            if (err && err.name === 'AbortError') return; // el usuario cerró el menú
            console.warn('Compartir no disponible, se descarga', err);
        }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
}
window.deliverFile = deliverFile;

DOM.btnSave.addEventListener('click', async () => {
    if (!hasImage) return;
    
    const format = DOM.exportFormat.value;
    const quality = parseInt(DOM.exportQuality.value) / 100;
    
    let ext = 'png';
    if(format === 'image/jpeg') ext = 'jpg';
    if(format === 'image/webp') ext = 'webp';
    
    try {
        const blob = await canvasToBlob(DOM.mainCanvas, format, quality);
        await deliverFile(blob, `difuminar_edit.${ext}`);
    } catch (err) {
        console.error(err);
        showToast('No se ha podido guardar la imagen');
    }
});

DOM.btnCopy.addEventListener('click', async () => {
    if (!hasImage) return;
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
        showToast('Tu navegador no permite copiar imágenes');
        return;
    }
    try {
        // Safari exige crear el ClipboardItem en el mismo toque, con la imagen como promesa
        const item = new ClipboardItem({ 'image/png': canvasToBlob(DOM.mainCanvas, 'image/png') });
        await navigator.clipboard.write([item]);
        showToast('Imagen copiada al portapapeles');
    } catch (e) {
        console.error(e);
        showToast('No se ha podido copiar la imagen');
    }
});

if (DOM.btnCompress) {
    const confirmModal = document.getElementById('compress-confirm-modal');
    const successModal = document.getElementById('compress-success-modal');
    const btnCancel = document.getElementById('btn-cancel-compress');
    const btnConfirm = document.getElementById('btn-confirm-compress');
    const btnClose = document.getElementById('btn-close-compress');
    
    DOM.btnCompress.addEventListener('click', () => {
        if (!hasImage) return;
        confirmModal.classList.add('active');
    });
    
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            confirmModal.classList.remove('active');
        });
    }
    
    if (btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            
            // Target scale is roughly sqrt(0.8) to get 20% area reduction
            const scale = 0.8944;
            const oldW = DOM.mainCanvas.width;
            const oldH = DOM.mainCanvas.height;
            const newW = Math.max(1, Math.round(oldW * scale));
            const newH = Math.max(1, Math.round(oldH * scale));
            
            // 1. Create a canvas holding the original unadjusted image
            const origCanvas = document.createElement('canvas');
            origCanvas.width = oldW;
            origCanvas.height = oldH;
            origCanvas.getContext('2d').putImageData(originalImageData, 0, 0);
            
            // 2. Scale it down
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = newW;
            tempCanvas.height = newH;
            tempCanvas.getContext('2d').drawImage(origCanvas, 0, 0, newW, newH);
            
            // 3. Update the main canvases
            DOM.mainCanvas.width = newW;
            DOM.mainCanvas.height = newH;
            DOM.maskCanvas.width = newW;
            DOM.maskCanvas.height = newH;
            
            originalImageData = tempCanvas.getContext('2d').getImageData(0, 0, newW, newH);
            
            // 4. Reapply adjustments and save state
            applyAdjustments();
            saveState("Reducción de Peso");
            
            // 5. Estimate new file size
            const base64Data = DOM.mainCanvas.toDataURL('image/jpeg', 0.85); 
            const padding = (base64Data.endsWith("==") ? 2 : (base64Data.endsWith("=") ? 1 : 0));
            const estimatedBytes = (base64Data.length * (3/4)) - padding;
            const mbSize = (estimatedBytes / 1024 / 1024).toFixed(2);
            
            if (currentImageInfo) {
                currentImageInfo.size = mbSize + ' MB';
                currentImageInfo.width = newW;
                currentImageInfo.height = newH;
            }
            
            document.getElementById('new-compress-size').innerText = mbSize + ' MB';
            successModal.classList.add('active');
        });
    }
    
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }
}

function showConfirmModal(title, text, onConfirm) {
    if (!DOM.confirmModal) return;
    DOM.confirmModalTitle.textContent = title;
    DOM.confirmModalText.innerHTML = text; // allow HTML tags like <br>
    
    DOM.confirmModal.classList.add('active');
    
    const onYes = () => {
        DOM.confirmModal.classList.remove('active');
        cleanup();
        onConfirm();
    };
    
    const onNo = () => {
        DOM.confirmModal.classList.remove('active');
        cleanup();
    };
    
    const cleanup = () => {
        DOM.confirmModalYes.removeEventListener('click', onYes);
        DOM.confirmModalNo.removeEventListener('click', onNo);
    };
    
    DOM.confirmModalYes.addEventListener('click', onYes);
    DOM.confirmModalNo.addEventListener('click', onNo);
}

if (DOM.btnPng) {
    DOM.btnPng.addEventListener('click', () => {
        if (!hasImage) {
            showToast("No hay ninguna imagen cargada.");
            return;
        }
        showConfirmModal("Exportar PNG", "¿Quieres generar la imagen .png?", async () => {
            try {
                const blob = await canvasToBlob(DOM.mainCanvas, 'image/png');
                await deliverFile(blob, 'difuminar_hd.png');
            } catch (err) {
                console.error(err);
                showToast('No se ha podido crear el PNG');
            }
        });
    });
}

// --- INPAINTING LOGIC ---
DOM.btnClearEraser.addEventListener('click', () => {
    maskCtx.clearRect(0, 0, DOM.maskCanvas.width, DOM.maskCanvas.height);
});

DOM.btnApplyBlur.addEventListener('click', () => {
    const w = DOM.mainCanvas.width;
    const h = DOM.mainCanvas.height;
    if(w === 0 || h === 0) return;
    
    DOM.loadingOverlay.classList.remove('hidden');
    DOM.loadingText.textContent = "Difuminando...";
    
    setTimeout(() => {
        applyManualBlur(w, h);
        DOM.loadingOverlay.classList.add('hidden');
    }, 50);
});

function applyManualBlur(w, h) {
    const blurAmt = 15; // fixed amount or could use a slider
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w; tempCanvas.height = h;
    const tCtx = tempCanvas.getContext('2d');
    
    // Blur the original canvas
    tCtx.filter = `blur(${blurAmt}px)`;
    tCtx.drawImage(ctx.canvas, 0, 0);
    
    const blurredData = tCtx.getImageData(0, 0, w, h);
    const mainImgData = ctx.getImageData(0, 0, w, h);
    const maskImgData = maskCtx.getImageData(0, 0, w, h);

    let painted = false;
    for (let i = 3; i < maskImgData.data.length; i += 4) {
        if (maskImgData.data[i] > 0) { painted = true; break; }
    }
    if (!painted) {
        showToast("Primero pinta la zona que quieres difuminar");
        return;
    }
    
    for(let i=0; i<w*h; i++) {
        // maskData is drawn in rgba(0, 100, 255, 0.6) so alpha > 0 means drawn
        const alpha = maskImgData.data[i*4 + 3];
        if (alpha > 0) {
            const blend = alpha / 255.0;
            const px = i * 4;
            mainImgData.data[px] = mainImgData.data[px]*(1-blend) + blurredData.data[px]*blend;
            mainImgData.data[px+1] = mainImgData.data[px+1]*(1-blend) + blurredData.data[px+1]*blend;
            mainImgData.data[px+2] = mainImgData.data[px+2]*(1-blend) + blurredData.data[px+2]*blend;
        }
    }
    
    ctx.putImageData(mainImgData, 0, 0);
    maskCtx.clearRect(0, 0, w, h);
    commitCanvas("Difuminado Manual");
}



DOM.btnApplyEraser.addEventListener('click', () => {
    const w = DOM.mainCanvas.width;
    const h = DOM.mainCanvas.height;
    if(w === 0 || h === 0) return;
    
    DOM.loadingOverlay.classList.remove('hidden');
    DOM.loadingText.textContent = "Borrando mágicamente...";
    
    setTimeout(() => {
        applyInpainting(w, h);
        DOM.loadingOverlay.classList.add('hidden');
    }, 50);
});

function applyInpainting(w, h) {
    const maskImgData = maskCtx.getImageData(0, 0, w, h);
    const mainImgData = ctx.getImageData(0, 0, w, h);
    const maskData = maskImgData.data;
    const data = mainImgData.data;
    
    let toFill = [];
    let m = new Uint8Array(w * h);
    for(let i=0; i<w*h; i++) {
        if(maskData[i*4 + 3] > 50) { 
            m[i] = 1;
            toFill.push(i);
        }
    }
    
    if(toFill.length === 0) {
        showToast("Primero pinta sobre lo que quieres borrar");
        return;
    }
    
    const neighbors = [-1, 1, -w, w, -w-1, -w+1, w-1, w+1];
    const tempData = new Uint8ClampedArray(data);
    
    // Onion-peeling inpaint
    for(let pass=0; pass < 80; pass++) {
        let changed = false;
        let borderPixels = [];
        for(let i=0; i<toFill.length; i++) {
            let idx = toFill[i];
            if(m[idx] === 0) continue;
            
            let r=0, g=0, b=0, count=0;
            for(let d of neighbors) {
                let nIdx = idx + d;
                if(nIdx >= 0 && nIdx < w*h && m[nIdx] === 0) {
                    if(Math.abs((nIdx%w) - (idx%w)) <= 1) {
                        r += data[nIdx*4];
                        g += data[nIdx*4+1];
                        b += data[nIdx*4+2];
                        count++;
                    }
                }
            }
            if (count > 0) {
                tempData[idx*4] = r/count;
                tempData[idx*4+1] = g/count;
                tempData[idx*4+2] = b/count;
                borderPixels.push(idx);
                changed = true;
            }
        }
        
        for(let idx of borderPixels) {
            data[idx*4] = tempData[idx*4];
            data[idx*4+1] = tempData[idx*4+1];
            data[idx*4+2] = tempData[idx*4+2];
            m[idx] = 0;
        }
        
        if(!changed) break;
    }
    
    // Smoothing pass
    for(let pass=0; pass<3; pass++) {
        for(let i=0; i<toFill.length; i++) {
            let idx = toFill[i];
            let r=0, g=0, b=0, count=0;
            for(let d of neighbors) {
                let nIdx = idx + d;
                if(nIdx >= 0 && nIdx < w*h && Math.abs((nIdx%w) - (idx%w)) <= 1) {
                    r += data[nIdx*4];
                    g += data[nIdx*4+1];
                    b += data[nIdx*4+2];
                    count++;
                }
            }
            if (count > 0) {
                tempData[idx*4] = r/count;
                tempData[idx*4+1] = g/count;
                tempData[idx*4+2] = b/count;
            }
        }
        for(let i=0; i<toFill.length; i++) {
            let idx = toFill[i];
            data[idx*4] = tempData[idx*4];
            data[idx*4+1] = tempData[idx*4+1];
            data[idx*4+2] = tempData[idx*4+2];
        }
    }

    ctx.putImageData(mainImgData, 0, 0);
    maskCtx.clearRect(0, 0, w, h);
    commitCanvas("Borrar Objetos");
}

// Info Modal Logic
const btnInfo = document.getElementById('btn-info');
const btnCloseInfo = document.getElementById('btn-close-info');
const infoModal = document.getElementById('info-modal');
const infoDetails = document.getElementById('info-details');

if (btnInfo && btnCloseInfo && infoModal && infoDetails) {
    btnInfo.addEventListener('click', () => {
        if (!currentImageInfo) return;
        
        infoDetails.innerHTML = `
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Nombre:</strong> ${currentImageInfo.name}</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Tamaño:</strong> ${currentImageInfo.size}</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Tipo:</strong> ${currentImageInfo.type}</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Dimensiones Originales:</strong> ${currentImageInfo.width} x ${currentImageInfo.height} px</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Proporción (Aspect Ratio):</strong> ${currentImageInfo.ratio}</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Autor/Origen:</strong> ${currentImageInfo.author}</div>
            <div style="margin-bottom: 8px;"><strong style="color:var(--text-main);">Ubicación:</strong> ${currentImageInfo.location}</div>
        `;
        
        infoModal.classList.add('active');
    });
    
    btnCloseInfo.addEventListener('click', () => {
        infoModal.classList.remove('active');
    });
}


// History Modal Logic
const toolHistoryBtn = document.getElementById('tool-history');
const historyModal = document.getElementById('history-modal');
const btnCloseHistory = document.getElementById('btn-close-history');
const historyList = document.getElementById('history-list');

if (toolHistoryBtn && historyModal) {
    toolHistoryBtn.addEventListener('click', () => {
        if (!hasImage) return;
        historyList.innerHTML = '';
        
        history.forEach((state, i) => {
            const item = document.createElement('div');
            item.style.padding = '12px 15px';
            item.style.borderRadius = '10px';
            item.style.cursor = 'pointer';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.background = i === historyIndex ? 'rgba(var(--accent-rgb, 255,100,100), 0.1)' : 'rgba(0,0,0,0.03)';
            item.style.border = i === historyIndex ? '1px solid var(--accent-color)' : '1px solid transparent';
            
            item.innerHTML = `
                <span style="font-weight: 500; color: ${i === historyIndex ? 'var(--accent-color)' : 'var(--text-main)'}">${i + 1}. ${state.actionName || 'Edición'}</span>
                ${i === historyIndex ? '<i class="fas fa-check-circle" style="color: var(--accent-color)"></i>' : ''}
            `;
            
            item.addEventListener('click', () => {
                // Restore state and truncate history
                historyIndex = i;
                history = history.slice(0, historyIndex + 1);
                restoreState(historyIndex);
                historyModal.classList.remove('active');
                
                // Show a nice temporary toast or just silently succeed
            });
            
            historyList.appendChild(item);
        });
        
        historyModal.classList.add('active');
    });
    
    if (btnCloseHistory) {
        btnCloseHistory.addEventListener('click', () => {
            historyModal.classList.remove('active');
        });
    }
}

// --- Herramienta de Texto ---
let textIsDragging = false;
let textStartX, textStartY, textInitialX, textInitialY;

let currentTextStyle = 'basico';

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function updateTextPreview() {
    if (!DOM.textOverlay) return;
    const rawText = DOM.textInput.value || "Texto de ejemplo";
    const text = escapeHtml(rawText);
    const size = DOM.textSize.value;
    const font = DOM.textFont.value;
    const color = DOM.textColor.value;
    const opacity = DOM.textOpacity.value / 100;
    
    const contentDiv = document.getElementById('text-overlay-content');
    if (!contentDiv) return;
    
    // Base styles
    contentDiv.style.fontSize = `${size}px`;
    contentDiv.style.fontFamily = font;
    contentDiv.style.color = color;
    contentDiv.style.opacity = opacity;
    contentDiv.style.position = 'relative';
    // Limpiar restos del estilo anterior (sombras, contornos, giros...)
    contentDiv.style.textShadow = 'none';
    contentDiv.style.webkitTextStroke = '0';
    contentDiv.style.filter = 'none';
    contentDiv.style.transform = 'none';
    contentDiv.style.fontStyle = 'normal';
    contentDiv.style.fontWeight = 'normal';
    
    // Decorative rendering
    if (currentTextStyle === 'basico') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        contentDiv.style.border = 'none';
        contentDiv.style.borderRadius = '0';
        contentDiv.style.padding = '0';
    } 
    else if (currentTextStyle === 'bloque') {
        const lines = text.split('\n');
        let html = '';
        lines.forEach(line => {
            html += `<div style="line-height:0.85; text-transform:uppercase;">${line}</div>`;
        });
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.borderRadius = '0';
        contentDiv.style.padding = '0';
    }
    else if (currentTextStyle === 'cursiva') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        contentDiv.style.border = 'none';
        contentDiv.style.borderRadius = '0';
        contentDiv.style.padding = '0';
        contentDiv.style.fontFamily = "'Brush Script MT', cursive";
    }
    else if (currentTextStyle === 'accion') {
        const lines = text.split('\n');
        let html = `<div style="border-top:${Math.max(2, size/10)}px solid ${color}; border-bottom:${Math.max(2, size/10)}px solid ${color}; padding:${size/5}px 0; transform:skewX(-10deg);">`;
        lines.forEach(line => {
            html += `<div style="line-height:1; font-style:italic; text-transform:uppercase;">${line}</div>`;
        });
        html += `</div>`;
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.borderRadius = '0';
        contentDiv.style.padding = '0';
    }
    else if (currentTextStyle === 'poster') {
        const lines = text.split('\n');
        let html = `<div style="border:${Math.max(3, size/10)}px solid ${color}; padding:${size}px ${size*1.5}px; display:flex; flex-direction:column; align-items:center; text-align:center;">`;
        html += `<i class="fas fa-star" style="font-size:${size*0.8}px; color:${color}; margin-bottom:${size/2}px;"></i>`;
        
        lines.forEach((line, i) => {
            if (i === 0) { // SPEND
                html += `<div style="font-family:Arial,sans-serif; font-weight:bold; font-size:${size*0.8}px; letter-spacing:${size/2}px; text-transform:uppercase; margin-left:${size/2}px;">${line}</div>`;
            } else if (i === 1) { // TIME WITH
                html += `<div style="font-family:Impact,sans-serif; font-size:${size*1.2}px; text-transform:uppercase; margin-top:${size/5}px;">${line}</div>`;
            } else if (i === 2) { // the people
                html += `<div style="display:flex; align-items:center; gap:${size/2}px; margin:${size/2}px 0;">
                            <div style="flex:1; height:1px; border-top:2px solid ${color}; border-bottom:2px solid ${color}; width:${size*2}px; height:${Math.max(3, size/8)}px;"></div>
                            <div style="font-family:'Georgia',serif; font-style:italic; font-size:${size*0.9}px; white-space:nowrap;">${line}</div>
                            <div style="flex:1; height:1px; border-top:2px solid ${color}; border-bottom:2px solid ${color}; width:${size*2}px; height:${Math.max(3, size/8)}px;"></div>
                        </div>`;
            } else if (i === 3) { // WHO MAKES
                html += `<div style="background:${color}; color:black; font-family:Arial,sans-serif; font-weight:bold; font-size:${size*0.6}px; padding:${size/4}px ${size}px; text-transform:uppercase;">${line}</div>`;
            } else { // you happy.
                html += `<div style="font-family:'Brush Script MT',cursive; font-size:${size*1.3}px; margin-top:${size/4}px;">${line}</div>`;
            }
        });
        
        html += `</div>`;
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.borderRadius = '0';
        contentDiv.style.padding = '0';
    }
    else if (currentTextStyle === 'neon') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        contentDiv.style.fontFamily = "'Courier New', monospace";
        contentDiv.style.fontWeight = 'bold';
        contentDiv.style.color = '#fff';
        contentDiv.style.textShadow = `0 0 ${size/6}px ${color}, 0 0 ${size/3}px ${color}, 0 0 ${size*0.8}px ${color}`;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'burbuja') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        contentDiv.style.fontFamily = "Arial, sans-serif";
        contentDiv.style.fontWeight = '900';
        contentDiv.style.color = color;
        contentDiv.style.webkitTextStroke = `${Math.max(2, size/10)}px white`;
        contentDiv.style.filter = `drop-shadow(0 ${Math.max(2, size/15)}px ${Math.max(2, size/15)}px rgba(0,0,0,0.3))`;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'sombra3d') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>').toUpperCase();
        contentDiv.style.fontFamily = "Impact, sans-serif";
        contentDiv.style.color = color;
        const shadowOffset = Math.max(2, size/8);
        contentDiv.style.textShadow = `${shadowOffset}px ${shadowOffset}px 0px black`;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'elegante') {
        const lines = text.split('\n');
        let html = `<div style="border-top:1px solid ${color}; border-bottom:1px solid ${color}; padding:${size/4}px 0;">`;
        lines.forEach(line => {
            html += `<div style="font-family:'Georgia',serif; letter-spacing:${size/3}px; text-transform:uppercase; margin-right:-${size/3}px;">${line}</div>`;
        });
        html += `</div>`;
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'cita') {
        contentDiv.innerHTML = `
            <div style="position:relative; display:inline-block; padding:${size/2}px ${size}px;">
                <span style="font-family:'Georgia',serif; font-size:${size*3}px; position:absolute; top:-${size/2}px; left:0; opacity:0.3; color:${color}; line-height:1;">"</span>
                <span style="font-family:'Georgia',serif; font-style:italic;">${text.replace(/\n/g, '<br>')}</span>
                <span style="font-family:'Georgia',serif; font-size:${size*3}px; position:absolute; bottom:-${size}px; right:0; opacity:0.3; color:${color}; line-height:1;">"</span>
            </div>
        `;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'minimalista') {
        contentDiv.innerHTML = `
            <div style="border: 1px solid ${color}; padding: ${size/2}px ${size}px; display:inline-block;">
                <span style="font-family:Arial,sans-serif; letter-spacing:${size/3}px; text-transform:uppercase; margin-right:-${size/3}px;">${text.replace(/\n/g, '<br>')}</span>
            </div>
        `;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'sello') {
        contentDiv.innerHTML = `
            <div style="border: ${Math.max(2, size/10)}px double ${color}; border-radius: 50%; padding: ${size}px; display:flex; justify-content:center; align-items:center; text-align:center;">
                <span style="font-family:'Times New Roman',serif; font-weight:bold; text-transform:uppercase;">${text.replace(/\n/g, '<br>')}</span>
            </div>
        `;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'firma') {
        contentDiv.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center;">
                <span style="font-family:'Brush Script MT',cursive; font-size:${size*1.5}px;">${text.replace(/\n/g, '<br>')}</span>
                <div style="width:100%; height:${Math.max(2, size/15)}px; background:${color}; border-radius:50%; transform:rotate(-5deg); margin-top:-${size/4}px;"></div>
            </div>
        `;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'cinta') {
        const lines = text.split('\n');
        let html = '';
        lines.forEach((line, i) => {
            html += `<div style="background:${color}; display:inline-block; padding:${size/4}px ${size}px; margin-bottom:${size/10}px;">
                        <span style="font-family:Arial,sans-serif; font-weight:bold; color:var(--bg-main); text-transform:uppercase;">${line}</span>
                    </div><br>`;
        });
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'retro') {
        contentDiv.innerHTML = text.replace(/\n/g, '<br>').toUpperCase();
        contentDiv.style.fontFamily = "Impact, sans-serif";
        contentDiv.style.fontStyle = "italic";
        contentDiv.style.color = "transparent";
        contentDiv.style.webkitTextStroke = `1px ${color}`;
        const offset = Math.max(2, size/10);
        contentDiv.style.textShadow = `${offset}px ${offset}px 0px ${color}`;
        contentDiv.style.transform = `rotate(-10deg)`;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'vertical') {
        const lines = text.split('\n');
        let html = `<div style="display:flex; gap:${size}px;">`;
        const rawLines = rawText.split('\n');
        lines.forEach((line, li) => {
            html += `<div style="display:flex; flex-direction:column; align-items:center; line-height:1; font-family:Arial,sans-serif; font-weight:bold;">`;
            const chars = Array.from(rawLines[li] || '');
            for (let i=0; i<chars.length; i++) {
                html += `<div>${escapeHtml(chars[i].toUpperCase())}</div>`;
            }
            html += `</div>`;
        });
        html += `</div>`;
        contentDiv.innerHTML = html;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    else if (currentTextStyle === 'romantico') {
        contentDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:${size/2}px;">
                <span style="font-family:'Georgia',serif; font-style:italic;">~</span>
                <span style="font-family:'Georgia',serif; font-style:italic;">${text.replace(/\n/g, '<br>')}</span>
                <span style="font-family:'Georgia',serif; font-style:italic;">~</span>
            </div>
        `;
        contentDiv.style.border = 'none';
        contentDiv.style.padding = '0';
        contentDiv.style.borderRadius = '0';
    }
    
    if (DOM.valTextSize) DOM.valTextSize.textContent = `${size}px`;
    if (DOM.valTextOpacity) DOM.valTextOpacity.textContent = `${DOM.textOpacity.value}%`;
}

if (DOM.textInput) DOM.textInput.addEventListener('input', updateTextPreview);
if (DOM.textSize) DOM.textSize.addEventListener('input', updateTextPreview);
if (DOM.textFont) DOM.textFont.addEventListener('change', updateTextPreview);
if (DOM.textColor) DOM.textColor.addEventListener('input', updateTextPreview);
if (DOM.textOpacity) DOM.textOpacity.addEventListener('input', updateTextPreview);

// Drag logic for text overlay
if (DOM.textOverlay) {
    DOM.textOverlay.addEventListener('mousedown', startTextDrag);
    DOM.textOverlay.addEventListener('touchstart', startTextDrag, {passive: false});
    document.addEventListener('mousemove', dragText);
    document.addEventListener('touchmove', dragText, {passive: false});
    document.addEventListener('mouseup', endTextDrag);
    document.addEventListener('touchend', endTextDrag);
}

let textInitialDistance = null;
let textInitialSize = null;

function getDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

function startTextDrag(e) {
    if (currentTool !== 'text') return;
    
    // Check for pinch to zoom
    if (e.touches && e.touches.length === 2) {
        textInitialDistance = getDistance(e.touches);
        textInitialSize = parseInt(DOM.textSize.value);
        textIsDragging = false; // Disable normal drag while zooming
        return;
    }
    
    // Normal single-finger drag
    textInitialDistance = null;
    e.preventDefault();
    textIsDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    textStartX = clientX;
    textStartY = clientY;
    
    // Parse current left/top or default to 0
    const style = window.getComputedStyle(DOM.textOverlay);
    textInitialX = parseInt(style.left) || (DOM.mainCanvas.offsetWidth / 2 - DOM.textOverlay.offsetWidth / 2);
    textInitialY = parseInt(style.top) || (DOM.mainCanvas.offsetHeight / 2 - DOM.textOverlay.offsetHeight / 2);
    
    DOM.textOverlay.style.left = textInitialX + 'px';
    DOM.textOverlay.style.top = textInitialY + 'px';
}

function dragText(e) {
    if (currentTool !== 'text') return;
    
    // Check for pinch to zoom
    if (e.touches && e.touches.length === 2 && textInitialDistance !== null) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const scale = currentDistance / textInitialDistance;
        let newSize = Math.round(textInitialSize * scale);
        
        // Clamp size
        const minSize = parseInt(DOM.textSize.min);
        const maxSize = parseInt(DOM.textSize.max);
        newSize = Math.max(minSize, Math.min(newSize, maxSize));
        
        DOM.textSize.value = newSize;
        updateTextPreview();
        return;
    }
    
    if (!textIsDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - textStartX;
    const dy = clientY - textStartY;
    
    DOM.textOverlay.style.left = (textInitialX + dx) + 'px';
    DOM.textOverlay.style.top = (textInitialY + dy) + 'px';
}

function endTextDrag(e) {
    if (e.touches && e.touches.length < 2) {
        textInitialDistance = null;
    }
    if (!e.touches || e.touches.length === 0) {
        textIsDragging = false;
    }
}

        // Fix Text onto canvas
if (DOM.btnApplyText) {
    DOM.btnApplyText.addEventListener('click', () => {
        if (!hasImage) return;
        const text = DOM.textInput.value;
        if (!text) {
            showToast("Escribe un texto primero.");
            return;
        }
        
        // Posición relativa a la foto real (no al recuadro del canvas, que puede tener bordes vacíos)
        const bounds = getImageVisualBounds();
        const contentDiv = document.getElementById('text-overlay-content');
        const overlayRect = contentDiv.getBoundingClientRect();
        
        const scaleX = bounds.renderScaleX;
        const scaleY = bounds.renderScaleY;
        
        const centerX = (overlayRect.left + overlayRect.width/2 - bounds.left) * scaleX;
        const centerY = (overlayRect.top + overlayRect.height/2 - bounds.top) * scaleY;
        const textWidthPx = overlayRect.width * scaleX;
        const textHeightPx = overlayRect.height * scaleY;
        
        // Draw directly to originalImageData context
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = originalImageData.width;
        tempCanvas.height = originalImageData.height;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.putImageData(originalImageData, 0, 0);
        
        const fontSize = DOM.textSize.value * scaleY;
        tCtx.font = `${fontSize}px ${DOM.textFont.value}`;
        tCtx.fillStyle = DOM.textColor.value;
        tCtx.strokeStyle = DOM.textColor.value;
        tCtx.globalAlpha = DOM.textOpacity.value / 100;
        tCtx.textBaseline = 'middle';
        tCtx.textAlign = 'center';
        
        const lines = text.split('\n');
        const lineHeight = fontSize * 1.2;
        
        if (currentTextStyle === 'basico') {
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, index) => {
                tCtx.fillText(line, centerX, startY + (index * lineHeight));
            });
        }
        else if (currentTextStyle === 'bloque') {
            tCtx.font = `bold ${fontSize}px ${DOM.textFont.value}`;
            const tightLineHeight = fontSize * 0.85; // compact stacking
            const startY = centerY - ((lines.length - 1) * tightLineHeight) / 2;
            lines.forEach((line, index) => {
                tCtx.fillText(line.toUpperCase(), centerX, startY + (index * tightLineHeight));
            });
        }
        else if (currentTextStyle === 'cursiva') {
            tCtx.font = `${fontSize}px 'Brush Script MT', cursive`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, index) => {
                tCtx.fillText(line, centerX, startY + (index * lineHeight));
            });
        }
        else if (currentTextStyle === 'accion') {
            tCtx.font = `italic bold ${fontSize}px ${DOM.textFont.value}`;
            
            // Need to save context to apply transform (skew)
            tCtx.save();
            tCtx.translate(centerX, centerY);
            tCtx.transform(1, 0, Math.tan(-10 * Math.PI / 180), 1, 0, 0); // Skew X by -10 degrees
            
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line.toUpperCase()).width));
            
            const startY = -((lines.length - 1) * lineHeight) / 2;
            const boxH = lines.length * lineHeight;
            
            // Draw top and bottom lines
            tCtx.lineWidth = Math.max(2, fontSize/10);
            tCtx.beginPath();
            tCtx.moveTo(-maxW/2 - fontSize*0.2, startY - fontSize*0.6);
            tCtx.lineTo(maxW/2 + fontSize*0.2, startY - fontSize*0.6);
            tCtx.moveTo(-maxW/2 - fontSize*0.2, startY + boxH - fontSize*0.3);
            tCtx.lineTo(maxW/2 + fontSize*0.2, startY + boxH - fontSize*0.3);
            tCtx.stroke();
            
            lines.forEach((line, index) => {
                tCtx.fillText(line.toUpperCase(), 0, startY + (index * lineHeight));
            });
            
            tCtx.restore();
        }
        else if (currentTextStyle === 'poster') {
            const numLines = lines.length;
            const blockHeight = numLines * lineHeight + fontSize * 2; 
            let currentY = centerY - blockHeight / 2 + fontSize;

            let maxTextW = 0;
            lines.forEach((line, i) => {
                if (i===0) tCtx.font = `bold ${fontSize*0.8}px Arial, sans-serif`;
                else if (i===1) tCtx.font = `${fontSize*1.2}px Impact, sans-serif`;
                else if (i===2) tCtx.font = `italic ${fontSize*0.9}px 'Georgia', serif`;
                else if (i===3) tCtx.font = `bold ${fontSize*0.6}px Arial, sans-serif`;
                else tCtx.font = `${fontSize*1.3}px 'Brush Script MT', cursive`;
                
                let w = tCtx.measureText(i===0||i===1||i===3 ? line.toUpperCase() : line).width;
                if (i===0) w += line.length * (fontSize/2); // letter spacing approximate
                maxTextW = Math.max(maxTextW, w);
            });
            
            const boxW = maxTextW + fontSize * 3;
            const boxH = blockHeight + fontSize;
            
            // Draw outer border
            tCtx.lineWidth = Math.max(3, fontSize/10);
            tCtx.strokeRect(centerX - boxW/2, centerY - boxH/2, boxW, boxH);

            // Draw a star at the top
            const starY = centerY - boxH/2 + fontSize;
            tCtx.beginPath();
            const r = fontSize * 0.4;
            for(let i=0; i<5; i++) {
                tCtx.lineTo(Math.cos((18+i*72)/180*Math.PI)*r + centerX, -Math.sin((18+i*72)/180*Math.PI)*r + starY);
                tCtx.lineTo(Math.cos((54+i*72)/180*Math.PI)*(r/2) + centerX, -Math.sin((54+i*72)/180*Math.PI)*(r/2) + starY);
            }
            tCtx.closePath();
            tCtx.fill();
            
            currentY = starY + fontSize*1.2;

            lines.forEach((line, index) => {
                if (index === 0) { // SPEND
                    tCtx.font = `bold ${fontSize * 0.8}px Arial, sans-serif`;
                    const chars = line.toUpperCase().split('');
                    const spacing = fontSize / 2;
                    const totalW = tCtx.measureText(line.toUpperCase()).width + (chars.length - 1) * spacing;
                    let startX = centerX - totalW / 2;
                    chars.forEach(ch => {
                        tCtx.fillText(ch, startX + tCtx.measureText(ch).width/2, currentY);
                        startX += tCtx.measureText(ch).width + spacing;
                    });
                    currentY += lineHeight;
                } else if (index === 1) { // TIME WITH
                    tCtx.font = `${fontSize * 1.2}px Impact, sans-serif`;
                    tCtx.fillText(line.toUpperCase(), centerX, currentY);
                    currentY += lineHeight;
                } else if (index === 2) { // the people
                    tCtx.font = `italic ${fontSize * 0.9}px 'Georgia', serif`;
                    tCtx.fillText(line, centerX, currentY);
                    
                    const textW = tCtx.measureText(line).width;
                    const lineSpacing = fontSize/6;
                    tCtx.lineWidth = Math.max(2, fontSize/15);
                    
                    // Left lines
                    tCtx.beginPath();
                    tCtx.moveTo(centerX - textW/2 - fontSize*1.5, currentY - lineSpacing);
                    tCtx.lineTo(centerX - textW/2 - fontSize*0.2, currentY - lineSpacing);
                    tCtx.moveTo(centerX - textW/2 - fontSize*1.5, currentY + lineSpacing);
                    tCtx.lineTo(centerX - textW/2 - fontSize*0.2, currentY + lineSpacing);
                    tCtx.stroke();
                    
                    // Right lines
                    tCtx.beginPath();
                    tCtx.moveTo(centerX + textW/2 + fontSize*0.2, currentY - lineSpacing);
                    tCtx.lineTo(centerX + textW/2 + fontSize*1.5, currentY - lineSpacing);
                    tCtx.moveTo(centerX + textW/2 + fontSize*0.2, currentY + lineSpacing);
                    tCtx.lineTo(centerX + textW/2 + fontSize*1.5, currentY + lineSpacing);
                    tCtx.stroke();
                    
                    currentY += lineHeight;
                } else if (index === 3) { // WHO MAKES (Banner)
                    tCtx.font = `bold ${fontSize * 0.6}px Arial, sans-serif`;
                    const textW = tCtx.measureText(line.toUpperCase()).width;
                    const pad = fontSize/2;
                    
                    // Banner background
                    tCtx.fillStyle = DOM.textColor.value;
                    tCtx.fillRect(centerX - textW/2 - pad, currentY - fontSize*0.5, textW + pad*2, fontSize);
                    
                    // Banner tails
                    tCtx.beginPath();
                    tCtx.moveTo(centerX - textW/2 - pad, currentY - fontSize*0.5);
                    tCtx.lineTo(centerX - textW/2 - pad - fontSize*0.4, currentY);
                    tCtx.lineTo(centerX - textW/2 - pad, currentY + fontSize*0.5);
                    tCtx.fill();
                    
                    tCtx.beginPath();
                    tCtx.moveTo(centerX + textW/2 + pad, currentY - fontSize*0.5);
                    tCtx.lineTo(centerX + textW/2 + pad + fontSize*0.4, currentY);
                    tCtx.lineTo(centerX + textW/2 + pad, currentY + fontSize*0.5);
                    tCtx.fill();
                    
                    // Inverse text color
                    tCtx.fillStyle = 'rgba(0,0,0,0.8)';
                    tCtx.fillText(line.toUpperCase(), centerX, currentY);
                    tCtx.fillStyle = DOM.textColor.value; // restore
                    
                    currentY += lineHeight * 1.2;
                } else { // you happy.
                    tCtx.font = `${fontSize * 1.3}px 'Brush Script MT', cursive`;
                    tCtx.fillText(line, centerX, currentY);
                    currentY += lineHeight;
                }
            });
        }
        else if (currentTextStyle === 'neon') {
            tCtx.font = `bold ${fontSize}px 'Courier New', monospace`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            
            tCtx.shadowColor = DOM.textColor.value;
            
            lines.forEach((line, index) => {
                const y = startY + (index * lineHeight);
                
                // Draw multiple layers of glow
                tCtx.shadowBlur = fontSize * 0.8;
                tCtx.fillText(line, centerX, y);
                
                tCtx.shadowBlur = fontSize / 3;
                tCtx.fillText(line, centerX, y);
                
                tCtx.shadowBlur = fontSize / 6;
                tCtx.fillText(line, centerX, y);
                
                // Draw inner white core
                tCtx.shadowBlur = 0;
                tCtx.fillStyle = '#ffffff';
                tCtx.fillText(line, centerX, y);
                tCtx.fillStyle = DOM.textColor.value; // restore
            });
            tCtx.shadowBlur = 0;
        }
        else if (currentTextStyle === 'burbuja') {
            tCtx.font = `900 ${fontSize}px Arial, sans-serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            
            tCtx.shadowColor = 'rgba(0,0,0,0.3)';
            tCtx.shadowBlur = Math.max(2, fontSize/15);
            tCtx.shadowOffsetY = Math.max(2, fontSize/15);
            
            lines.forEach((line, index) => {
                const y = startY + (index * lineHeight);
                tCtx.lineWidth = Math.max(2, fontSize/10);
                tCtx.strokeStyle = 'white';
                
                // Draw stroke first
                tCtx.strokeText(line, centerX, y);
                // Draw fill without shadow
                tCtx.shadowColor = 'transparent';
                tCtx.fillText(line, centerX, y);
                tCtx.shadowColor = 'rgba(0,0,0,0.3)'; // restore for next line
            });
            tCtx.shadowColor = 'transparent';
        }
        else if (currentTextStyle === 'sombra3d') {
            tCtx.font = `${fontSize}px Impact, sans-serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            const shadowOffset = Math.max(2, fontSize/8);
            
            lines.forEach((line, index) => {
                const y = startY + (index * lineHeight);
                // Draw shadow
                tCtx.fillStyle = 'black';
                tCtx.fillText(line.toUpperCase(), centerX + shadowOffset, y + shadowOffset);
                // Draw text
                tCtx.fillStyle = DOM.textColor.value;
                tCtx.fillText(line.toUpperCase(), centerX, y);
            });
        }
        else if (currentTextStyle === 'elegante') {
            tCtx.font = `${fontSize}px 'Georgia', serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line.toUpperCase()).width + line.length * (fontSize/3)));
            
            const boxH = lines.length * lineHeight;
            
            tCtx.lineWidth = 1;
            tCtx.beginPath();
            tCtx.moveTo(centerX - maxW/2, startY - fontSize*0.6);
            tCtx.lineTo(centerX + maxW/2, startY - fontSize*0.6);
            tCtx.moveTo(centerX - maxW/2, startY + boxH - fontSize*0.3);
            tCtx.lineTo(centerX + maxW/2, startY + boxH - fontSize*0.3);
            tCtx.stroke();
            
            lines.forEach((line, index) => {
                const chars = line.toUpperCase().split('');
                const spacing = fontSize / 3;
                const totalW = tCtx.measureText(line.toUpperCase()).width + (chars.length - 1) * spacing;
                let startX = centerX - totalW / 2;
                chars.forEach(ch => {
                    tCtx.fillText(ch, startX + tCtx.measureText(ch).width/2, startY + (index * lineHeight));
                    startX += tCtx.measureText(ch).width + spacing;
                });
            });
        }
        else if (currentTextStyle === 'cita') {
            tCtx.font = `italic ${fontSize}px 'Georgia', serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line).width));
            
            tCtx.fillStyle = DOM.textColor.value;
            lines.forEach((line, index) => {
                tCtx.fillText(line, centerX, startY + (index * lineHeight));
            });
            
            // Draw quotes
            tCtx.font = `${fontSize * 3}px 'Georgia', serif`;
            tCtx.globalAlpha = (DOM.textOpacity.value / 100) * 0.3;
            tCtx.fillText('"', centerX - maxW/2 - fontSize, startY + fontSize*0.5);
            tCtx.fillText('"', centerX + maxW/2 + fontSize, startY + (lines.length-1)*lineHeight + fontSize*1.5);
            tCtx.globalAlpha = DOM.textOpacity.value / 100;
        }
        else if (currentTextStyle === 'minimalista') {
            tCtx.font = `${fontSize}px Arial, sans-serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line.toUpperCase()).width + line.length * (fontSize/3)));
            
            const boxW = maxW + fontSize;
            const boxH = lines.length * lineHeight + fontSize;
            
            tCtx.lineWidth = 1;
            tCtx.strokeRect(centerX - boxW/2, centerY - boxH/2 + fontSize*0.2, boxW, boxH);
            
            lines.forEach((line, index) => {
                const chars = line.toUpperCase().split('');
                const spacing = fontSize / 3;
                const totalW = tCtx.measureText(line.toUpperCase()).width + (chars.length - 1) * spacing;
                let startX = centerX - totalW / 2;
                chars.forEach(ch => {
                    tCtx.fillText(ch, startX + tCtx.measureText(ch).width/2, startY + (index * lineHeight));
                    startX += tCtx.measureText(ch).width + spacing;
                });
            });
        }
        else if (currentTextStyle === 'sello') {
            tCtx.font = `bold ${fontSize}px 'Times New Roman', serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line.toUpperCase()).width));
            
            const radius = Math.max(maxW, lines.length * lineHeight) / 2 + fontSize;
            
            tCtx.lineWidth = Math.max(2, fontSize/10);
            tCtx.beginPath();
            tCtx.arc(centerX, centerY + fontSize*0.2, radius, 0, Math.PI * 2);
            tCtx.stroke();
            
            tCtx.beginPath();
            tCtx.arc(centerX, centerY + fontSize*0.2, radius - fontSize*0.2, 0, Math.PI * 2);
            tCtx.stroke();
            
            lines.forEach((line, index) => {
                tCtx.fillText(line.toUpperCase(), centerX, startY + (index * lineHeight));
            });
        }
        else if (currentTextStyle === 'firma') {
            tCtx.font = `${fontSize * 1.5}px 'Brush Script MT', cursive`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            let maxW = 0;
            lines.forEach(line => maxW = Math.max(maxW, tCtx.measureText(line).width));
            
            lines.forEach((line, index) => {
                tCtx.fillText(line, centerX, startY + (index * lineHeight));
            });
            
            // Draw swoosh
            tCtx.lineWidth = Math.max(2, fontSize/15);
            tCtx.beginPath();
            const swooshY = startY + (lines.length - 1) * lineHeight + fontSize;
            tCtx.ellipse(centerX, swooshY, maxW/1.5, fontSize/6, -5 * Math.PI / 180, 0, 2 * Math.PI);
            tCtx.fill();
        }
        else if (currentTextStyle === 'cinta') {
            tCtx.font = `bold ${fontSize}px Arial, sans-serif`;
            const startY = centerY - ((lines.length - 1) * (lineHeight + fontSize/10)) / 2;
            
            lines.forEach((line, index) => {
                const y = startY + (index * (lineHeight + fontSize/10));
                const textW = tCtx.measureText(line.toUpperCase()).width;
                
                tCtx.fillStyle = DOM.textColor.value;
                tCtx.fillRect(centerX - textW/2 - fontSize, y - fontSize*0.6, textW + fontSize*2, fontSize*1.3);
                
                tCtx.fillStyle = '#000000'; // Or fetch background color (black for contrast)
                tCtx.globalCompositeOperation = 'destination-out';
                tCtx.fillText(line.toUpperCase(), centerX, y + fontSize*0.1);
                tCtx.globalCompositeOperation = 'source-over';
                tCtx.fillStyle = DOM.textColor.value; // Restore
            });
        }
        else if (currentTextStyle === 'retro') {
            tCtx.font = `italic ${fontSize}px Impact, sans-serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            
            tCtx.save();
            tCtx.translate(centerX, centerY);
            tCtx.rotate(-10 * Math.PI / 180);
            
            const shadowOffset = Math.max(2, fontSize/10);
            
            lines.forEach((line, index) => {
                const y = -((lines.length - 1) * lineHeight) / 2 + (index * lineHeight);
                
                // Draw shadow
                tCtx.fillStyle = DOM.textColor.value;
                tCtx.fillText(line.toUpperCase(), shadowOffset, y + shadowOffset);
                
                // Erase center
                tCtx.globalCompositeOperation = 'destination-out';
                tCtx.fillText(line.toUpperCase(), 0, y);
                tCtx.globalCompositeOperation = 'source-over';
                
                // Draw stroke
                tCtx.lineWidth = 2;
                tCtx.strokeStyle = DOM.textColor.value;
                tCtx.strokeText(line.toUpperCase(), 0, y);
            });
            
            tCtx.restore();
        }
        else if (currentTextStyle === 'vertical') {
            tCtx.font = `bold ${fontSize}px Arial, sans-serif`;
            
            // Calculate total width of all columns to center them
            const spacingX = fontSize * 1.5;
            const totalW = (lines.length - 1) * spacingX;
            const startX = centerX - totalW / 2;
            
            lines.forEach((line, colIndex) => {
                const chars = line.split('');
                const totalH = (chars.length - 1) * fontSize;
                const startY = centerY - totalH / 2;
                
                chars.forEach((ch, rowIndex) => {
                    tCtx.fillText(ch.toUpperCase(), startX + (colIndex * spacingX), startY + (rowIndex * fontSize));
                });
            });
        }
        else if (currentTextStyle === 'romantico') {
            tCtx.font = `italic ${fontSize}px 'Georgia', serif`;
            const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
            
            lines.forEach((line, index) => {
                const y = startY + (index * lineHeight);
                const textW = tCtx.measureText(line).width;
                
                tCtx.fillText(line, centerX, y);
                tCtx.fillText("~", centerX - textW/2 - fontSize, y);
                tCtx.fillText("~", centerX + textW/2 + fontSize, y);
            });
        }
        
        originalImageData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        saveState("Texto Añadido");
        applyAdjustments();
        toggleTool('text');
        DOM.textInput.value = '';
    });
}

if (DOM.btnCancelText) {
    DOM.btnCancelText.addEventListener('click', () => {
        toggleTool('text');
    });
}

// Estilos decorativos
if (DOM.presetTextBtns) {
    DOM.presetTextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            DOM.presetTextBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentTextStyle = e.currentTarget.dataset.style;
            
            // Auto-configure some nice fonts for the styles
            if (['bloque', 'accion', 'sombra3d', 'retro'].includes(currentTextStyle)) {
                DOM.textFont.value = "Impact, sans-serif";
            } else if (['cursiva', 'firma', 'romantico'].includes(currentTextStyle)) {
                DOM.textFont.value = "'Brush Script MT', cursive";
            } else if (['elegante', 'cita', 'sello'].includes(currentTextStyle)) {
                DOM.textFont.value = "'Georgia', serif";
            } else if (['neon'].includes(currentTextStyle)) {
                DOM.textFont.value = "'Courier New', monospace";
            } else {
                DOM.textFont.value = "Arial, sans-serif";
            }
            
            // Auto-format text into multiple lines if needed
            let text = DOM.textInput.value.trim();
            if (text && !text.includes('\n') && text.includes(' ')) {
                const words = text.split(/\s+/);
                if (words.length > 1) {
                    if (currentTextStyle === 'poster') {
                        const numLines = Math.min(words.length, 5);
                        let formatted = Array(numLines).fill('');
                        words.forEach((word, i) => {
                            let lineIndex = Math.floor((i / words.length) * numLines);
                            formatted[lineIndex] += (formatted[lineIndex] ? ' ' : '') + word;
                        });
                        DOM.textInput.value = formatted.join('\n');
                    } else if (['bloque', 'accion', 'sombra3d', 'retro', 'neon', 'cinta', 'elegante', 'sello'].includes(currentTextStyle)) {
                        const numLines = Math.min(words.length, 3);
                        let formatted = Array(numLines).fill('');
                        words.forEach((word, i) => {
                            let lineIndex = Math.floor((i / words.length) * numLines);
                            formatted[lineIndex] += (formatted[lineIndex] ? ' ' : '') + word;
                        });
                        DOM.textInput.value = formatted.join('\n');
                    } else if (currentTextStyle === 'cita' || currentTextStyle === 'romantico') {
                        const numLines = Math.min(words.length, 2);
                        let formatted = Array(numLines).fill('');
                        words.forEach((word, i) => {
                            let lineIndex = Math.floor((i / words.length) * numLines);
                            formatted[lineIndex] += (formatted[lineIndex] ? ' ' : '') + word;
                        });
                        DOM.textInput.value = formatted.join('\n');
                    } else if (currentTextStyle === 'vertical') {
                        DOM.textInput.value = words.join('\n');
                    }
                }
            } else if (text && !text.includes('\n') && currentTextStyle === 'vertical') {
                // if it's a single word, split characters
                DOM.textInput.value = text.split('').join('\n');
            }
            
            updateTextPreview();
        });
    });
}

// --- Librerías bajo demanda (están en la misma carpeta, funcionan sin internet) ---
const loadedLibs = {};
function loadScript(src) {
    if (!loadedLibs[src]) {
        loadedLibs[src] = new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = src;
            el.onload = resolve;
            el.onerror = () => { delete loadedLibs[src]; reject(new Error('No se pudo cargar ' + src)); };
            document.head.appendChild(el);
        });
    }
    return loadedLibs[src];
}
async function loadLib(name) {
    if (name === 'jspdf') {
        await loadScript('jspdf.umd.min.js');
        await loadScript('jspdf.plugin.autotable.min.js');
        return window.jspdf.jsPDF;
    }
    if (name === 'xlsx') { await loadScript('xlsx.full.min.js'); return window.XLSX; }
    if (name === 'pdfjs') {
        await loadScript('pdf.min.js');
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
        return window.pdfjsLib;
    }
    if (name === 'docx') { await loadScript('docx.umd.js'); return window.docx; }
    throw new Error('Librería desconocida ' + name);
}

function readFileAs(file, how) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        if (how === 'text') reader.readAsText(file);
        else if (how === 'buffer') reader.readAsArrayBuffer(file);
        else reader.readAsDataURL(file);
    });
}

// Convierte cualquier foto (PNG, WebP, HEIC en Safari...) a JPEG de tamaño razonable
function photoToJpeg(file, maxSize = 2400) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            let w = image.naturalWidth, h = image.naturalHeight;
            const ratio = Math.min(1, maxSize / Math.max(w, h));
            w = Math.round(w * ratio); h = Math.round(h * ratio);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            const cx = c.getContext('2d');
            cx.fillStyle = '#ffffff';
            cx.fillRect(0, 0, w, h);
            cx.drawImage(image, 0, 0, w, h);
            URL.revokeObjectURL(url);
            resolve({ dataUrl: c.toDataURL('image/jpeg', 0.88), width: w, height: h });
        };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se puede leer ' + file.name)); };
        image.src = url;
    });
}

function baseName(name) {
    return name.replace(/\.[^.]+$/, '');
}

// --- LOGICA DE EXPORTACION A PDF (FOTOS) ---
if (DOM.btnPdf && DOM.pdfFileInput) {
    DOM.btnPdf.addEventListener('click', () => {
        DOM.pdfFileInput.click();
    });

    DOM.pdfFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        DOM.pdfFileInput.value = ''; // permite volver a elegir las mismas fotos
        if (files.length === 0) return;
        
        showConfirmModal("Generar PDF", `¿Quieres generar el PDF con ${files.length === 1 ? 'la foto seleccionada' : 'las ' + files.length + ' fotos seleccionadas'}?`, async () => {
            DOM.loadingOverlay.classList.remove('hidden');
            DOM.loadingText.textContent = "Generando PDF de fotos...";
            
            try {
                const jsPDF = await loadLib('jspdf');
                let pdf = null;
                let skipped = 0;
                
                for (let i = 0; i < files.length; i++) {
                    DOM.loadingText.textContent = `Generando PDF... (${i + 1}/${files.length})`;
                    let photo;
                    try {
                        photo = await photoToJpeg(files[i]);
                    } catch (err) {
                        console.warn(err);
                        skipped++;
                        continue;
                    }
                    // Cada página en vertical u horizontal según la foto
                    const orientation = photo.width > photo.height ? 'landscape' : 'portrait';
                    if (!pdf) pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
                    else pdf.addPage('a4', orientation);
                    
                    const margin = 8;
                    const pageW = pdf.internal.pageSize.getWidth();
                    const pageH = pdf.internal.pageSize.getHeight();
                    const ratio = Math.min((pageW - margin * 2) / photo.width, (pageH - margin * 2) / photo.height);
                    const drawW = photo.width * ratio;
                    const drawH = photo.height * ratio;
                    pdf.addImage(photo.dataUrl, 'JPEG', (pageW - drawW) / 2, (pageH - drawH) / 2, drawW, drawH);
                }
                
                if (!pdf) {
                    showToast("No se ha podido leer ninguna de las fotos");
                    return;
                }
                await deliverFile(pdf.output('blob'), "fotos_difuminar.pdf");
                if (skipped) showToast(`PDF creado. ${skipped} foto(s) no se pudieron leer.`);
                
            } catch (err) {
                console.error("Error generando PDF de fotos:", err);
                showToast("Hubo un error al generar el PDF.");
            } finally {
                DOM.loadingOverlay.classList.add('hidden');
                DOM.loadingText.textContent = "Cargando...";
            }
        });
    });
}

// --- LOGICA DE EXPORTACION A PDF (DOCS: TXT, CSV, EXCEL) ---
if (DOM.btnPdfDocs && DOM.pdfDocsInput) {
    DOM.btnPdfDocs.addEventListener('click', () => {
        DOM.pdfDocsInput.click();
    });

    DOM.pdfDocsInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        DOM.pdfDocsInput.value = '';
        if (!file) return;
        const extension = file.name.split('.').pop().toLowerCase();
        if (!['txt', 'csv', 'xls', 'xlsx'].includes(extension)) {
            showToast("Formato no soportado. Usa .txt, .csv, .xls o .xlsx");
            return;
        }
        
        showConfirmModal("Generar PDF", `¿Quieres generar el PDF a partir del documento: <b>${escapeHtml(file.name)}</b>?`, async () => {
            DOM.loadingOverlay.classList.remove('hidden');
            DOM.loadingText.textContent = "Generando PDF de documento...";
            
            try {
                const jsPDF = await loadLib('jspdf');
                
                if (extension === 'txt') {
                    const pdf = new jsPDF();
                    const text = await readFileAs(file, 'text');
                    const margin = 15;
                    const pageW = pdf.internal.pageSize.getWidth();
                    const pageH = pdf.internal.pageSize.getHeight();
                    const lineH = 6;
                    pdf.setFontSize(11);
                    const textLines = pdf.splitTextToSize(text.replace(/\r\n/g, '\n'), pageW - margin * 2);
                    // Repartir el texto en tantas páginas como haga falta
                    let y = margin + 5;
                    textLines.forEach(line => {
                        if (y > pageH - margin) {
                            pdf.addPage();
                            y = margin + 5;
                        }
                        pdf.text(line, margin, y);
                        y += lineH;
                    });
                    await deliverFile(pdf.output('blob'), `${baseName(file.name)}.pdf`);
                } else {
                    const XLSX = await loadLib('xlsx');
                    const buffer = await readFileAs(file, 'buffer');
                    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
                    const pdf = new jsPDF({ orientation: maxCols > 6 ? 'landscape' : 'portrait' });
                    
                    if (rows.length > 0) {
                        const toText = cell => (cell === null || cell === undefined) ? '' : String(cell);
                        const pad = r => { const out = r.map(toText); while (out.length < maxCols) out.push(''); return out; };
                        pdf.autoTable({
                            head: [pad(rows[0])],
                            body: rows.slice(1).map(pad),
                            startY: 15,
                            theme: 'grid',
                            styles: { fontSize: 8 },
                            headStyles: { fillColor: [41, 128, 185] }
                        });
                    } else {
                        pdf.text("El documento está vacío.", 10, 20);
                    }
                    await deliverFile(pdf.output('blob'), `${baseName(file.name)}.pdf`);
                }
                
            } catch (err) {
                console.error("Error generando PDF de documento:", err);
                showToast("Hubo un error al leer el documento o generar el PDF.");
            } finally {
                DOM.loadingOverlay.classList.add('hidden');
                DOM.loadingText.textContent = "Cargando...";
            }
        });
    });
}

// --- LOGICA DE EXPORTACION PDF A WORD / PAGES ---
if (DOM.btnPdfToWord && DOM.pdfToWordInput) {
    DOM.btnPdfToWord.addEventListener('click', () => {
        DOM.pdfToWordInput.click();
    });

    DOM.pdfToWordInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        DOM.pdfToWordInput.value = '';
        if (!file || !DOM.formatModal) return;
        
        DOM.formatModal.classList.add('active');
        
        const cleanup = () => {
            DOM.formatModal.classList.remove('active');
            DOM.formatModalDocx.removeEventListener('click', onDocx);
            DOM.formatModalCancel.removeEventListener('click', onCancel);
        };
        
        const processFile = async () => {
            cleanup();
            DOM.loadingOverlay.classList.remove('hidden');
            DOM.loadingText.textContent = "Convirtiendo a Word...";
            
            try {
                const [pdfjsLib, docx] = await Promise.all([loadLib('pdfjs'), loadLib('docx')]);
                const { Document, Packer, Paragraph, ImageRun } = docx;
                const buffer = await readFileAs(file, 'buffer');
                const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
                
                // Ancho útil de un A4 con márgenes pequeños (en píxeles de Word)
                const MAX_W = 680, MAX_H = 980;
                const children = [];
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    DOM.loadingText.textContent = `Convirtiendo página ${i} de ${pdf.numPages}...`;
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement('canvas');
                    const pctx = canvas.getContext('2d');
                    canvas.width = Math.round(viewport.width);
                    canvas.height = Math.round(viewport.height);
                    pctx.fillStyle = "#ffffff";
                    pctx.fillRect(0, 0, canvas.width, canvas.height);
                    await page.render({ canvasContext: pctx, viewport }).promise;
                    
                    const blob = await canvasToBlob(canvas, 'image/jpeg', 0.85);
                    const data = await blob.arrayBuffer();
                    const scale = Math.min(MAX_W / canvas.width, MAX_H / canvas.height);
                    
                    children.push(new Paragraph({
                        pageBreakBefore: i > 1,
                        children: [new ImageRun({
                            data,
                            transformation: {
                                width: Math.round(canvas.width * scale),
                                height: Math.round(canvas.height * scale)
                            }
                        })]
                    }));
                }
                
                const doc = new Document({
                    sections: [{
                        properties: {
                            page: { margin: { top: 500, right: 500, bottom: 500, left: 500 } }
                        },
                        children
                    }]
                });
                
                const blob = await Packer.toBlob(doc);
                await deliverFile(blob, `${baseName(file.name)}.docx`);
                
            } catch (err) {
                console.error(err);
                showToast("Hubo un error al convertir el PDF.");
            } finally {
                DOM.loadingOverlay.classList.add('hidden');
                DOM.loadingText.textContent = "Cargando...";
            }
        };
        
        const onDocx = () => processFile();
        const onCancel = () => cleanup();
        
        DOM.formatModalDocx.addEventListener('click', onDocx);
        DOM.formatModalCancel.addEventListener('click', onCancel);
    });
}
