<script setup>
import { useCartsStore } from "@/stores/carts";
import { useWishlistStore } from "@/stores/wishlist";
import { useLoginStore } from "@/stores/login";
import { useRouter } from "vue-router";
import { ref, watch } from "vue";

const props = defineProps({
    product: {
        type: Object,
    }
});

const showFlashSale = ref(true);

const carts = useCartsStore();

const route = useRoute();
const router = useRouter();

const loadingStatus = ref('pendding');

// Pinia
const buyNow = (product) => {
    product['quantity'] = 1;
    carts.addToCart(product);
    router.push("/checkout");
};

// watch(
//     () => props.endTime,
//     () => {
//         if (new Date().getTime() >= props.endTime.getTime()) {
//             showFlashSale.value = false;
//         }
//     }
// );


console.log(props.product);



</script>
<template>
    <div v-if="showFlashSale"
        class="flex mt-5 md:mt-10 flex-col items-center justify-between p-8 text-white bg-gray-900 rounded-lg md:flex-row">
        <div class="flex flex-col justify-center items-start">
            <span class="text-lg font-bold text-red-500" v-if="product[0]?.regular_price > 0">Discount Offer 
                <span v-if="product[0]?.discount_type == 0">{{ product[0]?.discount }}%</span> 
                <span v-else><Currency :amount="product[0]?.discount"/> Off</span> 
            </span>
            
            <h1 class="lg:w-2/3 my-4 lg:text-2xl text-lg font-bold mt-8 text-wrap">{{ product[0]?.name }}</h1>
            <!-- <Countdown :endTime="new Date(product[0]?.end_offer)" /> -->
            <Countdown :endTime="product[0]?.end_offer ? new Date(product[0]?.end_offer) : null" />

            <Button class="mt-8 w-32" @click="buyNow(product[0])"> Buy Now </Button>
        </div>
        <div class="mt-8 md:mt-0">
            <NuxtImg :src="product[0]?.icon" :alt="product[0]?.name" class="w-full h-auto rounded-lg" />
        </div>
    </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
