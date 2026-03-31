// 视频处理和导航功能

// 存储所有视频的数组
let allVideos = [];
let currentVideoIndex = 0;

// 动态加载视频
function loadVideos() {
    const gallery = document.getElementById('videoGallery');
    
    // 清空现有内容
    gallery.innerHTML = '';
    
    // 清空视频数组
    allVideos = [];
    
    // 假设视频命名是从1.mp4开始的连续数字
    let videoCount = 0;
    const maxVideos = 50; // 设置一个合理的上限以避免无限循环
    
    // 创建一个视频加载函数
    function tryLoadVideo(index) {
        const video = document.createElement('video');
        video.src = `video/${index}.mp4`;
        video.muted = true; // 静音加载以避免自动播放问题
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
            // 视频加载成功，添加到画廊
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            
            const videoElement = document.createElement('video');
            videoElement.src = `video/${index}.mp4`;
            videoElement.muted = true;
            videoElement.preload = 'metadata';
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            
            // 添加播放按钮
            const playButton = document.createElement('div');
            playButton.className = 'play-button';
            
            videoItem.appendChild(videoElement);
            videoItem.appendChild(playButton);
            
            // 点击视频时打开模态框
            videoItem.onclick = function() {
                openVideoModal(index);
            };
            
            gallery.appendChild(videoItem);
            
            // 将视频添加到数组中
            allVideos.push(`video/${index}.mp4`);
            
            // 继续尝试加载下一个视频
            tryLoadVideo(index + 1);
        };
        
        video.onerror = function() {
            // 视频加载失败，停止加载
            // 这意味着我们已经加载了所有存在的视频
        };
    }
    
    // 开始加载第一个视频
    tryLoadVideo(1);
}

// 打开视频模态框并播放指定索引的视频
function openVideoModal(videoIndex) {
    currentVideoIndex = videoIndex - 1; // 转换为0基索引
    document.getElementById('videoModal').style.display = 'flex';
    
    const modalVideo = document.getElementById('modalVideo');
    modalVideo.src = allVideos[currentVideoIndex];
    modalVideo.muted = false; // 取消静音
    modalVideo.play(); // 自动播放
    
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
        // 停止当前视频
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.pause();
        
        currentVideoIndex = (currentVideoIndex + 1) % allVideos.length;
        modalVideo.src = allVideos[currentVideoIndex];
        modalVideo.play();
    }
}

// 播放上一个视频
function prevVideo() {
    if (allVideos.length > 0) {
        // 停止当前视频
        const modalVideo = document.getElementById('modalVideo');
        modalVideo.pause();
        
        currentVideoIndex = (currentVideoIndex - 1 + allVideos.length) % allVideos.length;
        modalVideo.src = allVideos[currentVideoIndex];
        modalVideo.play();
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