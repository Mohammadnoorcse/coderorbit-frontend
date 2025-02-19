<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCartsStore } from '@/stores/carts';
import { useWishlistStore } from '@/stores/wishlist';

const { dateMonthFunction, dateFunction } = useDataDate();

const carts = useCartsStore();
const wishlists = useWishlistStore();

const whishList = ref(false);
const productItem = ref({});

const feedbacks = ref([]);
const totalRatings = ref(0);

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },

    limitData : {
        default: 60
    },
});


totalRatings.value = props.product.feedbacks?.reduce((sum, feedback) => sum + feedback.rattings, 0);


const cartQuantity = computed(() => {
    let productId = props.product.id
    const cartItem =  carts.items.findLast((item) => item.item_id == productId)
    if(cartItem == undefined){
        return 0
    }else{
        return cartItem.quantity;
    }


});




onMounted(() => {
    updateProductItem();
    checkWishlistStatus();

});

const updateProductItem = () => {
    const cartItems = carts.items.reduce((acc, item) => {
        acc['id_' + item.id] = item.quantity;
        return acc;
    }, {});
    productItem.value = cartItems;
};

const checkWishlistStatus = () => {
    whishList.value = wishlists.items.some(item => item.id === props.product.id);
};
 

// pinia
const addCart = (item) => {
    carts.addToCart(item);
    updateProductItem();
};

const addToWishlist = (item) => {
    whishList.value = !whishList.value;
    if (whishList.value) {
        wishlists.addToWishlist(item);
    } else {
        // wishlists.removeFromWishlist(item.id);
    }
};
console.log('Product Card',props.product);


</script>

<template>
    <div class="relative">
        <div class="relative flex items-center w-full h-60 justify-center bg-gray-100 cursor-pointer group">
            <NuxtLink :to="`/product/${product.id}`">
                <div v-if="dateFunction(product.end_offer) >= dateFunction(new Date()) && product.current_price < product.regular_price" class="absolute px-2 py-1 text-xs font-bold rounded-md text-light bg-primary top-2 left-2">
                    {{ product.discount }} <span v-if="product.discount_type === 0">%</span> Off
                      
                </div>
             
                <div class="bg-cover bg-center">
                    <NuxtImg :src="product.icon" alt="Product Image" class="w-full h-60 object-cover" />
                </div>
            </NuxtLink>
            <div class="absolute flex flex-col space-y-2 right-4 top-2">
                <button class="p-2 text-black h-8 w-8 flex justify-center items-center bg-white rounded-full" @click="addToWishlist(product)">
                    <Icon :name="whishList ? 'fluent:heart-28-filled' : 'fluent:heart-28-regular'" :class="['text-xl', { 'text-primary': whishList }]" />
                </button>
                <button class="p-2 text-black h-8 w-8 flex justify-center items-center bg-white rounded-full">
                    <Icon name="mdi:eye-outline" />
                </button>
            </div>
            <div :class="cartQuantity > 0
                    ? 'opacity-100'
                    : 'group-hover:opacity-100 opacity-0'
                " class="absolute bottom-0 left-0 right-0 flex items-center justify-center text-white transition-opacity duration-300 bg-black bg-opacity-90">
                <button class="w-full py-2" @click="addCart(product)">
                    <Icon name="mdi:cart-outline" class="relative w-6 h-6 cursor-pointer" />
                    Add To Cart ({{ cartQuantity }})
                </button>
            </div>
        </div>
        <NuxtLink :to="`/product/${product.id}`">
            <div class="mt-4 text-left">
                <h3 class="text-lg font-semibold"> <LimitTitle :title="product.name" :length="limitData" /></h3>
                <div class="flex items-center gap-4 mt-2">
                    <div class="text-primary"> <Currency :amount="product.current_price"/> </div>
                    <div class="line-through text-secondary" v-if="product.regular_price>0"><Currency :amount="product.regular_price"/></div>
                </div>
                <div class="flex items-center mt-2">
                    <Rating v-if="product?.feedbacks?.length > 0" class="mt-2" :rating="5" :height=32 :width=32 />
                    <Rating v-else class="mt-2" :rating="0" :height=28 :width=28 />
                    <span class="ml-2 text-sm text-gray-500 mt-1">
                        ({{ product?.feedbacks?.length > 0 ?  (totalRatings/product?.feedbacks?.length).toFixed(1) : 0 }})
                    </span>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<style scoped>
.word {
    color: red;
}
</style>
