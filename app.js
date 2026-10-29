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
    
    // UI Elements
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
            if (targetId === 'panel-ajustes') {
                const activeBtn = document.querySelector('.adj-btn.active') || document.querySelector('.adj-btn');
                showAdjustment(activeBtn.getAttribute('data-target'));
            }
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

// Barra de Ajustes: al pulsar un ajuste se muestra SOLO su deslizador
function showAdjustment(targetId) {
    DOM.adjustmentsSettings.classList.remove('hidden');
    DOM.adjustmentsSettings.querySelectorAll('.control-item').forEach(el => {
        el.classList.toggle('hidden', el.id !== targetId);
    });
    document.querySelectorAll('.adj-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-target') === targetId));
}

document.querySelectorAll('.adj-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (typeof currentTool !== 'undefined' && currentTool) toggleTool(currentTool);
        showAdjustment(btn.getAttribute('data-target'));
    });
});

// Punto en los ajustes que se han cambiado (para saber cuáles están tocados)
function markChangedAdjustments() {
    document.querySelectorAll('.adj-btn').forEach(b => {
        const item = document.getElementById(b.getAttribute('data-target'));
        const input = item && item.querySelector('input[type=range]');
        b.classList.toggle('changed', !!input && parseInt(input.value) !== 0);
    });
}

// Tocar dos veces el nombre de un ajuste lo devuelve a 0
document.querySelectorAll('#adjustments-sliders-container .label-row').forEach(row => {
    row.addEventListener('dblclick', () => {
        const input = row.parentElement.querySelector('input[type=range]');
        if (!input) return;
        input.value = 0;
        input.dispatchEvent(new Event('input'));
    });
});

// App Reset (Home Button & Exit Button)
function resetApp() {
    // "Salir y Borrar" (pestaña Exportar): pide confirmación y quita la foto
    if (hasImage) DOM.modalReset.classList.add('active');
}
// Al pulsar el logo: ir al principio, salir o cancelar
(function setupHomeMenu() {
    const modal = document.getElementById('home-modal');
    if (!modal) { DOM.logoTitle.addEventListener('click', resetApp); return; }
    const close = () => modal.classList.remove('active');
    DOM.logoTitle.addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        modal.classList.add('active');
    });
    document.getElementById('home-cancel').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    // Ir al principio: vuelve la pantalla de inicio (la foto y los cambios se conservan)
    document.getElementById('home-go-start').addEventListener('click', () => {
        close();
        if (currentTool) toggleTool(currentTool);
        const splash = document.getElementById('splash-screen');
        if (!splash) return;
        splash.classList.remove('hidden');
        splash.style.pointerEvents = 'none';
        splash.style.opacity = '0';
        // reiniciar la animación del logo
        splash.querySelectorAll('.splash-logo, .splash-title').forEach(el => {
            el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
        });
        requestAnimationFrame(() => { splash.style.opacity = '1'; });
        // esperar un poco para que el mismo toque no la cierre enseguida
        setTimeout(() => { splash.style.pointerEvents = 'auto'; }, 450);
    });

    // Salir: los navegadores solo dejan cerrar la ventana si la abrió la propia app;
    // si no se puede, se muestra una pantalla de despedida y se borra la foto.
    document.getElementById('home-exit').addEventListener('click', () => {
        close();
        try { window.close(); } catch (e) {}
        setTimeout(() => {
            if (window.closed) return;
            const bye = document.getElementById('bye-screen');
            if (bye) bye.classList.remove('hidden');
        }, 250);
    });
    const reopen = document.getElementById('bye-reopen');
    if (reopen) reopen.addEventListener('click', () => location.reload());
})();
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

