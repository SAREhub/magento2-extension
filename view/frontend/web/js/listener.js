require([
    'jquery',
    'underscore',
    'jquery/jquery-storageapi'
], function($, _) {
    var storage = $.initNamespaceStorage('mage-cache-storage').localStorage;

    $(document).on('ajaxComplete', function (event, xhr, settings) {
        if (settings.url.match(/customer\/section\/load/i) && xhr.responseJSON && xhr.responseJSON.cart) {
            var addedItems = {};
            var removedItems = [];
            var modifiedItems = [];
            var qty = 0;

            var newCart = xhr.responseJSON.cart;
            var oldCart = storage.get('iwd-old-cart');
            oldCart = (typeof oldCart === 'undefined') ? {'items':[]} : oldCart;

            var oldCartItems = {};
            $.each(oldCart.items, function(){
                oldCartItems[this.item_id] = this;
            });

            $.each(newCart.items, function(item){
                var id = this.item_id;
                if (typeof oldCartItems[id] !== 'undefined') {
                    var oldQty = oldCartItems[id].qty;
                    console.log('OLD: '+oldQty+' THIS'+this.qty);
                    if (oldQty == 0 && oldQty < this.qty) {
                       // this.qty -= oldQty;
                        addedItems = this;
                        qty = this.qty;
                    } else if (oldQty > this.qty && this.qty == 0) {
                      //  this.qty = oldQty - this.qty;
                        removedItems.push(this);
                        qty = oldQty;
                    }

                    if(oldQty > 0 && this.qty > 0 && oldQty != this.qty){
                        modifiedItems.push(this);
                        qty = this.qty;
                    }

                    delete oldCartItems[id];
                } else {
                    addedItems = this;
                    qty = this.qty;
                }
            });

            $.each(oldCartItems, function(id, item){
                removedItems.push(item);
            });

            if (_.size(addedItems) > 0) {
                $('body').trigger('productAdded', [{items:addedItems, qty: qty}]);
            }
            if (_.size(removedItems) > 0) {
                $('body').trigger('productRemoved', [{items:removedItems, qty: qty}]);
            }
            if (_.size(modifiedItems) > 0) {
                $('body').trigger('productModified', [{items:modifiedItems, qty: qty}]);
            }

            storage.set('iwd-old-cart', newCart);
        }

        if (settings.url.match(/shipping-information/i) && xhr.responseJSON && xhr.responseJSON.totals) {
            $('body').trigger('billingSaved', [{items:removedItems}]);
        }
    });
});