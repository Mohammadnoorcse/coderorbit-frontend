<script setup>
import { ref } from "vue";
import { useWishlistStore } from "@/stores/wishlist";
import { useCartsStore } from "@/stores/carts";

const carts = useCartsStore();
const wishlists = useWishlistStore();

//meta seo data
const config = useRuntimeConfig();
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName;
const MetaIcon = config.public.metaApplicationIcon;

// Meta data from env file
const seoData = ref({
	name:`${MetaName}::Wishlist`,
	productUrl:`${MetaUrl}`,
	icon:`${MetaIcon}`,

})
definePageMeta({
  layout: "home",
});

console.log(wishlists);

const products = ref([]);

try {
  await fetch("/api/products")
    .then((response) => response.json())
    .then((data) => {
      products.value = data;
    });
} catch (err) {
  console.log(err);
}





const moveAllToCart = () => {
  wishlists.items.forEach((item) => {
    carts.addToCart(item);
  });
  wishlists.clearWishlist();
  
};

</script>

<template>
  <Seo :metaData="seoData"/>
  <NuxtLayout name="home">
    <div class="container relative p-4 mx-auto mt-20 md:p-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-row items-center gap-4">
          <h1 class="text-xl">Wishlist ({{ wishlists.items.length }})</h1>
        </div>
        <div
          class="absolute top-0 flex items-center justify-center space-x-2 right-1 lg:right-0"
        >
          <Button
            class="w-48 !text-black bg-transparent border border-dark hover:bg-gray hover:!text-white"
            @click="moveAllToCart"
            v-if="wishlists.items.length > 0"
          >
            Move All To Bag
          </Button>
        </div>
      </div>
      <div class="relative">
        <div
          class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-4 md:grid-cols-2 md:p-0"
        >
          <WishlistCard
            v-for="product in wishlists.items"
            :key="id"
            class="mt-8 md:mt-14"
            :product="product"
          />
        </div>
      </div>
      <div class="flex items-center justify-center py-8 md:py-14"></div>
    </div>
    <div class="container relative p-4 mx-auto mt-20 md:p-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex flex-row items-center gap-4">
          <TitleWithSubTitle title="Just For You" />
        </div>
        <div
          class="absolute top-0 flex items-center justify-center space-x-2 right-1 lg:right-0"
        >
          <Button
            class="w-32 !text-black bg-transparent border border-dark hover:bg-gray hover:!text-white"
          >
            Sell All
          </Button>
        </div>
      </div>
      <div class="relative">
        <div
          class="grid grid-cols-1 gap-6 p-4 lg:grid-cols-4 md:grid-cols-2 md:p-0"
        >
          <ProductCard
            v-for="(product, index) in products.slice(0, 4)"
            :key="index"
            class="mt-8 md:mt-14"
            :product="product"
          />
        </div>
      </div>
      <div class="flex items-center justify-center py-8 md:py-14"></div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.word {
  color: red;
}
</style>
