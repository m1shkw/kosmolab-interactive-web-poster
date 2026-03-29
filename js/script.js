// сброс скролла по якорю
const hasVisited = sessionStorage.getItem('wasVisited');

if (!hasVisited) {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    sessionStorage.setItem('wasVisited', 'true');
} else {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        history.replaceState('', document.title, window.location.pathname + window.location.search);
    }
});



// I.I подсекция : выбор планеты

// 0. лого
const logoContainer = document.getElementById('kosmolab-logo-desktop')

// 0.1 массив свгшек (гайд-кружочки)
const logoFiles = [
    'images/0.1-kosmolab.svg',
    'images/0.2-kosmolab.svg',
    'images/0.3-kosmolab.svg'
];

let currentIndex = 0;
let logoTimer;

const logoImg = document.createElement('img');
logoImg.src = logoFiles[0];
logoContainer.appendChild(logoImg);

// 0.2 цикл смены свг
function animateLogo() {
    currentIndex = (currentIndex + 1) % logoFiles.length;
    logoImg.src = logoFiles[currentIndex];
}

// 0.3 запуск остановка анимашки
function startAnimation() { 
    clearInterval(logoTimer); 
    logoTimer = setInterval(animateLogo, 160); 
}
function stopAnimation() { 
    clearInterval(logoTimer); 
    currentIndex = 0;
    logoImg.src = logoFiles[0];
}

logoContainer.addEventListener('mouseenter', startAnimation);
logoContainer.addEventListener('mouseleave', stopAnimation); 



// 1. круглая обводка планет
const circleContainer = document.getElementById('circle-guide');
const circleFiles = [
    'images/1.1-circle-guide.svg',
    'images/1.2-circle-guide.svg',
    'images/1.3-circle-guide.svg'
];
let circleIndex = 0;

const circleImg = document.createElement('img');
circleImg.src = circleFiles[0];
circleContainer.appendChild(circleImg);

function animateCircles() {
    circleIndex = (circleIndex + 1) % circleFiles.length;
    circleImg.src = circleFiles[circleIndex];
}

setInterval(animateCircles, 250);




// 4. кнопки и планеты 
const planetButtons = document.querySelectorAll('.planet-btn');
const planetImages = document.querySelectorAll('.planet-img');
const navPreviewImages = document.querySelectorAll('.nav-preview-img'); 

planetButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 4.1 кнопки
        planetButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const planetType = button.dataset.planet;

        // 4.2 переключение больших планет
        const targetBigId = 'planet-' + planetType; 
        planetImages.forEach(img => {
            img.classList.toggle('active', img.id === targetBigId);
        });

        // 4.3 переключение маленьких планеток
        const targetNavId = 'nav-img-' + planetType;
        navPreviewImages.forEach(navImg => {
            if (navImg.id === targetNavId) {
                navImg.classList.add('active');
            } else {
                navImg.classList.remove('active');
            }
        });

        // 4.3 переключение цветной файнал планетки
        currentPlanetType = button.dataset.planet;
        updateKitPlanetImage(); 
    });
});




// I.I / 6. навигация
const navLinks = document.querySelectorAll('.nav-box .nav-item[href]');
let navResetTimer;

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        clearTimeout(navResetTimer);

        navLinks.forEach(l => {
            l.classList.remove('active-white');
            l.classList.add('inactive-blue');
        });
        
        this.classList.add('active-white');
        this.classList.remove('inactive-blue');

        navResetTimer = setTimeout(() => {
            navLinks.forEach(l => {
                if (l.getAttribute('href') === '#structure') {
                    l.classList.add('active-white');
                    l.classList.remove('inactive-blue');
                } else {
                    l.classList.remove('active-white');
                    l.classList.add('inactive-blue');
                }
            });
        }, 500); 
    });
});





// I.II подсекция : настройка деталей
const sliderSection = document.querySelector('.subsection-1-2');
const liquidCanvas = sliderSection?.querySelector('.slider-metaballs-canvas');
const sliders = sliderSection
    ? [...sliderSection.querySelectorAll('.slider-track-container')]
    : [];