// Quitar la foto y volver a la pantalla de "Subir Foto" (Ajustes, Herramientas, Exportar)
function clearPhoto() {
    if (currentTool) toggleTool(currentTool);
    document.querySelectorAll('.custom-modal-overlay.active').forEach(m => m.classList.remove('active'));

    hasImage = false;
    originalImageData = null;
    currentImageData = null;
    currentImageInfo = null;
    history = [];
    historyIndex = -1;
    if (typeof skinCache !== 'undefined') skinCache = null;
    if (typeof whitenCache !== 'undefined') whitenCache = null;

    [DOM.mainCanvas, DOM.originalCanvas, DOM.maskCanvas].forEach(c => { c.width = 0; c.height = 0; });
    const flash = document.getElementById('flash-canvas');
    if (flash) { flash.width = 0; flash.height = 0; }
    DOM.originalCanvas.classList.add('hidden');
    DOM.mainCanvas.classList.remove('hidden');
    DOM.cropOverlay.classList.add('hidden');
    if (DOM.textOverlay) DOM.textOverlay.classList.add('hidden');
    if (DOM.textInput) DOM.textInput.value = '';

    resetAdjustments();
    DOM.placeholder.classList.remove('hidden');
    DOM.canvasContainer.classList.remove('has-image');

    // Cerrar el panel inferior y desactivar los botones de arriba
    toolPanelsContainer.classList.add('closed');
    navItems.forEach(nav => nav.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.history-actions .history-btn').forEach(btn => btn.disabled = true);
    DOM.upload.value = '';
    showToast('Foto borrada. Puedes subir otra');
}
window.clearPhoto = clearPhoto;

DOM.btnConfirmReset.addEventListener('click', () => {
    DOM.modalReset.classList.remove('active');
    clearPhoto();
});
DOM.modalReset.addEventListener('click', e => { if (e.target === DOM.modalReset) DOM.modalReset.classList.remove('active'); });

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
    if (typeof markChangedAdjustments === 'function') markChangedAdjustments();
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
    // ---------- PIEL PERFECTA ----------
    // Al abrir la herramienta se buscan las caras con la IA y se prepara una máscara de piel
    // (sin ojos, cejas ni boca) y una versión suavizada de la foto. El deslizador solo mezcla ambas.
    let skinCache = null;
    let skinPreparing = false;

    function skinColorScore(r, g, b) {
        if (typeof window.skinLikeness === 'function') return window.skinLikeness(r, g, b);
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
        return (y > 35 && cr > 133 && cr < 180 && cb > 75 && cb < 130) ? 1 : 0;
    }

    function buildSkinCache(ctxSource, detected) {
        const w = ctxSource.canvas.width, h = ctxSource.canvas.height;
        const base = ctxSource.getImageData(0, 0, w, h).data;
        let mask = detected && detected.mask;
        if (!mask) {
            // Sin cara detectada: se suaviza lo que tiene color de piel
            mask = new Float32Array(w * h);
            for (let i = 0, j = 0; i < mask.length; i++, j += 4) mask[i] = skinColorScore(base[j], base[j + 1], base[j + 2]) * 0.8;
        }
        // Radio del suavizado según el tamaño de la cara (o de la foto)
        const ref = (detected && detected.faceSize) || Math.max(w, h) / 4;
        const radius = Math.max(3, Math.round(ref / 28));
        const bc = document.createElement('canvas');
        bc.width = w; bc.height = h;
        const bx = bc.getContext('2d');
        bx.filter = `blur(${radius}px)`;
        bx.drawImage(ctxSource.canvas, 0, 0);
        const blur = bx.getImageData(0, 0, w, h).data;

        // Suavizado que respeta los bordes marcados (contorno de nariz, pelo, gafas...)
        const smooth = new Uint8ClampedArray(base.length);
        for (let j = 0; j < base.length; j += 4) {
            const l1 = 0.299 * base[j] + 0.587 * base[j + 1] + 0.114 * base[j + 2];
            const l2 = 0.299 * blur[j] + 0.587 * blur[j + 1] + 0.114 * blur[j + 2];
            const d = Math.abs(l1 - l2);
            const keep = d < 12 ? 1 : d > 45 ? 0 : 1 - (d - 12) / 33;
            smooth[j] = base[j] + (blur[j] - base[j]) * keep;
            smooth[j + 1] = base[j + 1] + (blur[j + 1] - base[j + 1]) * keep;
            smooth[j + 2] = base[j + 2] + (blur[j + 2] - base[j + 2]) * keep;
            smooth[j + 3] = 255;
        }
        return { w, h, base, smooth, mask, faces: detected ? detected.faces : 0 };
    }

    function applySmartSkinSmoothing(ctxTarget, intensity) {
        if (intensity <= 0) return;
        const w = ctxTarget.canvas.width, h = ctxTarget.canvas.height;
        let cache = skinCache;
        if (!cache || cache.w !== w || cache.h !== h) cache = buildSkinCache(ctxTarget, null);
        const k = Math.min(1, intensity / 100);
        const amount = k * 0.95;                // al 100% queda un 5% de textura natural
        const glow = k * 10;                    // piel un poco más luminosa
        const out = ctxTarget.createImageData(w, h);
        const o = out.data, base = cache.base, sm = cache.smooth, mask = cache.mask;
        for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
            const m = mask[i];
            if (m <= 0.01) { o[j] = base[j]; o[j + 1] = base[j + 1]; o[j + 2] = base[j + 2]; o[j + 3] = 255; continue; }
            const a = m * amount, g = m * glow;
            o[j] = base[j] + (sm[j] - base[j]) * a + g;
            o[j + 1] = base[j + 1] + (sm[j + 1] - base[j + 1]) * a + g * 0.9;
            o[j + 2] = base[j + 2] + (sm[j + 2] - base[j + 2]) * a + g * 0.8;
            o[j + 3] = 255;
        }
        ctxTarget.putImageData(out, 0, 0);
    }

    // Enseña un momento en color la zona encontrada (en una capa aparte, sin tocar lo pintado)
    function getFlashCanvas() {
        let fc = document.getElementById('flash-canvas');
        if (!fc) {
            fc = document.createElement('canvas');
            fc.id = 'flash-canvas';
            DOM.maskCanvas.after(fc);
        }
        return fc;
    }
    function flashMask(mask, w, h, rgb = [255, 90, 140]) {
        if (!mask) return;
        const fc = getFlashCanvas();
        fc.width = w; fc.height = h;
        const fctx = fc.getContext('2d');
        const img = fctx.createImageData(w, h);
        for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
            if (mask[i] <= 0.02) continue;
            img.data[j] = rgb[0]; img.data[j + 1] = rgb[1]; img.data[j + 2] = rgb[2]; img.data[j + 3] = Math.min(255, mask[i] * 170);
        }
        fctx.putImageData(img, 0, 0);
        fc.classList.remove('fade');
        fc.style.opacity = '1';
        clearTimeout(flashMask.t1); clearTimeout(flashMask.t2);
        flashMask.t1 = setTimeout(() => { fc.classList.add('fade'); fc.style.opacity = '0'; }, 1300);
        flashMask.t2 = setTimeout(() => fctx.clearRect(0, 0, w, h), 2300);
    }
    function flashSkinMask(cache) {
        if (cache) flashMask(cache.mask, cache.w, cache.h);
    }

    async function prepareSkinTool() {
        skinCache = null;
        skinPreparing = true;
        DOM.adjMagicIntensity.disabled = true;
        DOM.loadingOverlay.classList.remove('hidden');
        DOM.loadingText.textContent = "Buscando caras...";
        await new Promise(r => setTimeout(r, 30));
        let detected = null;
        try {
            if (typeof window.detectSkinMask === 'function') detected = await window.detectSkinMask(DOM.mainCanvas);
        } catch (err) {
            console.warn('No se pudo detectar la cara', err);
        }
        if (currentTool !== 'magic-skin') {   // el usuario salió mientras tanto
            skinPreparing = false;
            DOM.adjMagicIntensity.disabled = false;
            DOM.loadingOverlay.classList.add('hidden');
            return;
        }
        DOM.loadingText.textContent = "Preparando la piel...";
        await new Promise(r => setTimeout(r, 30));
        skinCache = buildSkinCache(ctx, detected && detected.mask ? detected : null);
        skinPreparing = false;
        DOM.adjMagicIntensity.disabled = false;
        DOM.loadingOverlay.classList.add('hidden');
        DOM.loadingText.textContent = "Cargando...";

        if (detected && detected.faces > 0) {
            showToast(detected.faces === 1 ? "Cara encontrada ✓" : `${detected.faces} caras encontradas ✓`);
        } else {
            showToast("No he encontrado ninguna cara: se suaviza lo que tiene color de piel");
        }
        flashSkinMask(skinCache);
        // Empezar con un suavizado medio para que se note
        DOM.adjMagicIntensity.value = 50;
        DOM.valMagicIntensity.textContent = 50;
        applyAdjustments();
    }

    // ---------- DIENTES Y OJOS ----------
    // Al abrir la herramienta la IA busca la boca y los ojos y prepara una máscara automática.
    // Además se puede pintar con el dedo para añadir zonas que falten.
    let whitenCache = null;

    function ycc(r, g, b) {
        return [0.299 * r + 0.587 * g + 0.114 * b, 128 - 0.168736 * r - 0.331264 * g + 0.5 * b, 128 + 0.5 * r - 0.418688 * g - 0.081312 * b];
    }

    function polyMask(w, h, polys, blurPx, circlesOut) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const x = c.getContext('2d');
        x.fillStyle = '#fff';
        polys.forEach(pts => {
            x.beginPath();
            pts.forEach((p, i) => i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y));
            x.closePath(); x.fill();
        });
        if (circlesOut) {
            x.globalCompositeOperation = 'destination-out';
            circlesOut.forEach(ci => { x.beginPath(); x.arc(ci.x, ci.y, ci.r * 1.08, 0, Math.PI * 2); x.fill(); });
            x.globalCompositeOperation = 'source-over';
        }
        let src = c;
        if (blurPx > 0) {
            const b = document.createElement('canvas');
            b.width = w; b.height = h;
            const bx = b.getContext('2d');
            bx.filter = `blur(${blurPx}px)`;
            bx.drawImage(c, 0, 0);
            src = b;
        }
        const d = src.getContext('2d').getImageData(0, 0, w, h).data;
        const m = new Float32Array(w * h);
        for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] / 255;
        return m;
    }

    function buildWhitenCache(type, faces) {
        const w = DOM.mainCanvas.width, h = DOM.mainCanvas.height;
        const px = ctx.getImageData(0, 0, w, h).data;
        const mask = new Float32Array(w * h);
        let iris = null;
        if (!faces || !faces.length) return { type, w, h, mask: null, iris: null, faces: 0 };

        if (type === 'teeth') {
            const mouthW = Math.max(...faces.map(f => Math.max(...f.mouth.map(p => p.x)) - Math.min(...f.mouth.map(p => p.x))));
            const poly = polyMask(w, h, faces.map(f => f.mouth), Math.max(1, Math.round(mouthW / 60)));
            for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
                if (poly[i] <= 0) continue;
                const [y, , cr] = ycc(px[j], px[j + 1], px[j + 2]);
                // Los dientes son claros y poco rojos (así no se blanquean labios, encías ni lengua)
                const bright = Math.min(1, Math.max(0, (y - 60) / 55));
                const notRed = Math.min(1, Math.max(0, 1 - (cr - 148) / 16));
                mask[i] = poly[i] * bright * notRed;
            }
        } else {
            const irises = faces.flatMap(f => f.irises);
            const eyeW = Math.max(...faces.map(f => Math.max(...f.leftEye.map(p => p.x)) - Math.min(...f.leftEye.map(p => p.x))));
            const eyesPoly = faces.flatMap(f => [f.leftEye, f.rightEye]);
            const sclera = polyMask(w, h, eyesPoly, Math.max(1, Math.round(eyeW / 40)), irises);
            for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
                if (sclera[i] <= 0) continue;
                const [y] = ycc(px[j], px[j + 1], px[j + 2]);
                mask[i] = sclera[i] * Math.min(1, Math.max(0, (y - 50) / 50));   // solo lo blanco del ojo
            }
            if (irises.length) {
                // Iris: dentro del círculo y dentro del ojo
                const eyeHard = polyMask(w, h, eyesPoly, 0);
                const circ = document.createElement('canvas');
                circ.width = w; circ.height = h;
                const cx = circ.getContext('2d');
                cx.fillStyle = '#fff';
                irises.forEach(ci => { cx.beginPath(); cx.arc(ci.x, ci.y, ci.r, 0, Math.PI * 2); cx.fill(); });
                const cd = cx.getImageData(0, 0, w, h).data;
                iris = new Float32Array(w * h);
                for (let i = 0; i < iris.length; i++) iris[i] = (cd[i * 4 + 3] / 255) * eyeHard[i];
            }
        }
        return { type, w, h, mask, iris, faces: faces.length };
    }

    function applySmartWhiten(ctxTarget, intensity, type) {
        if (intensity <= 0) return;
        const w = ctxTarget.canvas.width, h = ctxTarget.canvas.height;
        const imgData = ctxTarget.getImageData(0, 0, w, h);
        const data = imgData.data;
        const k = intensity / 100;
        const brush = maskCtx.getImageData(0, 0, w, h).data;   // lo pintado a mano
        const cache = whitenCache && whitenCache.w === w && whitenCache.h === h && whitenCache.type === type ? whitenCache : null;
        const auto = cache && cache.mask;
        const iris = cache && cache.iris;

        for (let i = 0, j = 0; i < w * h; i++, j += 4) {
            let m = auto ? auto[i] : 0;
            const bm = brush[j + 3] / 153;   // el pincel pinta con 60% de opacidad
            if (bm > m) m = Math.min(1, bm);
            let r = data[j], g = data[j + 1], b = data[j + 2];

            if (m > 0.01) {
                const a = m * k;
                const L = 0.299 * r + 0.587 * g + 0.114 * b;
                // Quitar el tono amarillo/rojizo y aclarar
                r = r + (L - r) * a * 0.85;
                g = g + (L - g) * a * 0.85;
                b = b + (L - b) * a * 0.85 + a * 6;
                const lift = type === 'teeth' ? 0.38 : 0.3;
                r += (255 - r) * a * lift; g += (255 - g) * a * lift; b += (255 - b) * a * lift;
            }
            if (iris && iris[i] > 0.01) {
                // Iris: más color, más contraste y un poco de brillo
                const a = iris[i] * k;
                const L = 0.299 * r + 0.587 * g + 0.114 * b;
                r = L + (r - L) * (1 + a * 0.5); g = L + (g - L) * (1 + a * 0.5); b = L + (b - L) * (1 + a * 0.5);
                r = r * (1 + a * 0.18) + a * 6; g = g * (1 + a * 0.18) + a * 6; b = b * (1 + a * 0.18) + a * 6;
            }
            data[j] = r; data[j + 1] = g; data[j + 2] = b;
        }
        ctxTarget.putImageData(imgData, 0, 0);
    }

    async function prepareWhitenTool(type) {
        whitenCache = null;
        DOM.adjMagicIntensity.disabled = true;
        DOM.loadingOverlay.classList.remove('hidden');
        DOM.loadingText.textContent = type === 'teeth' ? "Buscando la boca..." : "Buscando los ojos...";
        await new Promise(r => setTimeout(r, 30));
        let faces = null;
        try {
            if (typeof window.detectFaceParts === 'function') faces = await window.detectFaceParts(DOM.mainCanvas);
        } catch (err) {
            console.warn('No se pudo detectar la cara', err);
        }
        const wanted = type === 'teeth' ? 'magic-teeth' : 'magic-eyes';
        DOM.loadingOverlay.classList.add('hidden');
        DOM.loadingText.textContent = "Cargando...";
        DOM.adjMagicIntensity.disabled = false;
        if (currentTool !== wanted) return;

        whitenCache = buildWhitenCache(type, faces);
        let found = 0;
        if (whitenCache.mask) for (let i = 0; i < whitenCache.mask.length; i += 3) if (whitenCache.mask[i] > 0.3) { found++; if (found > 20) break; }
        const hasIris = whitenCache.iris && whitenCache.iris.some(v => v > 0.5);

        if (type === 'teeth') {
            if (found > 20) showToast("Dientes encontrados ✓ (si falta alguno, píntalo)");
            else if (whitenCache.faces) showToast("No se ven dientes: si los hay, píntalos con el dedo");
            else showToast("No he encontrado la cara: pinta los dientes con el dedo");
        } else {
            if (found > 20 || hasIris) showToast("Ojos encontrados ✓ (si falta algo, píntalo)");
            else showToast("No he encontrado los ojos: píntalos con el dedo");
        }
        // Enseñar la zona encontrada (blanco + iris)
        if (whitenCache.mask) {
            const show = new Float32Array(whitenCache.mask);
            if (whitenCache.iris) for (let i = 0; i < show.length; i++) show[i] = Math.max(show[i], whitenCache.iris[i] * 0.8);
            flashMask(show, whitenCache.w, whitenCache.h, type === 'teeth' ? [80, 170, 255] : [120, 220, 120]);
        }
        DOM.adjMagicIntensity.value = 60;
        DOM.valMagicIntensity.textContent = 60;
        applyAdjustments();
    }

    // "Carnet Mágico": un solo toque que junta todo
    //  1. Más luz y color (sin pasarse)
    //  2. Piel lisa en todas las caras
    //  3. Dientes más blancos
    //  4. Ojos más claros y con más color
    function applyLightAndColor(ctxTarget) {
        const w = ctxTarget.canvas.width, h = ctxTarget.canvas.height;
        const img = ctxTarget.getImageData(0, 0, w, h);
        const d = img.data;
        // Tabla de luz: aclara medios tonos y sombras, respeta las luces
        const curve = new Uint8ClampedArray(256);
        for (let v = 0; v < 256; v++) {
            let x = v / 255;
            x = Math.pow(x, 0.86);                       // más luz
            x = x + 0.06 * Math.sin((x - 0.5) * Math.PI) * (1 - Math.abs(x - 0.5) * 2) ; // un poco de contraste
            curve[v] = Math.round(Math.min(1, Math.max(0, x)) * 255);
        }
        for (let j = 0; j < d.length; j += 4) {
            let r = curve[d[j]], g = curve[d[j + 1]], b = curve[d[j + 2]];
            // Viveza: sube el color de lo que está apagado, sin saturar lo que ya es vivo
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            const sat = (max - min) / 255;
            const L = 0.299 * r + 0.587 * g + 0.114 * b;
            const boost = 0.32 * (1 - sat);
            r = L + (r - L) * (1 + boost);
            g = L + (g - L) * (1 + boost);
            b = L + (b - L) * (1 + boost);
            d[j] = r; d[j + 1] = g; d[j + 2] = b;
        }
        ctxTarget.putImageData(img, 0, 0);
    }

    async function runMagic() {
        if (!hasImage) return;
        if (currentTool) toggleTool(currentTool);
        maskCtx.clearRect(0, 0, DOM.maskCanvas.width, DOM.maskCanvas.height);

        DOM.loadingOverlay.classList.remove('hidden');
        DOM.loadingText.textContent = "Buscando caras...";
        await new Promise(r => setTimeout(r, 30));

        // Buscar caras sobre la foto tal como está
        let skin = null, parts = null;
        try {
            if (typeof window.detectSkinMask === 'function') skin = await window.detectSkinMask(DOM.mainCanvas);
            if (typeof window.detectFaceParts === 'function') parts = await window.detectFaceParts(DOM.mainCanvas);
        } catch (err) {
            console.warn('La IA no ha podido analizar la foto', err);
        }
        const faces = (skin && skin.faces) || (parts && parts.length) || 0;

        try {
            DOM.loadingText.textContent = "Dando luz y color...";
            await new Promise(r => setTimeout(r, 30));
            applyLightAndColor(ctx);

            if (faces > 0 && skin && skin.mask) {
                DOM.loadingText.textContent = "Alisando la piel...";
                await new Promise(r => setTimeout(r, 30));
                skinCache = buildSkinCache(ctx, skin);
                applySmartSkinSmoothing(ctx, 60);
                skinCache = null;
            }
            if (parts && parts.length) {
                DOM.loadingText.textContent = "Dientes y ojos...";
                await new Promise(r => setTimeout(r, 30));
                whitenCache = buildWhitenCache('teeth', parts);
                applySmartWhiten(ctx, 55, 'teeth');
                whitenCache = buildWhitenCache('eyes', parts);
                applySmartWhiten(ctx, 50, 'eyes');
                whitenCache = null;
            }
            commitCanvas("Carnet Mágico");

            if (faces === 1) showToast("¡Magia aplicada! Luz, color, piel, dientes y ojos ✓");
            else if (faces > 1) showToast(`¡Magia aplicada a ${faces} personas! ✓`);
            else showToast("No he encontrado caras: se ha mejorado la luz y el color");
        } catch (err) {
            console.error('Error en Carnet Mágico', err);
            showToast("No se ha podido aplicar la magia");
        } finally {
            skinCache = null; whitenCache = null;
            DOM.loadingOverlay.classList.add('hidden');
            DOM.loadingText.textContent = "Cargando...";
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
        skinCache = null;
        whitenCache = null;
        maskCtx.clearRect(0, 0, DOM.maskCanvas.width, DOM.maskCanvas.height);
        DOM.maskCanvas.style.opacity = '';
        DOM.adjMagicIntensity.disabled = false;
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
                skinCache = null;
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
            if (tool === 'magic-skin') prepareSkinTool();
            else if (tool === 'magic-teeth') prepareWhitenTool('teeth');
            else if (tool === 'magic-eyes') prepareWhitenTool('eyes');
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
                updateTextPreview().then(() => {
                    const b = getImageVisualBounds();
                    const cont = DOM.canvasContainer.getBoundingClientRect();
                    DOM.textOverlay.style.left = (b.left - cont.left + b.width / 2 - DOM.textOverlay.offsetWidth / 2) + 'px';
                    DOM.textOverlay.style.top = (b.top - cont.top + b.height / 2 - DOM.textOverlay.offsetHeight / 2) + 'px';
                });
            }
            break;
    }
        
        if (tool === 'clone' || tool === 'blur') {
            // El pincel se tiene que ver (Dientes/Ojos lo dejan invisible) y empezar limpio
            maskCtx.clearRect(0, 0, DOM.maskCanvas.width, DOM.maskCanvas.height);
            DOM.maskCanvas.style.transition = '';
            DOM.maskCanvas.style.opacity = '1';
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
// --- Temas de la app (Configuración) ---
// bg: fondo · accent: color principal · hover: color suave · text: texto · muted: texto secundario
// on: color del texto encima del color principal · logoA / logoB: colores del logo "Dif" + "uminar"
const THEMES = [
    { id: 'rosa',        name: 'Rosa',             bg: '#fff5f7', accent: '#f472b6', hover: '#fbcfe8', text: '#4c0519', muted: '#9f1239', on: '#ffffff', logoA: '#ec4899', logoB: '#4c0519' },
    { id: 'marron',      name: 'Marrón',           bg: '#fdfaf7', accent: '#a47148', hover: '#ead7c5', text: '#3b2a21', muted: '#7c5a43', on: '#ffffff', logoA: '#a47148', logoB: '#3b2a21' },
    { id: 'lima',        name: 'Verde lima',       bg: '#fbffef', accent: '#84cc16', hover: '#d9f99d', text: '#1a2e05', muted: '#3f6212', on: '#1a2e05', logoA: '#65a30d', logoB: '#1a2e05' },
    { id: 'verde',       name: 'Verde',            bg: '#f3fbf6', accent: '#16a34a', hover: '#bbf7d0', text: '#052e16', muted: '#166534', on: '#ffffff', logoA: '#16a34a', logoB: '#052e16' },
    { id: 'amarillo',    name: 'Amarillo',         bg: '#fffdf0', accent: '#facc15', hover: '#fef08a', text: '#422006', muted: '#854d0e', on: '#422006', logoA: '#eab308', logoB: '#422006' },
    { id: 'naranja',     name: 'Naranja',          bg: '#fff8f1', accent: '#f97316', hover: '#fed7aa', text: '#431407', muted: '#9a3412', on: '#ffffff', logoA: '#f97316', logoB: '#431407' },
    { id: 'azul',        name: 'Azul',             bg: '#f5f8ff', accent: '#2563eb', hover: '#bfdbfe', text: '#172554', muted: '#1e40af', on: '#ffffff', logoA: '#2563eb', logoB: '#172554' },
    { id: 'azulpastel',  name: 'Azul pastel',      bg: '#f7fbff', accent: '#93c5fd', hover: '#dbeafe', text: '#1e3a5f', muted: '#3b6a9a', on: '#1e3a5f', logoA: '#60a5fa', logoB: '#1e3a5f' },
    { id: 'gris',        name: 'Gris',             bg: '#fafafa', accent: '#71717a', hover: '#e4e4e7', text: '#18181b', muted: '#52525b', on: '#ffffff', logoA: '#71717a', logoB: '#18181b' },
    { id: 'grisrojo',    name: 'Gris y rojo',      bg: '#fafafa', accent: '#dc2626', hover: '#e5e7eb', text: '#27272a', muted: '#6b7280', on: '#ffffff', logoA: '#dc2626', logoB: '#3f3f46' },
    { id: 'negro',       name: 'Negro',            bg: '#ffffff', accent: '#111111', hover: '#e5e5e5', text: '#111111', muted: '#525252', on: '#ffffff', logoA: '#111111', logoB: '#737373' },
    { id: 'lila',        name: 'Lila',             bg: '#faf7ff', accent: '#a78bfa', hover: '#ede9fe', text: '#2e1065', muted: '#6d28d9', on: '#ffffff', logoA: '#8b5cf6', logoB: '#2e1065' },
    { id: 'morado',      name: 'Morado',           bg: '#fbf7fd', accent: '#7e22ce', hover: '#e9d5ff', text: '#2e1065', muted: '#6b21a8', on: '#ffffff', logoA: '#9333ea', logoB: '#2e1065' },
    { id: 'turquesa',    name: 'Turquesa',         bg: '#f2fdfd', accent: '#14b8a6', hover: '#ccfbf1', text: '#042f2e', muted: '#115e59', on: '#ffffff', logoA: '#0d9488', logoB: '#042f2e' },
    { id: 'menta',       name: 'Menta',            bg: '#f5fffa', accent: '#6ee7b7', hover: '#d1fae5', text: '#064e3b', muted: '#047857', on: '#064e3b', logoA: '#34d399', logoB: '#064e3b' },
    { id: 'coral',       name: 'Coral',            bg: '#fff7f5', accent: '#fb7185', hover: '#ffe4e6', text: '#4c0519', muted: '#be123c', on: '#ffffff', logoA: '#f43f5e', logoB: '#4c0519' },
    { id: 'burdeos',     name: 'Burdeos',          bg: '#fdf7f8', accent: '#9f1239', hover: '#fecdd3', text: '#3b0712', muted: '#881337', on: '#ffffff', logoA: '#9f1239', logoB: '#3b0712' },
    { id: 'marino',      name: 'Azul marino',      bg: '#f6f8fc', accent: '#1e3a8a', hover: '#c7d2fe', text: '#0f172a', muted: '#334155', on: '#ffffff', logoA: '#1e3a8a', logoB: '#64748b' },
    { id: 'oliva',       name: 'Verde oliva',      bg: '#fafbf3', accent: '#6b7f2a', hover: '#e3e8c4', text: '#232b0c', muted: '#4d5c1c', on: '#ffffff', logoA: '#6b7f2a', logoB: '#232b0c' },
    { id: 'arena',       name: 'Arena',            bg: '#fffcf6', accent: '#d6b98c', hover: '#f3e8d5', text: '#3d2f1b', muted: '#8a6d45', on: '#3d2f1b', logoA: '#c9a36a', logoB: '#3d2f1b' },
    { id: 'cielo',       name: 'Cielo',            bg: '#f5fcff', accent: '#0ea5e9', hover: '#bae6fd', text: '#082f49', muted: '#0369a1', on: '#ffffff', logoA: '#0ea5e9', logoB: '#082f49' },
    { id: 'chicle',      name: 'Chicle',           bg: '#fff7fd', accent: '#e879f9', hover: '#fae8ff', text: '#4a044e', muted: '#a21caf', on: '#ffffff', logoA: '#d946ef', logoB: '#4a044e' }
];

function applyTheme(id) {
    const t = THEMES.find(x => x.id === id) || THEMES[0];
    const r = document.documentElement.style;
    r.setProperty('--bg-color', t.bg);
    r.setProperty('--accent-color', t.accent);
    r.setProperty('--accent-hover', t.hover);
    r.setProperty('--text-main', t.text);
    r.setProperty('--text-muted', t.muted);
    r.setProperty('--on-accent', t.on);
    r.setProperty('--logo-a', t.logoA);
    r.setProperty('--logo-b', t.logoB);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.bg);
    try { localStorage.setItem('difuminar-theme', t.id); } catch (e) {}
    document.querySelectorAll('.theme-swatch').forEach(b => b.classList.toggle('active', b.dataset.theme === t.id));
}

