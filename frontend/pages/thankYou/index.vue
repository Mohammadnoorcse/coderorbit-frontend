<script setup>

    import { useCartsStore } from "@/stores/carts";
    import { useRouter } from "vue-router";
    import { useLoginStore } from "@/stores/login";

    import { useOrdersStore } from '@/stores/orders';

     const orders = useOrdersStore();

    const carts = useCartsStore();
    const users = useLoginStore();
    const route = useRoute();
    const orderId = ref(0);

    //meta seo data
    const config = useRuntimeConfig();
    const MetaUrl = config.public.metaBaseUrl;
    const MetaName = config.public.metaApplicationName;
    const MetaIcon = config.public.metaApplicationIcon;
    // Meta data from env file
    const seoData = ref({
        name:`${MetaName}::Thank you`,
        productUrl:`${MetaUrl}`,
        icon:`${MetaIcon}`,

    })

    onMounted( async () => {

     carts.$reset()

    })

    
const resetOrders = () => {
    orders.resetOrder();
};


    



    
</script>
<template>
     <Seo :metaData="seoData"/>
    <div class="flex justify-center h-screen bg-gray-100">
        <div class="grid place-content-center w-4/6 md:w-2/6 ">
            <div class="w-full text-center place-content-center">
                <div >
                    <span class="icon-[material-symbols-light--check-circle]" style="width: 60px; height: 60px; color: #00cc44;"></span>
                </div>
                <h2 class="text-4xl text-black font-bold" >Thank You!</h2>
                <h2 v-for="(item,index) in orders.currentOrder" :key="index" class="text-2xl text-black font-semibold mt-2" >Order: {{ item.order_id }}</h2>
        
                
                <p class="text-sm text-black mt-4">We have received your order from mobile, very soon we will contact your. You can find more information on our website & social pages.</p>
            </div>
            <div class="w-full place-content-center p-2 bg-white rounded-lg mt-4">
                <div class="text-lg text-blck w-full font-bold text-center">
                    <h2 >Connect with Us</h2>
                </div>
                <div class="social_icon flex justify-center my-4">
                    <Icon name="formkit:twitter" class="w-12 h-12 mx-1 text-blue-300"/>
                    <Icon name="bi:facebook" class="w-12 h-12 mx-1 text-blue-800"/>
                    <Icon name="entypo-social:youtube-with-circle" class="w-12 h-12 mx-1 text-red-700"/>
                    <Icon name="entypo-social:linkedin-with-circle" class="w-12 h-12 mx-1 text-sky-700"/>
                    <Icon name="mage:instagram-circle" class="w-12 h-12 mx-1 text-orange-700"/>
                </div>
            </div>
            <div class="mt-4 w-full rounded-lg flex justify-between">
                <NuxtLink to="/account" class="text-xl text-black p-2 flex bg-red-700 rounded-lg text-white" @click="resetOrders">
                    <Icon name="icon-park-outline:arrow-left" class="mt-1 mr-1"/>
                    Back to Home
                </NuxtLink>

                <NuxtLink to="/product/view/all" class="text-xl text-black p-2 flex bg-sky-600 rounded-lg text-white" @click="resetOrders">
                    <Icon name="carbon:ai-governance-tracked" class="mt-1 mr-1"/>
                    Visit Shop
                </NuxtLink>

            </div>
        </div>

    </div>
</template>
