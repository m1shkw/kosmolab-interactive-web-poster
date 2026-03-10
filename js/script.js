// I. секция 1.1
const logoContainer = document.getElementById('kosmolab-logo');

// массив свгшек
const logoFiles = [
    'images/vector/0.1-kosmolab.svg',
    'images/vector/0.2-kosmolab.svg',
    'images/vector/0.3-kosmolab.svg'
];

let currentIndex = 0;
let logoTimer;

const logoImg = document.createElement('img');
logoImg.src = logoFiles[0];
logoContainer.appendChild(logoImg);

// анимация смены свг
function animateLogo() {
    currentIndex = (currentIndex + 1) % logoFiles.length;
    logoImg.src = logoFiles[currentIndex];
}

function startAnimation() { logoTimer = setInterval(animateLogo, 160); }
function stopAnimation() { clearInterval(logoTimer); }

// интерактивность при хавере 
logoContainer.addEventListener('mouseenter', stopAnimation);
logoContainer.addEventListener('mouseleave', startAnimation);

startAnimation();