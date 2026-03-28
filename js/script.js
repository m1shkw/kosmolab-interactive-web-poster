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
    });
});




// I.II подсекция : настройка деталей

const sliderSection = document.querySelector('.subsection-1-2');
const liquidSvg = sliderSection?.querySelector('.slider-liquid-svg');
const liquidGroup = sliderSection?.querySelector('.slider-liquid-group');
const sliders = document.querySelectorAll('.slider-track-container');
const sliderThumbs = [...document.querySelectorAll('.slider-thumb')];

let liquidCircles = [];

/* I.II / 3.3.3.0 liquid кружочки */
if (sliderSection && liquidSvg && liquidGroup && sliderThumbs.length) {
    const svgNS = 'http://www.w3.org/2000/svg';

    sliderThumbs.forEach(() => {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('fill', '#FFFFFF');
        liquidGroup.appendChild(circle);
        liquidCircles.push(circle);
    });
}

/* I.II / 3.3.3.1 обновление liquid формы */
function updateLiquidBlobs() {
    if (!sliderSection || !liquidSvg || !liquidCircles.length) return;

    const sectionRect = sliderSection.getBoundingClientRect();
    liquidSvg.setAttribute('viewBox', `0 0 ${sectionRect.width} ${sectionRect.height}`);

    sliderThumbs.forEach((thumb, index) => {
        const halo = thumb.querySelector('.white-halo');
        if (!halo || !liquidCircles[index]) return;

        const haloRect = halo.getBoundingClientRect();

        const cx = haloRect.left - sectionRect.left + haloRect.width / 2;
        const cy = haloRect.top - sectionRect.top + haloRect.height / 2;
        const radius = haloRect.width / 2;

        liquidCircles[index].setAttribute('cx', cx.toFixed(2));
        liquidCircles[index].setAttribute('cy', cy.toFixed(2));
        liquidCircles[index].setAttribute('r', (radius * 0.8).toFixed(2));
    });
}


/* I.II / 3.3.0 механика слайдера */
sliders.forEach((slider) => {
    const thumb = slider.querySelector('.slider-thumb');
    let isDragging = false;
    let activePointerId = null;

    function updateSliderPosition(clientX) {
        const rect = slider.getBoundingClientRect();
        const rectWidth = rect.width;
        
        const thumbHalfWidthPx = thumb.offsetWidth / 2;

        const minX = thumbHalfWidthPx;
        const maxX = rectWidth - thumbHalfWidthPx;

        let x = clientX - rect.left;

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;

        let percent = (x / rectWidth) * 100;
        thumb.style.left = percent + '%';

        if (thumb.classList.contains('is-animating')) {
            const startTime = performance.now();
            const duration = 400; 

            function animateLiquid() {
                updateLiquidBlobs();
                if (performance.now() - startTime < duration) {
                    requestAnimationFrame(animateLiquid);
                }
            }
            requestAnimationFrame(animateLiquid);
        } else {
            updateLiquidBlobs();
        }
    }

    // драг
    thumb.addEventListener('pointerdown', (e) => {
        isDragging = true;
        activePointerId = e.pointerId;
        thumb.classList.remove('is-animating'); 
        thumb.setPointerCapture(e.pointerId);
        e.stopPropagation(); 
    });

    // клик по линии
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
        if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;
        
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

function initLiquid() {
    updateLiquidBlobs();
    requestAnimationFrame(updateLiquidBlobs);
}
// запуск белых бро
document.addEventListener('DOMContentLoaded', initLiquid);
window.addEventListener('load', initLiquid);
window.addEventListener('resize', updateLiquidBlobs);
setTimeout(initLiquid, 100);




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
