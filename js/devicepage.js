function updateDevicePage(category, number){
    var device = getDevice(category, number);
    var deviceTemp = document.getElementById('device-template');
    var deviceTemplate = _.template(deviceTemp.innerHTML);
    var html = deviceTemplate({device: device, category: category, index: number});
    document.getElementById('device-wrapper').innerHTML = html;
    updateImageGallery(category, number, 0, 0);
    initDeviceTabs();
    updateTechInfo(device);
    openDeviceTab('tech-info-tab');
}

function updateTechInfo(device){
    var deviceTemp = document.getElementById('tech-info-table-template');
    var deviceTemplate = _.template(deviceTemp.innerHTML);
    var html = deviceTemplate({device: device});
    document.getElementById('tech-info-tab').innerHTML = html;
}

function updateImageGallery(category, index, number, offset){
    var images = [];
    images = getDevice(category, index).techInfo.thumbs;
    var deviceTemp = document.getElementById('image-gallery-template');
    var deviceTemplate = _.template(deviceTemp.innerHTML);
    var html = deviceTemplate({images: images, selected: number, offset: offset, category: category, index: index});
    document.getElementById('image-gallery').innerHTML = html;
}

function openDeviceTab(tabId){
    var tabs = document.getElementsByClassName('device-tab');
    for(var i = 0; i < tabs.length; i++){
        tabs[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'inline-block';
}

function bindTabButton(tabId, buttonId){
    document.getElementById(buttonId).onclick = function(){
        var buttons = document.getElementsByClassName('tab-button');
        for(var i = 0; i < buttons.length; i++){
            buttons[i].className = 'tab-button';
        }
        document.getElementById(buttonId).className = 'tab-button selected'
        openDeviceTab(tabId);
    }
}

function initDeviceTabs(){
    bindTabButton('tech-info-tab', 'tech-info-tab-button');
    bindTabButton('comments-tab', 'comments-tab-button');
}


