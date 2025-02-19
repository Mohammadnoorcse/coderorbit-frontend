<script setup>
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { onMounted, ref, watch } from "vue";

const items = ref({});
const sortingData = ref([]);
const lastDate = ref({});

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
    "Accept": "application/json",
    "App-Master-Key": `${MasterKey}`
})

onMounted(async () => {

    try {
        let productData = await $fetch(`${EndPoint}/products?orderByOfferDate=desc&limit_per_page=10&relative=feedbacks`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        items.value = productData.data
        sortingData.value = items.value;


    const offerDate = sortingData.value.filter((post) => {
                if (new Date(post.end_offer).getTime() >= new Date().getTime()) {
                    return post.end_offer;
                }
            });

    lastDate.value = offerDate.sort((a,b) => {b.end_offer - a.end_offer}).shift(0);


    } catch (err) {
        console.log(err)
    }
 

})



const showFlashSale = ref(true);


const responsiveOptions = { 
    320: {
        slidesPerView: 1,
        spaceBetween: 10,
    },
    560: {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    768: {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    1024: {
        slidesPerView: 4,
        spaceBetween: 30,
    },
};

    const swiperInstance = ref(null);
    const prevEl = ref(null);
    const nextEl = ref(null);

    const navigationOptions = ref({});


    onMounted(() => {
        navigationOptions.value = {
            prevEl: prevEl.value,
            nextEl: nextEl.value,
        };
    });




</script>

<template>
    <div class="relative mx-auto mt-10">
        <div class="flex justify-between mb-4">
            <div class="flex flex-row  gap-4">
                <TitleWithSub title="Today's" subtitle="Flash Sales" />

                <Countdown :class="'reverse flex-col items-center justify-center text-dark flex-col-reverse hidden md:flex'" :endTime="new Date(lastDate?.end_offer)" />
            </div>
            <div class="absolute top-0 right-0 flex items-center justify-center space-x-2">
                <button ref="prevEl" class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                    @click="prev">
                    <Icon name="mdi:chevron-left" class="text-3xl" />
                </button>
                <button ref="nextEl" class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                    @click="next">
                    <Icon name="mdi:chevron-right" class="text-3xl" />
                </button>
            </div>
        </div>
        <div class="relative" >
            <swiper ref="swiperInstance" 
                :slides-per-view = 4 
                :space-between = 20 
                :breakpoints = responsiveOptions
                :loop = true
                :freeMode = "true"
                :grabCursor = "true"
                :navigation="{
                        prevEl: prevEl,
                        nextEl: nextEl
                    }"

                :autoplay="{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }"
    
                
                :modules="[Pagination, Navigation, Autoplay]" class="mySwiper">
                <swiper-slide v-for="(item, index) in items" :key="index" >
                    <ProductCard class="mt-8 md:mt-10" :product="item" />
                </swiper-slide>
            </swiper>
        </div>
        <div class="flex items-center justify-center py-8 md:py-14">
            <NuxtLink to="/product/view/all">
                <Button class="w-40 text-center"> View All products </Button>
            </NuxtLink>

        </div>
    </div>
</template>

<style scoped>
.word {
    color: red;
}
</style>