(function setupSettings() {
    let saved = 'rosa';
    try { saved = localStorage.getItem('difuminar-theme') || 'rosa'; } catch (e) {}
    const grid = document.getElementById('theme-grid');
    if (grid) {
        THEMES.forEach(t => {
            const b = document.createElement('button');
            b.className = 'theme-swatch';
            b.dataset.theme = t.id;
            b.innerHTML = `<span class="swatch-dot" style="background: linear-gradient(135deg, ${t.accent} 0 50%, ${t.bg} 50% 100%); border-color: ${t.hover}"></span><span class="swatch-name">${t.name}</span>`;
            b.addEventListener('click', () => { playClickSound(); applyTheme(t.id); });
            grid.appendChild(b);
        });
    }
    applyTheme(saved);
    const modal = document.getElementById('settings-modal');
    const open = document.getElementById('btn-settings');
    const close = document.getElementById('btn-close-settings');
    if (open && modal) open.addEventListener('click', () => modal.classList.add('active'));
    if (close && modal) close.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
})();

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
    const maskImgData = maskCtx.getImageData(0, 0, w, h);
    let painted = false;
    for (let i = 3; i < maskImgData.data.length; i += 4) {
        if (maskImgData.data[i] > 0) { painted = true; break; }
    }
    if (!painted) {
        showToast("Primero pinta la zona que quieres difuminar");
        return;
    }

    // Difuminado proporcional al tamaño de la foto (antes era fijo y casi no se notaba)
    const blurAmt = Math.max(10, Math.round(Math.max(w, h) / 70));
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w; tempCanvas.height = h;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.filter = `blur(${blurAmt}px)`;
    tCtx.drawImage(ctx.canvas, 0, 0);
    const blurredData = tCtx.getImageData(0, 0, w, h);
    const mainImgData = ctx.getImageData(0, 0, w, h);

    // Bordes suaves para que no se note dónde empieza el difuminado
    const softCanvas = document.createElement('canvas');
    softCanvas.width = w; softCanvas.height = h;
    const sCtx = softCanvas.getContext('2d');
    sCtx.filter = `blur(${Math.max(2, Math.round(blurAmt / 3))}px)`;
    sCtx.drawImage(DOM.maskCanvas, 0, 0);
    const soft = sCtx.getImageData(0, 0, w, h).data;

    for (let i = 0; i < w * h; i++) {
        const px = i * 4;
        // El pincel pinta al 60% de opacidad: lo pintado cuenta como 100%
        const blend = Math.min(1, soft[px + 3] / 140);
        if (blend <= 0) continue;
        mainImgData.data[px] = mainImgData.data[px] * (1 - blend) + blurredData.data[px] * blend;
        mainImgData.data[px + 1] = mainImgData.data[px + 1] * (1 - blend) + blurredData.data[px + 1] * blend;
        mainImgData.data[px + 2] = mainImgData.data[px + 2] * (1 - blend) + blurredData.data[px + 2] * blend;
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

// Rellena la zona pintada con lo que hay alrededor.
// Se trabaja por niveles (de pequeño a grande) para que el relleno sea suave y completo,
// y al final se añade un poco de "grano" para que no quede una mancha lisa.
function applyInpainting(w, h) {
    const maskData = maskCtx.getImageData(0, 0, w, h).data;
    const mainImgData = ctx.getImageData(0, 0, w, h);
    const data = mainImgData.data;

    const hole = new Uint8Array(w * h);
    let count = 0;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let i = 0; i < w * h; i++) {
        if (maskData[i * 4 + 3] > 40) {
            hole[i] = 1; count++;
            const x = i % w, y = (i / w) | 0;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
    }
    if (count === 0) {
        showToast("Primero pinta sobre lo que quieres borrar");
        return;
    }

    // Trabajar solo en un recuadro alrededor de lo pintado (más rápido)
    const pad = Math.max(24, Math.round(Math.max(maxX - minX, maxY - minY) * 0.5));
    const x0 = Math.max(0, minX - pad), y0 = Math.max(0, minY - pad);
    const x1 = Math.min(w - 1, maxX + pad), y1 = Math.min(h - 1, maxY + pad);
    const W = x1 - x0 + 1, H = y1 - y0 + 1;

    // Nivel 0 (tamaño real)
    const level0 = { w: W, h: H, r: new Float32Array(W * H), g: new Float32Array(W * H), b: new Float32Array(W * H), m: new Uint8Array(W * H) };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const gi = (y + y0) * w + (x + x0), li = y * W + x, j = gi * 4;
        level0.r[li] = data[j]; level0.g[li] = data[j + 1]; level0.b[li] = data[j + 2];
        level0.m[li] = hole[gi];
    }

    // Pirámide: cada nivel a la mitad, usando solo los píxeles conocidos
    const levels = [level0];
    while (levels.length < 10) {
        const L = levels[levels.length - 1];
        if (L.w <= 8 || L.h <= 8) break;
        let anyHole = false;
        for (let i = 0; i < L.m.length; i++) if (L.m[i]) { anyHole = true; break; }
        if (!anyHole) break;
        const nw = Math.ceil(L.w / 2), nh = Math.ceil(L.h / 2);
        const N = { w: nw, h: nh, r: new Float32Array(nw * nh), g: new Float32Array(nw * nh), b: new Float32Array(nw * nh), m: new Uint8Array(nw * nh) };
        for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) {
            let r = 0, g = 0, b = 0, n = 0;
            for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
                const sx = x * 2 + dx, sy = y * 2 + dy;
                if (sx >= L.w || sy >= L.h) continue;
                const si = sy * L.w + sx;
                if (L.m[si]) continue;
                r += L.r[si]; g += L.g[si]; b += L.b[si]; n++;
            }
            const i = y * nw + x;
            if (n) { N.r[i] = r / n; N.g[i] = g / n; N.b[i] = b / n; } else N.m[i] = 1;
        }
        levels.push(N);
    }

    // Nivel más pequeño: rellenar desde los bordes hacia dentro
    const top = levels[levels.length - 1];
    {
        const known = top.m.map(v => v ? 0 : 1);
        let pending = [];
        for (let i = 0; i < top.m.length; i++) if (top.m[i]) pending.push(i);
        let guard = 0;
        while (pending.length && guard++ < 5000) {
            const done = [], rest = [];
            for (const i of pending) {
                const x = i % top.w, y = (i / top.w) | 0;
                let r = 0, g = 0, b = 0, n = 0;
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx, ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= top.w || ny >= top.h) continue;
                    const k = ny * top.w + nx;
                    if (!known[k]) continue;
                    r += top.r[k]; g += top.g[k]; b += top.b[k]; n++;
                }
                if (n) { top.r[i] = r / n; top.g[i] = g / n; top.b[i] = b / n; done.push(i); } else rest.push(i);
            }
            if (!done.length) break;
            done.forEach(i => known[i] = 1);
            pending = rest;
        }
    }

    // Subir de nivel: partir del nivel inferior y suavizar solo dentro del hueco
    for (let li = levels.length - 2; li >= 0; li--) {
        const L = levels[li], C = levels[li + 1];
        const idx = [];
        for (let i = 0; i < L.m.length; i++) {
            if (!L.m[i]) continue;
            const x = i % L.w, y = (i / L.w) | 0;
            const ci = Math.min(C.h - 1, y >> 1) * C.w + Math.min(C.w - 1, x >> 1);
            L.r[i] = C.r[ci]; L.g[i] = C.g[ci]; L.b[i] = C.b[ci];
            idx.push(i);
        }
        for (let it = 0; it < 12; it++) {
            for (const i of idx) {
                const x = i % L.w, y = (i / L.w) | 0;
                let r = 0, g = 0, b = 0, n = 0;
                if (x > 0) { r += L.r[i - 1]; g += L.g[i - 1]; b += L.b[i - 1]; n++; }
                if (x < L.w - 1) { r += L.r[i + 1]; g += L.g[i + 1]; b += L.b[i + 1]; n++; }
                if (y > 0) { r += L.r[i - L.w]; g += L.g[i - L.w]; b += L.b[i - L.w]; n++; }
                if (y < L.h - 1) { r += L.r[i + L.w]; g += L.g[i + L.w]; b += L.b[i + L.w]; n++; }
                L.r[i] = r / n; L.g[i] = g / n; L.b[i] = b / n;
            }
        }
    }

    // Grano: medir la textura del borde y añadir una parecida dentro
    let grain = 0, gn = 0;
    for (let y = 1; y < H - 1; y += 2) for (let x = 1; x < W - 1; x += 2) {
        const i = y * W + x;
        if (level0.m[i]) continue;
        const nearHole = level0.m[i - 3] || level0.m[i + 3] || (i - 3 * W >= 0 && level0.m[i - 3 * W]) || (i + 3 * W < level0.m.length && level0.m[i + 3 * W]);
        if (!nearHole) continue;
        const l = level0.r[i] * 0.299 + level0.g[i] * 0.587 + level0.b[i] * 0.114;
        const la = ((level0.r[i - 1] + level0.r[i + 1] + level0.r[i - W] + level0.r[i + W]) * 0.299 +
                    (level0.g[i - 1] + level0.g[i + 1] + level0.g[i - W] + level0.g[i + W]) * 0.587 +
                    (level0.b[i - 1] + level0.b[i + 1] + level0.b[i - W] + level0.b[i + W]) * 0.114) / 4;
        grain += Math.abs(l - la); gn++;
    }
    grain = gn ? Math.min(14, grain / gn) * 1.6 : 0;

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const li = y * W + x;
        if (!level0.m[li]) continue;
        const j = ((y + y0) * w + (x + x0)) * 4;
        const n = (Math.random() - 0.5) * 2 * grain;
        data[j] = level0.r[li] + n;
        data[j + 1] = level0.g[li] + n;
        data[j + 2] = level0.b[li] + n;
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

