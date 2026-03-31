// 图片处理和导航功能

// 存储所有图片的数组
let allImages = [];
let currentImageIndex = 0;

// 动态加载图片
function loadImages() {
    const gallery = document.getElementById('imageGallery');
    
    // 清空现有内容
    gallery.innerHTML = '';
    
    // 清空图片数组
    allImages = [];
    
    // 假设图片命名是从1.jpg开始的连续数字
    let imageCount = 0;
    const maxImages = 50; // 设置一个合理的上限以避免无限循环
    
    // 创建一个图片加载函数
    function tryLoadImage(index) {
        const img = new Image();
        img.src = `image/${index}.jpg`;
        
        img.onload = function() {
            // 图片加载成功，添加到画廊
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const imgElement = document.createElement('img');
            imgElement.src = `image/${index}.jpg`;
            imgElement.alt = `${index}.jpg`;
            imgElement.style.width = '100%';
            imgElement.style.height = '100%';
            imgElement.style.objectFit = 'cover';
            imgElement.style.cursor = 'pointer';
            imgElement.onclick = function() {
                openModal(index);
            };
            
            galleryItem.appendChild(imgElement);
            gallery.appendChild(galleryItem);
            
            // 将图片添加到数组中
            allImages.push(`image/${index}.jpg`);
            
            // 继续尝试加载下一张图片
            tryLoadImage(index + 1);
        };
        
        img.onerror = function() {
            // 图片加载失败，停止加载
            // 这意味着我们已经加载了所有存在的图片
        };
    }
    
    // 开始加载第一张图片
    tryLoadImage(1);
}

// 打开模态框并显示指定索引的图片
function openModal(imageIndex) {
    currentImageIndex = imageIndex - 1; // 转换为0基索引
    document.getElementById('imageModal').style.display = 'flex';
    document.getElementById('modalImage').src = allImages[currentImageIndex];
    
    // 显示导航指示器
    showNavIndicators();
}

// 显示导航指示器
function showNavIndicators() {
    const prevIndicator = document.querySelector('.nav-indicator.prev');
    const nextIndicator = document.querySelector('.nav-indicator.next');
    
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

// 显示下一张图片
function nextImage() {
    if (allImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        document.getElementById('modalImage').src = allImages[currentImageIndex];
    }
}

// 显示上一张图片
function prevImage() {
    if (allImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        document.getElementById('modalImage').src = allImages[currentImageIndex];
    }
}

// 关闭模态框
function closeModal(event) {
    // 如果点击的是模态框背景或关闭按钮，则关闭模态框
    if (event.target.id === 'imageModal' || event.target.innerText === '×' || event.target.tagName === 'SPAN') {
        document.getElementById('imageModal').style.display = 'none';
    }
}

// 页面加载完成后自动加载图片和基本信息
document.addEventListener('DOMContentLoaded', function() {
    loadImages();
    loadAndRenderBasicInfo(); // 渲染基本信息
    
    // 为导航区域添加事件监听器
    const prevArea = document.getElementById('prevArea');
    const nextArea = document.getElementById('nextArea');
    
    prevArea.addEventListener('click', function(e) {
        e.stopPropagation();
        prevImage();
    });
    
    nextArea.addEventListener('click', function(e) {
        e.stopPropagation();
        nextImage();
    });
    
    // 添加导航区域的悬停效果
    prevArea.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '1';
    });
    
    prevArea.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '0';
    });
    
    nextArea.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '1';
    });
    
    nextArea.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('.nav-indicator');
        if (indicator) indicator.style.opacity = '0';
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('imageModal').style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });
    
    // 添加触屏滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('modalImage').addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.getElementById('modalImage').addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // 向左滑动，显示下一张图片
            nextImage();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // 向右滑动，显示上一张图片
            prevImage();
        }
    }
});