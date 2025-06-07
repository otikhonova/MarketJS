function hideAll(){
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++){
        pages[i].style.display = 'none';
    }
}

function redirect(hash){
    window.location.replace('http://localhost:63342/AtlasMarket/index.html#!/{0}'.format(hash));
}

function show(pageName) {
    hideAll();
    document.getElementById(pageName).style.display = 'block';
}

var routes = new Array();

function addRoute(url, action){
    routes[url] = action;
}

function getCatalogController(name){
    return function(pageNumber){
        if(pageNumber[0] == 'i'){
            pageNumber = pageNumber.substring(1);
            updateDevicePage(name, pageNumber);
            show('device-page');
        }
        else{
            updateCatalog(name, pageNumber);
            show('catalog');
        }
    }
}

var order = function(){
    show('order');
}

var cartPage = function(){
    show('cart-page');
}

addRoute('phones', getCatalogController('phones'));
addRoute('tablets', getCatalogController('tablets'));
addRoute('cameras', getCatalogController('cameras'));
addRoute('players', getCatalogController('players'));
addRoute('order', order);
addRoute('cart', cartPage);

var update = function(){
    var hash = window.location.hash.substring(3);
    var pieces = hash.split('/');
    if(!routes[pieces[0]]){
        routes['phones'](1);
    }
    routes[pieces[0]](pieces[1]);
}

window.addEventListener("hashchange", update, false);


hideAll();
update();