// Vista previa del texto: se dibuja con el mismo motor que se usa al fijarlo (textstyles.js)
let textPreviewToken = 0;
async function updateTextPreview() {
    if (!DOM.textOverlay || !window.TextStyles) return;
    const token = ++textPreviewToken;
    const text = DOM.textInput.value || "Tu texto";
    const size = parseInt(DOM.textSize.value);
    await window.TextStyles.ensureFonts(DOM.textFont.value);
    if (token !== textPreviewToken) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const rendered = window.TextStyles.render(currentTextStyle, text, { size: size * dpr, font: DOM.textFont.value, color: DOM.textColor.value });
    const contentDiv = document.getElementById('text-overlay-content');
    if (!contentDiv) return;

    // Mantener el centro del texto en el mismo sitio al cambiar de tamaño o estilo
    const oldW = DOM.textOverlay.offsetWidth, oldH = DOM.textOverlay.offsetHeight;
    rendered.style.width = (rendered.width / dpr) + 'px';
    rendered.style.height = (rendered.height / dpr) + 'px';
    rendered.style.display = 'block';
    rendered.style.pointerEvents = 'none';
    contentDiv.style.cssText = 'line-height:0;';
    contentDiv.style.opacity = DOM.textOpacity.value / 100;
    contentDiv.replaceChildren(rendered);
    if (oldW && DOM.textOverlay.style.left) {
        DOM.textOverlay.style.left = (parseFloat(DOM.textOverlay.style.left) + (oldW - DOM.textOverlay.offsetWidth) / 2) + 'px';
        DOM.textOverlay.style.top = (parseFloat(DOM.textOverlay.style.top) + (oldH - DOM.textOverlay.offsetHeight) / 2) + 'px';
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
        
        // Se dibuja con el mismo motor que la vista previa, a la resolución real de la foto
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = originalImageData.width;
        tempCanvas.height = originalImageData.height;
        const tCtx = tempCanvas.getContext('2d');
        tCtx.putImageData(originalImageData, 0, 0);
        const rendered = window.TextStyles.render(currentTextStyle, text, {
            size: DOM.textSize.value * scaleY, font: DOM.textFont.value, color: DOM.textColor.value
        });
        // Ajuste fino: mismo tamaño en pantalla que la vista previa
        const drawW = textWidthPx, drawH = textHeightPx;
        tCtx.globalAlpha = DOM.textOpacity.value / 100;
        tCtx.drawImage(rendered, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
        tCtx.globalAlpha = 1;
        
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

// Estilos decorativos: botones con una muestra dibujada por el mismo motor
const textStyleList = document.getElementById('text-style-list');

function fillFontSelect() {
    if (!window.TextStyles || !DOM.textFont) return;
    DOM.textFont.innerHTML = '';
    window.TextStyles.fonts.forEach(([name, stack]) => {
        const opt = document.createElement('option');
        opt.value = stack; opt.textContent = name;
        opt.style.fontFamily = stack;
        DOM.textFont.appendChild(opt);
    });
}

function setFontSelect(stack) {
    const exists = Array.from(DOM.textFont.options).some(o => o.value === stack);
    if (!exists) {
        const opt = document.createElement('option');
        opt.value = stack; opt.textContent = 'Del estilo';
        DOM.textFont.appendChild(opt);
    }
    DOM.textFont.value = stack;
}

async function buildTextStyleButtons() {
    if (!textStyleList || !window.TextStyles) return;
    await window.TextStyles.ensureFonts();
    const color = DOM.textColor.value;
    const dark = window.TextStyles.luminance(color) > 0.55;
    textStyleList.innerHTML = '';
    window.TextStyles.list.forEach(st => {
        const btn = document.createElement('button');
        btn.className = 'text-style-btn' + (st.id === currentTextStyle ? ' active' : '');
        btn.dataset.style = st.id;
        btn.style.background = dark ? '#3b3b3b' : '#f1f1f1';
        const img = window.TextStyles.render(st.id, st.sample, { size: 26, font: st.font, color });
        img.className = 'text-style-thumb';
        const label = document.createElement('span');
        label.textContent = st.name;
        btn.append(img, label);
        btn.addEventListener('click', () => selectTextStyle(st.id));
        textStyleList.appendChild(btn);
    });
}

function selectTextStyle(id) {
    const st = window.TextStyles.list.find(s => s.id === id);
    if (!st) return;
    currentTextStyle = id;
    textStyleList.querySelectorAll('.text-style-btn').forEach(b => b.classList.toggle('active', b.dataset.style === id));
    setFontSelect(st.font);

    // Repartir en líneas automáticamente si el estilo lo pide
    const text = DOM.textInput.value.trim();
    if (text && !text.includes('\n') && text.includes(' ')) {
        const words = text.split(/\s+/);
        const split = n => {
            const out = Array(n).fill('');
            words.forEach((w, i) => { const k = Math.floor(i / words.length * n); out[k] += (out[k] ? ' ' : '') + w; });
            return out.join('\n');
        };
        if (id === 'poster') DOM.textInput.value = split(Math.min(words.length, 5));
        else if (['bloque', 'accion', 'sombra3d', 'cinta', 'elegante', 'sello', 'etiqueta', 'dymo'].includes(id)) DOM.textInput.value = split(Math.min(words.length, 3));
        else if (['cita', 'romantico'].includes(id)) DOM.textInput.value = split(Math.min(words.length, 2));
        else if (id === 'vertical') DOM.textInput.value = words.join('\n');
    }
    updateTextPreview();
}

fillFontSelect();
if (DOM.textColor) {
    let colorTimer = null;
    DOM.textColor.addEventListener('input', () => {
        clearTimeout(colorTimer);
        colorTimer = setTimeout(buildTextStyleButtons, 150);
    });
}
if (DOM.btnText) DOM.btnText.addEventListener('click', () => { if (hasImage) buildTextStyleButtons(); });

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

// --- LOGICA DE EXPORTACION PDF A WORD / PAGES (EDITABLE) ---
// Saca del PDF el texto (con tamaño, negrita y cursiva) y las fotos por separado,
// para que el Word se pueda editar. Las páginas escaneadas (sin texto) se ponen como imagen.

const PT_TO_PX = 96 / 72;      // puntos PDF -> píxeles de Word
const PT_TO_TWIP = 20;         // puntos PDF -> unidades de Word

function cleanFontName(raw) {
    if (!raw) return undefined;
    let name = String(raw).replace(/^[A-Z]{6}\+/, '');           // quitar prefijo de subconjunto
    name = name.split(/[-,]/)[0].replace(/(PSMT|PS|MT)$/,'');    // quitar estilo y sufijos
    const known = { Helvetica: 'Arial', Times: 'Times New Roman', TimesNewRoman: 'Times New Roman', Courier: 'Courier New', CourierNew: 'Courier New' };
    if (known[name]) return known[name];
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
    return name || undefined;
}

function getPdfObj(objs, id) {
    return new Promise(resolve => {
        try { objs.get(id, resolve); } catch (e) { resolve(null); }
    });
}

// Convierte una imagen interna de pdf.js en PNG/JPEG
async function pdfImageToBlob(img) {
    if (!img) return null;
    const w = img.width || (img.bitmap && img.bitmap.width);
    const h = img.height || (img.bitmap && img.bitmap.height);
    if (!w || !h) return null;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const cx = c.getContext('2d');
    if (img.bitmap) {
        cx.drawImage(img.bitmap, 0, 0);
    } else if (img.data) {
        const out = cx.createImageData(w, h);
        const src = img.data, dst = out.data;
        if (img.kind === 3) {                         // RGBA
            dst.set(src.subarray(0, dst.length));
        } else if (img.kind === 2) {                  // RGB
            for (let i = 0, j = 0; j < dst.length; i += 3, j += 4) {
                dst[j] = src[i]; dst[j + 1] = src[i + 1]; dst[j + 2] = src[i + 2]; dst[j + 3] = 255;
            }
        } else if (img.kind === 1) {                  // blanco y negro, 1 bit
            const rowBytes = (w + 7) >> 3;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const bit = (src[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1;
                    const v = bit ? 255 : 0, j = (y * w + x) * 4;
                    dst[j] = dst[j + 1] = dst[j + 2] = v; dst[j + 3] = 255;
                }
            }
        } else {
            return null;
        }
        cx.putImageData(out, 0, 0);
    } else {
        return null;
    }
    return canvasToBlob(c, 'image/png');
}

function multiplyMatrix(m1, m2) {
    return [
        m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1],
        m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3],
        m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
    ];
}

// Fotos de la página con su posición (en puntos, desde arriba)
async function extractPageImages(page, opList, pdfjsLib, viewport) {
    const OPS = pdfjsLib.OPS;
    const images = [];
    let ctm = [1, 0, 0, 1, 0, 0];
    const stack = [];
    for (let i = 0; i < opList.fnArray.length; i++) {
        const fn = opList.fnArray[i], args = opList.argsArray[i];
        if (fn === OPS.save) stack.push(ctm.slice());
        else if (fn === OPS.restore) ctm = stack.pop() || [1, 0, 0, 1, 0, 0];
        else if (fn === OPS.transform) ctm = multiplyMatrix(ctm, args);
        else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
            const m = multiplyMatrix(viewport.transform, ctm);
            const wPt = Math.hypot(m[0], m[1]);
            const hPt = Math.hypot(m[2], m[3]);
            if (wPt < 15 || hPt < 15) continue;               // iconos y adornos diminutos
            const xs = [m[4], m[4] + m[0], m[4] + m[2], m[4] + m[0] + m[2]];
            const ys = [m[5], m[5] + m[1], m[5] + m[3], m[5] + m[1] + m[3]];
            let imgObj = null;
            if (fn === OPS.paintInlineImageXObject) imgObj = args[0];
            else {
                const id = args[0];
                imgObj = id.startsWith('g_') ? await getPdfObj(page.commonObjs, id) : await getPdfObj(page.objs, id);
            }
            const blob = await pdfImageToBlob(imgObj);
            if (!blob) continue;
            images.push({ type: 'image', top: Math.min(...ys), bottom: Math.max(...ys), left: Math.min(...xs), width: wPt, height: hPt, blob });
        }
    }
    return images;
}