const sliderThumbs = sliders
    .map(slider => slider.querySelector('.slider-thumb'))
    .filter(Boolean);

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.tx = x;
        this.ty = y;
        this.tr = r;
    }

    snap() {
        this.x = this.tx;
        this.y = this.ty;
        this.r = this.tr;
    }

    update(ease = 0.18) {
        this.x += (this.tx - this.x) * ease;
        this.y += (this.ty - this.y) * ease;
        this.r += (this.tr - this.r) * ease;
    }
}

const metaballs = {
    canvas: liquidCanvas,
    ctx: liquidCanvas ? liquidCanvas.getContext('2d') : null,
    dpr: 1,
    balls: [],
    started: false,

    resize() {
        if (!this.canvas || !this.ctx || !sliderSection) return;

        const rect = sliderSection.getBoundingClientRect();
        this.dpr = Math.max(window.devicePixelRatio || 1, 1);

        const width = Math.max(1, Math.round(rect.width * this.dpr));
        const height = Math.max(1, Math.round(rect.height * this.dpr));

        if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        }
    },

    syncTargetsFromDOM(forceSnap = false) {
        if (!sliderSection) return;

        const sectionRect = sliderSection.getBoundingClientRect();

        sliderThumbs.forEach((thumb, index) => {
        const halo = thumb.querySelector('.white-halo');
        if (!halo) return;

        const haloRect = halo.getBoundingClientRect();
        const cx = haloRect.left - sectionRect.left + haloRect.width / 2;
        const cy = haloRect.top - sectionRect.top + haloRect.height / 2;
        const radius = haloRect.width * 0.4;

        if (!this.balls[index]) {
            this.balls[index] = new Ball(cx, cy, radius);
        }

        const ball = this.balls[index];
        ball.tx = cx;
        ball.ty = cy;
        ball.tr = radius;

        if (forceSnap) {
            ball.snap();
        }
        });
    },

    
    drawCircle(ball) {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        this.ctx.fill();
    },

    drawBridge(a, b) {
        if (!a || !b) return;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);

        // 1. диапазон соединений 
        if (dist > (a.r + b.r) * 5.5) return;

        const angle = Math.atan2(dy, dx);
        
        // 2. расширение основания по мере удаления
        const spread = Math.PI / (3 + (dist / 500)); 
        
        const ax1 = a.x + Math.cos(angle - spread) * a.r;
        const ay1 = a.y + Math.sin(angle - spread) * a.r;
        const ax2 = a.x + Math.cos(angle + spread) * a.r;
        const ay2 = a.y + Math.sin(angle + spread) * a.r;

        const bx1 = b.x + Math.cos(angle + Math.PI + spread) * b.r;
        const by1 = b.y + Math.sin(angle + Math.PI + spread) * b.r;
        const bx2 = b.x + Math.cos(angle + Math.PI - spread) * b.r;
        const by2 = b.y + Math.sin(angle + Math.PI - spread) * b.r;

        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.moveTo(ax1, ay1);
        
        // 3. мега осиная талия
        const waistPinch = dist / 1.5; 
        
        this.ctx.quadraticCurveTo(midX, midY, bx1, by1);
        this.ctx.lineTo(bx2, by2);
        this.ctx.quadraticCurveTo(midX, midY, ax2, ay2);
        
        this.ctx.closePath();
        this.ctx.fill();
    },

    render() {
        if (!this.canvas || !this.ctx) return;

        requestAnimationFrame(() => this.render());

        this.syncTargetsFromDOM();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        // запаздывание за синей точечкой
        this.balls.forEach(ball => ball.update(0.26));

        // белая абстракция
        this.ctx.fillStyle = '#FFFFFF';
        this.balls.forEach(ball => this.drawCircle(ball));
        
        // тоненькие соединения
        this.drawBridge(this.balls[0], this.balls[1]);
        this.drawBridge(this.balls[1], this.balls[2]);
    },

    start() {
        if (this.started || !this.canvas || !this.ctx || !sliderThumbs.length) return;

        this.started = true;
        this.resize();
        this.syncTargetsFromDOM(true);
        this.render();
    }
};

if (sliderSection && liquidCanvas && sliderThumbs.length) {
    metaballs.start();

    window.addEventListener('resize', () => {
        metaballs.resize();
        metaballs.syncTargetsFromDOM(true);
    });
}



