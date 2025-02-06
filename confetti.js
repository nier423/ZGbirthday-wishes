const canvas = document.createElement('canvas');
canvas.id = 'confetti-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 150;

// 首页的彩带效果（从两侧喷向中间）
class SideParticle {
    constructor(isLeft) {
        this.isLeft = isLeft;
        this.x = isLeft ? 0 : canvas.width;
        this.y = canvas.height * 0.3 + (Math.random() * canvas.height * 0.4);
        this.rotation = Math.random() * 360;
        this.speedX = (isLeft ? 1 : -1) * (8 + Math.random() * 10);
        this.speedY = -1 + Math.random() * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.width = 10 + Math.random() * 10;
        this.height = 3 + Math.random() * 4;
        this.opacity = 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedX *= 0.99;
        this.opacity -= 0.005;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

// 多语言页面的彩带效果（从天而降）
class FallingParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.rotation = Math.random() * 360;
        this.speedY = 2 + Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.width = 8 + Math.random() * 6;
        this.height = 2 + Math.random() * 3;
        this.opacity = 1;
        const hue = Math.random() * 360;
        this.color = `hsla(${hue}, 90%, 65%, ${this.opacity})`;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY *= 0.99;
        this.speedY += 0.1;
        this.speedX *= 0.99;
        if (this.y > canvas.height * 0.7) {
            this.opacity -= 0.02;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

let isAnimating = false;
let welcomeTextShown = false;
let isFallingEffect = false; // 用于切换彩带效果

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(isFallingEffect ? 
            new FallingParticle() : 
            new SideParticle(i % 2 === 0));
    }
}

function animate() {
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (isFallingEffect && particles.length < particleCount) {
        particles.push(new FallingParticle());
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

function showWelcomeText() {
    if (!welcomeTextShown) {
        const welcomeText = document.querySelector('.welcome-text');
        welcomeText.style.animation = 'fadeInOut 3s ease-in-out forwards';
        welcomeTextShown = true;
    }
}

// 修改蛋糕点击事件
document.getElementById('cake-trigger').addEventListener('click', () => {
    // 切换到落下效果
    isFallingEffect = true;
    isAnimating = true;
    particles.length = 0;
    createParticles();
    animate();
    
    const wishesContainer = document.getElementById('wishes-container');
    wishesContainer.style.display = 'flex';
    setTimeout(() => {
        wishesContainer.style.opacity = '1';
    }, 50);

    // 为每个祝福设置莫兰迪色系的颜色
    const wishes = document.querySelectorAll('.wish');
    const morandiColors = [
        '#E9E3E3', // 淡粉灰
        '#D4CBC7', // 浅褐灰
        '#B6A6A0', // 暖灰
        '#C7BDB3', // 米灰
        '#9E8B82', // 深褐灰
        '#D1C2BC', // 浅粉棕
        '#A49693', // 深玫瑰灰
        '#B8A69B', // 暖棕灰
        '#C4BBB4', // 浅灰褐
        '#A69F98', // 中性灰
        '#D8CCCC', // 浅粉白
        '#BFB4B0'  // 暖灰粉
    ];

    wishes.forEach((wish) => {
        const color = morandiColors[Math.floor(Math.random() * morandiColors.length)];
        wish.style.setProperty('--color', color);
    });
});

// 页面加载时使用从两侧喷射的效果
function autoStartAnimation() {
    isFallingEffect = false;
    isAnimating = true;
    particles.length = 0;
    createParticles();
    animate();
    showWelcomeText();
    
    // 持续添加新的彩带
    setInterval(() => {
        if (!isFallingEffect && particles.length < particleCount) {
            particles.push(new SideParticle(Math.random() > 0.5));
        }
    }, 100);
}

// 监听点击事件
canvas.addEventListener('click', (e) => {
    if (!isAnimating) {
        autoStartAnimation(); // 使用相同的初始化函数
    }
});

// 初始化时隐藏欢迎文字
document.querySelector('.welcome-text').style.animation = 'none';

// 页面加载完成后自动开始动画
window.addEventListener('load', autoStartAnimation);

// 添加动画循环处理
function updateWishPositions() {
    const wishes = document.querySelectorAll('.wish');
    wishes.forEach((wish) => {
        // 检查动画是否结束，如果结束则重新设置随机位置
        const animationState = wish.getAnimationState();
        if (animationState === 'finished') {
            const startX = Math.random() * 100 + 'vw';
            const startY = Math.random() * 100 + 'vh';
            const endX = Math.random() * 100 + 'vw';
            const endY = Math.random() * 100 + 'vh';
            const rotate = Math.random() * 360;
            
            wish.style.setProperty('--startX', startX);
            wish.style.setProperty('--startY', startY);
            wish.style.setProperty('--endX', endX);
            wish.style.setProperty('--endY', endY);
            wish.style.setProperty('--rotate', rotate + 'deg');
            
            // 重新触发动画
            wish.style.animation = 'none';
            wish.offsetHeight;
            wish.style.animation = `moveRandom var(--speed) linear infinite`;
        }
    });
    requestAnimationFrame(updateWishPositions);
}

// 开始动画循环
updateWishPositions();

// 修改多语言界面点击事件
document.getElementById('wishes-container').addEventListener('click', (e) => {
    // 如果点击的是视频按钮或其子元素，不要关闭多语言界面
    if (e.target.closest('#video-trigger')) {
        return;
    }
    
    if (e.target === e.currentTarget) {
        e.currentTarget.style.opacity = '0';
        setTimeout(() => {
            e.currentTarget.style.display = 'none';
        }, 500);
    }
});

// 修改视频相关代码
const videoContainer = document.createElement('div');
videoContainer.className = 'video-container';
videoContainer.innerHTML = `
    <div class="video-wrapper">
        <div class="close-video">×</div>
        <video id="birthday-video" controls>
            <source src="birthday.mp4" type="video/mp4">
            您的浏览器不支持视频播放。
        </video>
    </div>
`;
document.body.appendChild(videoContainer);

// 视频播放按钮点击事件
document.getElementById('video-trigger').addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const video = document.getElementById('birthday-video');
    if (video) {
        videoContainer.style.display = 'flex';
        video.load();
        
        setTimeout(() => {
            videoContainer.style.opacity = '1';
            video.play();
        }, 100);
    }
});

// 关闭视频按钮点击事件
document.querySelector('.close-video').addEventListener('click', function(e) {
    e.stopPropagation();
    const video = document.getElementById('birthday-video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    videoContainer.style.opacity = '0';
    setTimeout(() => {
        videoContainer.style.display = 'none';
    }, 300);
});

// 点击视频容器背景关闭视频
videoContainer.addEventListener('click', function(e) {
    if (e.target === videoContainer) {
        const video = document.getElementById('birthday-video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        videoContainer.style.opacity = '0';
        setTimeout(() => {
            videoContainer.style.display = 'none';
        }, 300);
    }
}); 