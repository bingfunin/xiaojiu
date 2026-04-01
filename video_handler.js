// 视频处理和导航功能

// 存储所有视频的数组
let allVideos = [];
let currentVideoIndex = 0;

// 检测是否是微信浏览器
function isWeChatBrowser() {
    return /micromessenger/i.test(navigator.userAgent);
}

// 检测是否是苹果设备
function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// 检测浏览器环境
function checkBrowserEnvironment() {
    const isWeChat = isWeChatBrowser();
    const isIOS = isIOSDevice();
    
    if (isWeChat) {
        console.log('检测到微信浏览器');
    }
    if (isIOS) {
        console.log('检测到iOS设备');
    }
    
    return { isWeChat, isIOS };
}

// 动态加载视频（优化版：懒加载）
function loadVideos() {
    const gallery = document.getElementById('videoGallery');
    const { isWeChat, isIOS } = checkBrowserEnvironment();
    
    // 清空现有内容
    gallery.innerHTML = '';
    
    // 清空视频数组
    allVideos = [];
    
    // 直接加载固定数量的视频（4个）
    const maxVideos = 4;
    
    for (let index = 1; index <= maxVideos; index++) {
        console.log(`创建视频 ${index}`);
        
        // 创建视频元素
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
        // 苹果微信浏览器使用简单的 div 容器
        if (isIOS && isWeChat) {
            console.log('苹果微信浏览器，使用占位符');
            
            // 创建背景容器
            const bgDiv = document.createElement('div');
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.background = 'linear-gradient(135deg, #1e1e2f, #2c0a2d)';
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.display = 'flex';
            bgDiv.style.flexDirection = 'column';
            bgDiv.style.alignItems = 'center';
            bgDiv.style.justifyContent = 'center';
            
            // 添加视频编号
            const videoNumber = document.createElement('div');
            videoNumber.textContent = `视频 ${index}`;
            videoNumber.style.color = '#ffd700';
            videoNumber.style.fontSize = '1.2rem';
            videoNumber.style.fontWeight = 'bold';
            videoNumber.style.marginBottom = '10px';
            
            // 添加播放按钮
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            
            bgDiv.appendChild(videoNumber);
            bgDiv.appendChild(playButton);
            videoItem.appendChild(bgDiv);
        } else {
            // 其他浏览器使用普通视频元素
            const videoElement = document.createElement('video');
            videoElement.type = 'video/mp4';
            videoElement.muted = true;
            videoElement.preload = 'none'; // 不预加载，节省流量和内存
            videoElement.setAttribute('playsinline', '');
            videoElement.setAttribute('webkit-playsinline', '');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.background = '#000'; // 黑色背景
            
            // 添加播放按钮
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            
            videoItem.appendChild(videoElement);
            videoItem.appendChild(playButton);
        }
        
        // 点击时打开模态框
        videoItem.onclick = function() {
            openVideoModal(index);
        };
        
        // 添加到画廊
        gallery.appendChild(videoItem);
        
        // 将视频添加到数组中
        allVideos.push(`video/${index}.mp4`);
    }
    
    console.log(`已创建 ${allVideos.length} 个视频`);
}

// 打开视频模态框并播放指定索引的视频
function openVideoModal(videoIndex) {
    console.log(`打开视频模态框，索引: ${videoIndex}`);
    currentVideoIndex = videoIndex - 1; // 转换为0基索引
    document.getElementById('videoModal').style.display = 'flex';
    
    const modalVideo = document.getElementById('modalVideo');
    const videoSrc = allVideos[currentVideoIndex];
    console.log(`视频源: ${videoSrc}`);
    
    modalVideo.src = videoSrc;
    modalVideo.type = 'video/mp4';
    modalVideo.setAttribute('playsinline', '');
    modalVideo.setAttribute('webkit-playsinline', '');
    modalVideo.muted = false;
    
    // 自动播放
    modalVideo.play().catch(error => {
        console.error('自动播放失败:', error);
    });
    
    // 显示导航指示器
    showVideoNavIndicators();
}

// 显示视频导航指示器
function showVideoNavIndicators() {
    const prevIndicator = document.querySelector('#videoPrevArea .nav-indicator');
    const nextIndicator = document.querySelector('#videoNextArea .nav-indicator');
    
    if (prevIndicator && nextIndicator) {
        prevIndicator.style.opacity = '1';
        nextIndicator.style.opacity = '1';
        
        // 2秒后隐藏指示器
        setTimeout(() => {
            prevIndicator.style.opacity = '0';
            nextIndicator.style.opacity = '0';
        }, 2000);
    }
}

// 播放下一个视频
function nextVideo() {
    if (allVideos.length > 0) {
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.pause();
        
        currentVideoIndex = (currentVideoIndex + 1) % allVideos.length;
        modalVideo.src = allVideos[currentVideoIndex];
        modalVideo.type = 'video/mp4';
        modalVideo.muted = false;
        
        modalVideo.play().catch(e => console.error('播放下一个视频失败:', e));
    }
}

// 播放上一个视频
function prevVideo() {
    if (allVideos.length > 0) {
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.pause();
        
        currentVideoIndex = (currentVideoIndex - 1 + allVideos.length) % allVideos.length;
        modalVideo.src = allVideos[currentVideoIndex];
        modalVideo.type = 'video/mp4';
        modalVideo.muted = false;
        
        modalVideo.play().catch(e => console.error('播放上一个视频失败:', e));
    }
}

// 关闭视频模态框
function closeVideoModal(event) {
    // 如果点击的是模态框背景或关闭按钮，则关闭模态框
    if (event.target.id === 'videoModal' || event.target.innerText === '×' || event.target.tagName === 'SPAN') {
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.pause();
        modalVideo.src = ''; // 清空视频源
        document.getElementById('videoModal').style.display = 'none';
    }
}

// 页面加载完成后自动加载视频
document.addEventListener('DOMContentLoaded', function() {
    loadVideos();
    
    // 为视频导航区域添加事件监听器
    const videoPrevArea = document.getElementById('videoPrevArea');
    const videoNextArea = document.getElementById('videoNextArea');
    
    videoPrevArea.addEventListener('click', function(e) {
        e.stopPropagation();
        prevVideo();
    });
    
    videoNextArea.addEventListener('click', function(e) {
        e.stopPropagation();
        nextVideo();
    });
    
    // 添加视频导航区域的悬停效果
    videoPrevArea.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '1';
    });
    
    videoPrevArea.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '0';
    });
    
    videoNextArea.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '1';
    });
    
    videoNextArea.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '0';
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('videoModal').style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevVideo();
            } else if (e.key === 'ArrowRight') {
                nextVideo();
            }
        }
    });
    
    // 添加触屏滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('videoModal').addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.getElementById('videoModal').addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleVideoSwipe();
    });
    
    function handleVideoSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动，播放下一个视频
            nextVideo();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动，播放上一个视频
            prevVideo();
        }
    }
});