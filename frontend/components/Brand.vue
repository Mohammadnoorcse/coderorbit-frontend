<script setup>
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";

const props = defineProps({
    brands:
    {
        type: Object
    }
});


</script>

<template>
	<div>
		<div class="py-10 mt-10">
			<TitleWithSub title="Our Partner" class="pb-10" />
			<swiper :slides-per-view="3" space-between="30" :pagination="{
				clickable: true,
			}" :autoplay="{
			delay: 2500,
			disableOnInteraction: false,
		}" :breakpoints="{
			'300': {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			'768': {
				slidesPerView: 4,
				spaceBetween: 20,
			},
			'1024': {
				slidesPerView: 6,
				spaceBetween: 20,
			},
		}" :modules="[Autoplay]" class="mySwiper">
				<swiper-slide class="" v-for="(item, index) in brands" :key="index">
					<div class="p-4 border">
						<NuxtImg :src="item.thumbnails" :alt="item.name"  class="cursor-pointer object-cover mx-auto object-contain flex items-center justify-center" />
					</div>
				</swiper-slide>
			</swiper>
		</div>
	</div>
</template>

<style setup>
.word {
	color: red;
}
</style>
