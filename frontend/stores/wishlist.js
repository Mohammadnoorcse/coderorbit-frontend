import { defineStore } from "pinia";

export const useWishlistStore = defineStore("wishlist", {
  state: () => ({
    items: [],
  }),
  persist: true,
  getters: {
    wishlistItems: (state) => state.items,
  },
  actions: {
    addToWishlist(item) {
      if (!this.items.find((i) => i.id === item.id)) {
        this.items.push(item);
      }
    },
    removeFromWishlist(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId);
    },
    clearWishlist() {
      this.items = [];
    }
  },
});
