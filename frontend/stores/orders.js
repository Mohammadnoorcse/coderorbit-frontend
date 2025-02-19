// stores/orders.js
import { defineStore } from 'pinia';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
  }),
  actions: {
    addOrder(order) {
      this.orders.push(order);
      this.currentOrder = order; // Optionally set the current order
    },
    clearCurrentOrder() {
      this.currentOrder = null;
    },
    resetOrder() {
        this.orders = [];
        this.currentOrder = null;

        // Reset other relevant data if necessary
    },
  },
});
