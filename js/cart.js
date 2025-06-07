var cart = {
    opened: false,
    onButtonClick: function(event){
        if (event.preventDefault) {
            event.preventDefault();
        }
        if(cart.opened) cart.close()
        else cart.open();
    },
    init: function(){
        document.getElementById("cart-button").onclick = cart.onButtonClick;
        this.loadItems();
        this.updateWidget();
        this.updatePage();
    },
    orderClicked: function(){
        this.close();
        redirect('cart');
    },
    getTotalPrice: function(){
        var res = 0;
        for(var i = 0; i < this.items.length; i++){
            var item = this.items[i];
            var device = getDevice(item.category, item.index);
            res += item.count * parseInt(device.price.min);
        }
        return res;
    },
    storageName: "amarket_cart",
    loadItems: function(){
        var taken = JSON.parse(localStorage.getItem(this.storageName));
        if(taken) this.items = taken;
    },
    saveItems: function(){
        localStorage.setItem(this.storageName, JSON.stringify(this.items));
    },
    getWidget: function(){
        return document.getElementById("cart-widget");
    },
    open:function(){
        this.getWidget().style.display = 'block';
        this.opened = true;
    },
    close:function(){
        this.getWidget().style.display = 'none';
        this.opened = false;
    },
    getItemsHtml:function(templateName){
        if(!this.items.length) return '<h3>Нет товаров</h3>'
        var deviceTemp = document.getElementById(templateName);
        var deviceTemplate = _.template(deviceTemp.innerHTML);
        var resultingHtml = '';
        for(var i = 0; i < this.items.length; i++){
            var item = this.items[i];
            var device = getDevice(item.category, item.index);
            var totalPrice = item.count*parseInt(device.price.min);
            resultingHtml += deviceTemplate({device: device,
                count: item.count, number: i, totalItemPrice: totalPrice});
        }
        return resultingHtml;
    },
    updateWidget: function(){
        var itemsContainer = document.getElementById("cart-items");
        var itemsCounter = document.getElementById("cart-counter");
        var totalPriceLabel = document.getElementById("total-price");
        itemsContainer.innerHTML = this.getItemsHtml('cart-item-template');
        itemsCounter.innerHTML = this.items.length ? this.items.length : '0';
        totalPriceLabel.innerHTML = '$' + this.getTotalPrice();
        this.saveItems();
    },
    updatePage: function(){
        var itemsContainer = document.getElementById("cart-page-items");
        itemsContainer.innerHTML = this.getItemsHtml('cart-page-item-template');
        var totalPriceLabel = document.getElementById("total-page-price");
        totalPriceLabel.innerHTML = '$' + this.getTotalPrice();
    },
    deleteItem: function(number){
        this.items[number].count--;
        if(this.items[number].count <= 0)
            this.items.splice(number, 1);
        this.updateWidget();
        this.updatePage();
    },
    addItem: function(category, index){
        for(var i = 0; i < this.items.length; i++){
            var item = this.items[i];
            if(item.category == category && item.index == index){
                this.items[i].count++;
                this.updateWidget();
                return;
            }
        }
        this.items[this.items.length] = {category: category, index: index, count: 1};
        this.updateWidget();
        this.updatePage();
    },
    onCountChanged: function(number, value){
        if(value > 0) this.items[number].count = value;
        this.updatePage();
        this.updateWidget();
    },
    items: []
}

cart.init();