// Texto de la página agrupado en líneas y párrafos
async function extractPageParagraphs(page, pdfjsLib, viewport) {
    const content = await page.getTextContent();
    const items = [];
    for (const it of content.items) {
        if (!it.str || !it.str.length) continue;
        const tx = pdfjsLib.Util.transform(viewport.transform, it.transform);
        const size = Math.hypot(tx[2], tx[3]);
        if (size < 1) continue;
        let font = null;
        try { if (page.commonObjs.has(it.fontName)) font = page.commonObjs.get(it.fontName); } catch (e) {}
        const fontName = (font && font.name) || '';
        items.push({
            str: it.str, x: tx[4], y: tx[5], width: it.width * viewport.scale, size,
            bold: !!(font && (font.bold || font.black)) || /bold|black|heavy|semibold/i.test(fontName),
            italic: !!(font && font.italic) || /italic|oblique/i.test(fontName),
            font: cleanFontName(fontName) || (content.styles[it.fontName] && content.styles[it.fontName].fontFamily !== 'sans-serif' ? content.styles[it.fontName].fontFamily : undefined),
            eol: it.hasEOL
        });
    }

    // Líneas: trozos a la misma altura
    items.sort((a, b) => (Math.abs(a.y - b.y) < Math.min(a.size, b.size) * 0.5 ? a.x - b.x : a.y - b.y));
    const lines = [];
    for (const it of items) {
        const line = lines[lines.length - 1];
        if (line && Math.abs(line.y - it.y) < Math.min(line.size, it.size) * 0.5) {
            const prev = line.runs[line.runs.length - 1];
            const gap = it.x - (prev.x + prev.width);
            if (gap > it.size * 0.15 && !/\s$/.test(prev.str) && !/^\s/.test(it.str)) line.runs.push({ ...it, str: ' ', width: 0 });
            line.runs.push(it);
            line.right = Math.max(line.right, it.x + it.width);
            line.size = Math.max(line.size, it.size);
        } else {
            lines.push({ y: it.y, x: it.x, right: it.x + it.width, size: it.size, runs: [it] });
        }
    }

    // Párrafos: líneas seguidas, con el mismo tamaño y poca separación
    const pageW = viewport.width;
    const paras = [];
    for (const line of lines) {
        const para = paras[paras.length - 1];
        const lineCenter = (line.x + line.right) / 2;
        const centered = Math.abs(lineCenter - pageW / 2) < pageW * 0.04 && (line.right - line.x) < pageW * 0.7;
        if (para && !para.centered && !centered &&
            Math.abs(para.size - line.size) < 0.6 &&
            line.y - para.lastY < line.size * 1.75 &&
            Math.abs(line.x - para.x) < line.size * 3) {
            const lastRun = para.runs[para.runs.length - 1];
            if (/-$/.test(lastRun.str)) lastRun.str = lastRun.str.slice(0, -1);   // palabra partida
            else if (!/\s$/.test(lastRun.str)) para.runs.push({ ...lastRun, str: ' ' });
            para.runs.push(...line.runs);
            para.lastY = line.y;
            para.bottom = line.y + line.size * 0.25;
        } else {
            paras.push({
                type: 'text', x: line.x, top: line.y - line.size, lastY: line.y, bottom: line.y + line.size * 0.25,
                size: line.size, centered, runs: line.runs.slice()
            });
        }
    }
    return paras;
}

