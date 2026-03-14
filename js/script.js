// I.I подсекция : выбор планеты


// 0. лого
const logoContainer = document.getElementById('kosmolab-logo');

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




// I.I подсекция : настройка деталей


// 5. слайдер
const sliders = document.querySelectorAll('.slider-track-container');

sliders.forEach(slider => {
    const thumb = slider.querySelector('.slider-thumb');
    let isDragging = false;

    // 1. позиции ползунка
    const updateSliderPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const thumbWidth = thumb.offsetWidth; 
            const halfThumb = thumbWidth / 2; 

            let x = clientX - rect.left;

            // ограничение движения ползунка
            if (x < halfThumb) x = halfThumb;
            if (x > rect.width - halfThumb) x = rect.width - halfThumb;

            let percent = (x / rect.width) * 100;
            thumb.style.left = percent + '%';
        };


    // 2.1 механия перемещения ползунков : десктоп
    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSliderPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });


    // 2.2 механия перемещения ползунков : мобилка
    thumb.addEventListener('touchstart', (e) => {
        isDragging = true;
    }, {passive: true});

    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSliderPosition(e.touches[0].clientX);
    }, {passive: true});

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
});