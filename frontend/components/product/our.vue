<script setup>
import { Icon } from "@iconify/vue";

import { onMounted, ref } from "vue";

import { useCartsStore } from '@/stores/carts';
import { useWishlistStore } from '@/stores/wishlist';

const carts = useCartsStore();

const productItem = ref({});
const feedbacks = ref([]);
const totalRatings = ref(0);

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
    Accept: "application/json",
    "App-Master-Key": `${MasterKey}`,
});


const updateProductItem = () => {
    const cartItems = carts.items.reduce((acc, item) => {
        acc['id_' + item.id] = item.quantity;
        return acc;
    }, {});
    productItem.value = cartItems;
};


// pinia
const addCart = (item) => {
    carts.addToCart(item);
    updateProductItem();
};


const explores = ref([]);

onMounted( async () => {
    try {
        let exploreData = await $fetch(`${EndPoint}/category/with_data/99?orderBy=desc&limit_per_page=10&relative=feedbacks`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )            
            explores.value = exploreData?.products?.data

        }catch (err) {
        console.log(err);
    }
}) 


    




const cartQuantity = (productId) => {
    const cartItem =  carts.items.findLast((item) => item.item_id == productId)
    if(cartItem == undefined){
        return 0
    }else{
        return cartItem.quantity;
    }
}


</script>
<template>
    <div class="relative mt-20">
        <div class="flex items-center justify-between mb-4">
            <TitleWithSub title="For You" subtitle="Explore Our Products" />
        </div>

        <div class="relative">

            <div class="grid md:grid-cols-3 lg:grid-cols-5 grid-cols-1 md:gap-4">
                <ProductCard class="mt-8 md:mt-10" limitData="55" v-for="product in explores" :key="product.id" :product="product" />
            </div>
        </div>
        
        
        <div class="flex items-center justify-center py-8 md:py-14">
            <NuxtLink to="/product/view/all">
                <Button class="w-40 text-center">View All Products</Button>
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.swiper-pagination {
    position: static !important;
    margin-top: 20px;
}

.swiper-pagination-bullet {
    width: 12px;
    height: 12px;
}

.swiper-pagination-bullet-active {
    background-color: #db4444;
    border: 2px solid rgba(128, 128, 128, 0.527);
    width: 12px;
    height: 12px;
}
</style>
