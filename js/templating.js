var catalogContent;

async function initCatalog(){
    catalogContent = {};
    const categories = ['phones', 'cameras', 'players', 'tablets'];
    const promises = categories.map(loadCategory);
    const results = await Promise.all(promises);
    categories.forEach((c, i) => {
        catalogContent[c] = results[i];
    });
}

async function loadCategory(category){
    const response = await fetch(`models/${category}.json`);
    if(!response.ok){
        throw new Error('Failed to load ' + category);
    }
    return await response.json();
}

var maxOnPage = 15;
var currentCategory;

var updateCatalog = function (category, pageNumber) {
    var devices = catalogContent[category];
    currentCategory = category;
    showCategoryPage(filter.retainSatisfying(devices, category), pageNumber);
}

function getDevice(category, index){
    return catalogContent[category][index];
}

function showCategoryPage(devices, pageNumber){
    var resultingHtml = '';
    pageNumber--;
    var deviceTemp = document.getElementById('device-short-template');
    var deviceTemplate = _.template(deviceTemp.innerHTML);
    for(var i = 0; i < maxOnPage; i++){
        var device = devices[i+pageNumber*maxOnPage];
        if(device){
            resultingHtml += deviceTemplate({device: device});
        }
    }
    resultingHtml += getPageLinks(devices.length, pageNumber);
    document.getElementById('device-grid').innerHTML = resultingHtml;
    window.scrollTo(0,0);
}

function getPageLinks(amount, pageNumber){
    if(amount <= 0) return '<div class="not-found-label">Ничего не найдёно</div>';
    var resultingHtml = '<div class="links-container"><ul id = "page-links">';
    var pages = amount / maxOnPage;
    for(var i =0 ; i < pages; i++) {
        resultingHtml += getPageLink(i, i == pageNumber);
    }
    resultingHtml += '</ul></div>'
    return resultingHtml;
}

function getPageLink(pageNumber, selected){
    var url = '#!/' + currentCategory + '/' + (pageNumber+1);
    var resultingHtml = '<li ';
    if(selected) resultingHtml += ' class = \"selected\"';
    resultingHtml += '><a href=\"' + url + '\">' + (pageNumber+1) + '</a></li>';
    return resultingHtml;
}

var catalogReady = initCatalog();
