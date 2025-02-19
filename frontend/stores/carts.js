import {
    defineStore
} from "pinia";

export const useCartsStore = defineStore("carts", {
    state: () => ({
        items: [],
        totalItem: 0,
        totalPrice: 0,
    }),
    persist: true,
    getters: {
        cartItems: (state) => state.items,
        
    },
    actions: {
        addToCart(data) {

            let attriColor = data.attributes.colors?.split(',');
            let attriSize = data.attributes.sizes?.split(',');

            const cart = {
                item_id: data.id,
                name: data.name,
                icon: data.icon_small,
                attributes: data.attributes,
                discount: parseFloat(data.discount),
                discount_type: data.discount_type,
                regular_price: parseFloat(data.regular_price),
                current_price: parseFloat(data.current_price),
                total: parseFloat(data.current_price),
                quantity: data.quantity ? data.quantity : 1,
                color: attriColor != undefined ? attriColor[0] : "",
                size: attriSize != undefined ? attriSize[0] : "",

            }
            const existingItem = this.items.find((item) => item.item_id === data.id);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.total = existingItem.quantity * existingItem.current_price;

            } else {
                data.quantity = data.quantity ? data.quantity : 1;
                data.total = parseFloat(data.current_price);
                this.items.push(cart);
            }

            // Update total item count and total price
            this.totalItem = this.items.reduce((acc, item) => acc + item.quantity, 0);
            this.totalPrice = this.items.reduce((acc, item) => (parseFloat(acc) + (item.quantity * parseFloat(item.current_price))), 0);

            this.updateCartSummary();
        },

        updateItem(updatedItem) {
            const item = this.items.find((item) => item.item_id === updatedItem.id);
            if (item) {
                item.quantity = updatedItem.quantity;
                item.total = item.quantity * parseFloat(item.current_price);
            }

            this.updateCartSummary();
        },

        removeItem(itemId) {
            this.items = this.items.filter((item) => item.item_id !== itemId);

            this.updateCartSummary();
        },

        updateCartSummary() {
            this.totalItem = this.items.reduce((acc, item) => acc + item.quantity, 0);
            this.totalPrice = this.items.reduce(
                (acc, item) => (parseFloat(acc) + (item.quantity * parseFloat(item.current_price))),
                0
            );
        },


        additional(data){            

            const existingItem = this.items.find((item) => item.item_id === parseInt(data.product_id));
            if (existingItem) {
                existingItem.regular_price = parseFloat(data.regular_price),
                existingItem.current_price = parseFloat(data.current_price),
                existingItem.total = existingItem.quantity * parseFloat(data.current_price);
                existingItem.color = data.color;
                existingItem.size = data.size;
            }
        },

    },
});