/* I.II / 3.3.0 механика слайдера */
sliders.forEach((slider) => {
    const thumb = slider.querySelector('.slider-thumb');
    if (!thumb) return;

    let isDragging = false;
    let activePointerId = null;

    function updateSliderPosition(clientX) {
        const rect = slider.getBoundingClientRect();
        const rectWidth = rect.width;
        const thumbHalfWidthPx = thumb.offsetWidth / 2;

        const minX = thumbHalfWidthPx;
        const maxX = rectWidth - thumbHalfWidthPx;
        const x = clamp(clientX - rect.left, minX, maxX);

        const percent = (x / rectWidth) * 100;
        thumb.style.left = `${percent}%`;
    }

    thumb.addEventListener('pointerdown', (e) => {
        isDragging = true;
        activePointerId = e.pointerId;
        thumb.classList.remove('is-animating');
        thumb.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });

    slider.addEventListener('pointerdown', (e) => {
        if (isDragging) return;

        isDragging = true;
        activePointerId = e.pointerId;
        thumb.classList.add('is-animating');
        updateSliderPosition(e.clientX);

        setTimeout(() => {
        thumb.classList.remove('is-animating');
        }, 400);
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) {
        return;
        }

        thumb.classList.remove('is-animating');
        updateSliderPosition(e.clientX);
    });

    function stopDrag() {
        isDragging = false;
        activePointerId = null;
        thumb.classList.remove('is-animating');
    }

    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
});




/* II.I / 4.1 анимашка обводки цвет кружочка */
const colorCircleImg = document.getElementById('color-circle-guide');
const colorCircleFiles = [
    'images/6.1-color-circle-guide.svg',
    'images/6.2-color-circle-guide.svg',
    'images/6.3-color-circle-guide.svg'
];
let colorCircleIndex = 0;

function animateColorCircles() {
    if (!colorCircleImg) return;
    colorCircleIndex = (colorCircleIndex + 1) % colorCircleFiles.length;
    colorCircleImg.src = colorCircleFiles[colorCircleIndex];
}
setInterval(animateColorCircles, 250);




/* II.I / 5. механика слайдера цвета */
const colorSliderTrack = document.querySelector('.color-slider-track');
const colorThumb = document.querySelector('.main-color-thumb');

if (colorSliderTrack && colorThumb) {
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    const paddingPx = (window.innerWidth / 100) * 2; 

    function updateVerticalPosition(clientY) {
        const rect = colorSliderTrack.getBoundingClientRect();
        const trackHeight = rect.height;

        let y = clientY - rect.top;

        if (y < paddingPx) y = paddingPx;
        if (y > trackHeight - paddingPx) y = trackHeight - paddingPx;

        colorThumb.classList.remove('is-animating');
        colorThumb.style.top = y + 'px';
    }


    const colorStates = {
        blue: {
            hex: '#368AFF',
            name: 'BLUE',
            rgb: { r: 54, g: 138, b: 255 },
            hsb: { h: 215, s: 79, b: 100 }
        },
        orange: {
            hex: '#FF6D2A',
            name: 'ORANGE',
            rgb: { r: 255, g: 109, b: 42 },
            hsb: { h: 19, s: 84, b: 100 }
        }
    };

    function updateInterfaceColor(mode) {
        const data = colorStates[mode];
        const color = data.hex;

        // 1. смена цветов на синенький
        document.querySelector('.main-planet-sphere').style.backgroundColor = color;
        document.querySelector('.js-color-name').style.color = color;
        document.querySelector('.js-color-name').textContent = data.name;

        // 2. обнова текста 
        document.querySelector('.js-color-hex').textContent = data.hex;

        document.querySelector('.js-rgb-r').textContent = data.rgb.r;
        document.querySelector('.js-rgb-g').textContent = data.rgb.g;
        document.querySelector('.js-rgb-b').textContent = data.rgb.b;

        document.querySelector('.js-hsb-h').textContent = data.hsb.h;
        document.querySelector('.js-hsb-s').textContent = data.hsb.s;
        document.querySelector('.js-hsb-b').textContent = data.hsb.b;

        // 3. смена файнал цвет планетки
        currentPlanetColor = mode;
        updateKitPlanetImage();
    }


    function snapToEdge(clientY) {
        const rect = colorSliderTrack.getBoundingClientRect();
        const trackHeight = rect.height;
        const y = clientY - rect.top;

        colorThumb.classList.add('is-animating');

        if (y < trackHeight / 2) {
            colorThumb.style.top = paddingPx + 'px'; 
            updateInterfaceColor('blue');
        } else {
            colorThumb.style.top = (trackHeight - paddingPx) + 'px'; 
            updateInterfaceColor('orange');
        }
    }

    colorThumb.addEventListener('pointerdown', (e) => {
        isDragging = true;
        colorThumb.classList.add('is-dragging');
        colorThumb.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });

    // клик по треку
    colorSliderTrack.addEventListener('pointerdown', (e) => {
        if (isDragging) return;
        snapToEdge(e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updateVerticalPosition(e.clientY);
    });

    window.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        colorThumb.classList.remove('is-dragging');
        snapToEdge(e.clientY); 
    });
}



