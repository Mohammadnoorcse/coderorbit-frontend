<script>
import { Swiper, SwiperSlide } from 'swiper/vue'; // Import Swiper Vue components
import 'swiper/css'; // Import core Swiper styles
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { ref, computed } from 'vue'; // Composition API
import { Autoplay,EffectFade, Navigation, Pagination } from 'swiper/modules'; // Import required Swiper modules

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    props: {
        slides: {
            type: Array,
            required: true,
        },
    },
    
  setup(props) {
    // Reactive Swiper modules
    const modules = ref([Autoplay,EffectFade, Navigation, Pagination]);
    // Computed property to validate slides
    const hasSlides = computed(() => props.slides && props.slides.length > 0);

        return {
            modules,
            hasSlides,
        };
    },
};

</script>

<template>
    <div v-if="hasSlides">
        <swiper
            :spaceBetween="30"
            :effect="'fade'"
            :navigation="true"
            :pagination="{ clickable: true }"
            :autoplay="{delay: 3000, disableOnInteraction: false}"
            :modules="modules"
            class="mySwiper">
            <swiper-slide v-for="(slide, index) in slides" :key="index">
                <img :src="slide.thumbnails" :alt="slide.alt" />
            </swiper-slide>
        </swiper>
    </div>
    <div v-else>
        <p>No slides available</p>
    </div>
</template>

<style scoped>
.mySwiper {
    width: 100%;
    height: 400px;
    border: none !important;
}

.mySwiper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


@media(max-width:1024px) {
    .mySwiper {

        height: 300px;
        border: none !important;
    }
}
</style>