function runsToTextRuns(docx, runs) {
    // Juntar trozos con el mismo estilo
    const merged = [];
    for (const r of runs) {
        const last = merged[merged.length - 1];
        const sameStyle = last && last.bold === r.bold && last.italic === r.italic && Math.abs(last.size - r.size) < 0.6 && last.font === r.font;
        if (sameStyle || (last && r.str === ' ')) last.str += r.str;
        else merged.push({ ...r });
    }
    return merged.map(r => new docx.TextRun({
        text: r.str,
        bold: r.bold || undefined,
        italics: r.italic || undefined,
        size: Math.max(8, Math.round(r.size * 2)),   // medios puntos
        font: r.font
    }));
}

async function convertPdfToEditableDocx(file, onProgress) {
    const [pdfjsLib, docx] = await Promise.all([loadLib('pdfjs'), loadLib('docx')]);
    const buffer = await readFileAs(file, 'buffer');
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer), isOffscreenCanvasSupported: false }).promise;

    let MARGIN_PT = 36; // se ajusta al margen real del PDF en la primera página
    const children = [];
    let firstSize = null;
    let scannedPages = 0;

    for (let p = 1; p <= pdf.numPages; p++) {
        onProgress && onProgress(p, pdf.numPages);
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 1 });
        if (!firstSize) firstSize = { w: viewport.width, h: viewport.height };

        const opList = await page.getOperatorList();          // también carga las fuentes
        const paragraphs = await extractPageParagraphs(page, pdfjsLib, viewport);
        let images = await extractPageImages(page, opList, pdfjsLib, viewport);
        if (p === 1 && paragraphs.length) {
            // Usar el margen izquierdo real del documento (entre 0,6 y 3 cm)
            const minLeft = Math.min(...paragraphs.map(b => b.x), ...images.map(b => b.left));
            MARGIN_PT = Math.max(18, Math.min(85, minLeft));
        }
        const usableW = viewport.width - MARGIN_PT * 2;
        const pageChildren = [];

        if (paragraphs.length === 0) {
            // Página escaneada: no hay texto que extraer, se pone la página como imagen
            scannedPages++;
            const scale = 2;
            const vp = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(vp.width); canvas.height = Math.round(vp.height);
            const pctx = canvas.getContext('2d');
            pctx.fillStyle = '#fff'; pctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: pctx, viewport: vp }).promise;
            images = [{ type: 'image', top: 0, bottom: viewport.height, left: MARGIN_PT, width: usableW, height: usableW * viewport.height / viewport.width, blob: await canvasToBlob(canvas, 'image/jpeg', 0.85) }];
        }

        const blocks = [...paragraphs, ...images].sort((a, b) => a.top - b.top);
        let prevBottom = MARGIN_PT;
        for (const block of blocks) {
            const gapPt = Math.max(0, Math.min(block.top - prevBottom, 200));
            const indentPt = Math.max(0, Math.min((block.left !== undefined ? block.left : block.x) - MARGIN_PT, usableW * 0.6));
            if (block.type === 'image') {
                let w = block.width, h = block.height;
                if (w > usableW) { h = h * usableW / w; w = usableW; }
                const centeredImg = Math.abs((block.left + block.width / 2) - viewport.width / 2) < viewport.width * 0.05;
                pageChildren.push(new docx.Paragraph({
                    alignment: centeredImg ? docx.AlignmentType.CENTER : undefined,
                    indent: centeredImg ? undefined : { left: Math.round(indentPt * PT_TO_TWIP) },
                    spacing: { before: Math.round(gapPt * PT_TO_TWIP * 0.8), after: 0 },
                    children: [new docx.ImageRun({
                        data: await block.blob.arrayBuffer(),
                        transformation: { width: Math.round(w * PT_TO_PX), height: Math.round(h * PT_TO_PX) }
                    })]
                }));
                prevBottom = block.bottom;
            } else {
                pageChildren.push(new docx.Paragraph({
                    alignment: block.centered ? docx.AlignmentType.CENTER : undefined,
                    indent: block.centered ? undefined : { left: Math.round(indentPt * PT_TO_TWIP) },
                    spacing: { before: Math.round(Math.max(0, gapPt - block.size * 0.3) * PT_TO_TWIP * 0.8), after: 0, line: 276 },
                    children: runsToTextRuns(docx, block.runs)
                }));
                prevBottom = block.bottom;
            }
        }

        if (pageChildren.length === 0) pageChildren.push(new docx.Paragraph(''));
        if (p > 1) {
            // Cada página del PDF empieza en una página nueva del Word
            const first = pageChildren[0];
            pageChildren[0] = new docx.Paragraph({ pageBreakBefore: true, children: [] });
            pageChildren.splice(1, 0, first);
        }
        children.push(...pageChildren);
        page.cleanup();
    }

    const doc = new docx.Document({
        creator: 'Difuminar',
        styles: { default: { document: { run: { font: 'Calibri' } } } },
        sections: [{
            properties: {
                page: {
                    size: { width: Math.round(firstSize.w * PT_TO_TWIP), height: Math.round(firstSize.h * PT_TO_TWIP) },
                    margin: { top: MARGIN_PT * PT_TO_TWIP, right: MARGIN_PT * PT_TO_TWIP, bottom: MARGIN_PT * PT_TO_TWIP, left: MARGIN_PT * PT_TO_TWIP }
                }
            },
            children
        }]
    });
    const blob = await docx.Packer.toBlob(doc);
    await pdf.destroy();
    return { blob, scannedPages, totalPages: pdf.numPages };
}
window.convertPdfToEditableDocx = convertPdfToEditableDocx;

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
            DOM.loadingText.textContent = "Convirtiendo a Word editable...";
            try {
                const result = await convertPdfToEditableDocx(file, (i, n) => {
                    DOM.loadingText.textContent = `Convirtiendo página ${i} de ${n}...`;
                });
                await deliverFile(result.blob, `${baseName(file.name)}.docx`);
                if (result.scannedPages === result.totalPages) {
                    showToast("El PDF es escaneado (sin texto): las páginas se han puesto como imagen");
                } else if (result.scannedPages > 0) {
                    showToast(`${result.scannedPages} página(s) escaneadas se han puesto como imagen`);
                } else {
                    showToast("Word creado: puedes cambiar el texto y las fotos");
                }
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