// II.II / 2. кнопочки набор
document.addEventListener('DOMContentLoaded', () => {
    const kitButtons = document.querySelectorAll('.kit-btn');
    
    // селектор картинки
    const kitMap = {
        'tools': '.js-kit-tools',
        'core': '.js-kit-core',
        'manual': '.js-kit-manual',
        'tubes': '.js-kit-tubes'
    };

    kitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kitKey = button.getAttribute('data-kit');
            const targetImageSelector = kitMap[kitKey];
            const targetImage = document.querySelector(targetImageSelector);

            if (targetImage) {
                button.classList.toggle('active');
                targetImage.classList.toggle('is-visible');
            }
        });
    });
});




// II.II / 3.1 анимашка бокса планеты
const planetFrameImg = document.getElementById('kit-planet-frame');
const planetFrameFiles = [
    'images/9.1-planet-box.svg',
    'images/9.2-planet-box.svg',
    'images/9.3-planet-box.svg'
];
let planetFrameIndex = 0;

function animatePlanetFrame() {
    if (!planetFrameImg) return;
    planetFrameIndex = (planetFrameIndex + 1) % planetFrameFiles.length;
    planetFrameImg.src = planetFrameFiles[planetFrameIndex];
}

setInterval(animatePlanetFrame, 250);

// II.II / 3.2 файнал цвет планетка
let currentPlanetType = 'orbital';
let currentPlanetColor = 'orange';

const kitPlanetResultImg = document.getElementById('kit-planet-result');

function updateKitPlanetImage() {
    if (!kitPlanetResultImg) return;
    
    kitPlanetResultImg.style.opacity = '0';
    
    setTimeout(() => {
        let prefix = '';
        if (currentPlanetType === 'orbital') prefix = '10.1';
        if (currentPlanetType === 'relief') prefix = '10.2';
        if (currentPlanetType === 'selenic') prefix = '10.3';

        const newSrc = `images/${prefix}-planet-${currentPlanetType}-${currentPlanetColor}.png`;
        kitPlanetResultImg.src = newSrc;
        
        kitPlanetResultImg.style.opacity = '1';
    }, 150);
}




// II.II / 4. кнопка отправки : клик
const sendBtn = document.querySelector('.js-send-planet');
const popup = document.getElementById('planet-popup');
const closePopup = document.getElementById('close-popup');

if (sendBtn && popup) {
    sendBtn.addEventListener('click', () => {
        sendBtn.classList.add('active');

        setTimeout(() => {
            sendBtn.classList.remove('active');
            // 5. поп-ап
            popup.classList.add('is-visible');
            // блокируем скролла страницы 
            document.body.style.overflow = 'hidden';
        }, 200);
    });
}

// 5.1 закрытие поп-апа
function closePlanetPopup() {
    if (!popup.classList.contains('is-visible')) return;
    
    popup.classList.add('is-closing');

    setTimeout(() => {
        popup.classList.remove('is-visible');
        popup.classList.remove('is-closing');
        document.body.style.overflow = '';
    }, 200); 
}
// 5.2 закрытие по крестику
if (closePopup) {
    closePopup.addEventListener('click', closePlanetPopup);
}
// 5.3 акрытие по фону
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        closePlanetPopup();
    }
});