<script setup>
import { ref, computed } from "vue";
import { useCartsStore } from "@/stores/carts";

const carts = useCartsStore();

//meta seo data
const config = useRuntimeConfig();
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName;
const MetaIcon = config.public.metaApplicationIcon;
// Meta data from env file
const seoData = ref({
	name:`${MetaName}::Cart`,
	productUrl:`${MetaUrl}`,
	icon:`${MetaIcon}`,

})

// Method to increase item quantity
const increaseQuantity = (item) => {
    item.quantity += 1;
    carts.updateItem(item);
};

// Method to decrease item quantity
const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        item.quantity -= 1;
        carts.updateItem(item);
    }

};

// Method to delete item
const deleteItem = (item) => {
    carts.removeItem(item.item_id);
    
};

// Computed property to get total items count
const totalItems = computed(() => {
  return carts.items.reduce((total, item) => total + item.quantity, 0);
});

// Computed property to get total price
const totalPrice = computed(() => {
  return carts.items.reduce((total, item) => total + item.quantity * item.price, 0);
});

// Computed property to get total previous price
const totalPrevPrice = computed(() => {
  return carts.items.reduce((total, item) => total + item.quantity * item.prevPrice, 0);
});





</script>

<template>
  
  <Seo :metaData="seoData"/>
  <div>
    <div class="flex items-center justify-between px-4 py-2 bg-red-200">
      <span class="text-sm">Total Cart's</span>
      <span class="text-primary">{{ totalItems }}</span>
    </div>
    <div class="px-4 py-2 express-delivery bg-light">
      <p class="font-bold">
        <Icon name="iconoir:delivery-truck" class="w-6 h-6" /> Express Delivery
      </p>
    </div>
    <div class="p-4 cart-items">
      <div v-for="item in carts.items" :key="item.id" class="flex items-center py-2 border-b cart-item">
        <NuxtImg :src="item.icon" :alt="item.name" class="w-20 h-20 mr-4" />
        <div class="flex-grow item-details">
			<p class="text-sm pe-4" :title="item.name">{{ item.name.substring(0, 30)  }}...</p>
			<div class="flex items-center mt-2">
				<button class="px-2 border rounded-l" @click="decreaseQuantity(item)">
					<Icon name="fluent-emoji-high-contrast:minus"/>
				</button>
				<input type="number" :value="item.quantity" min="1" class="w-10  text-center border-t border-b" @input="($event) => { item.quantity = Number($event.target.value); carts.updateItem(item); }" />
				<button class="px-2 border rounded-r" @click="increaseQuantity(item)" >
					<Icon name="fa6-solid:plus"/>
				</button>
				</div>
			</div>
        <div class="item-quantity">
          <p class="text-sm">
            <span class="block">{{ item.quantity * item.current_price }}</span>
            <span
              v-if="item.regular_price"
              class="block text-gray-500 line-through"
              >{{ item.quantity * item.regular_price }}</span
            >
          </p>
        </div>
        <button class="ml-2 text-lg text-primary" @click="deleteItem(item)">
          <Icon class="w-6 h-6" name="charm:cross" />
        </button>
      </div>
    </div>
    <div class="flex absolute bottom-0 bg-white items-center justify-center w-full p-4 order-summary">
      <NuxtLink
        to="/cart"
        class="w-3/4 py-2 text-white bg-yellow-400 ps-4 pe-8"
      >
        Order Place
      </NuxtLink>

      <span class="px-4 py-2 font-bold text-white bg-yellow-600">{{ carts.totalPrice }}</span>
    </div>
  </div>
</template>
