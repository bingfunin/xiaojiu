// 基本信息数据处理和渲染功能

// 动态加载JSON数据并渲染基本信息
function loadAndRenderBasicInfo() {
    fetch('basic_info.json')
        .then(response => response.json())
        .then(data => {
            renderBasicInfo(data);
        })
        .catch(error => {
            console.error('加载基本信息数据时出错:', error);
        });
}

// 渲染基本信息
function renderBasicInfo(basicInfoData) {
    const infoGrid = document.querySelector('.info-grid');
    if (!infoGrid) return;
    
    // 清空现有内容
    infoGrid.innerHTML = '';
    
    // 根据JSON数据生成信息项
    basicInfoData.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        
        const infoTitle = document.createElement('div');
        infoTitle.className = 'info-title';
        infoTitle.textContent = item.title;
        
        const infoContent = document.createElement('div');
        infoContent.className = 'info-content';
        infoContent.textContent = item.content;
        
        infoItem.appendChild(infoTitle);
        infoItem.appendChild(infoContent);
        infoGrid.appendChild(infoItem);
    });
}