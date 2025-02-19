<script setup>
import { ref } from "vue";
import { useCartsStore } from "@/stores/carts";


const carts = useCartsStore();

const slides = ref([]);
const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const arrivals = ref([]);
const hotdeal = ref([]);

definePageMeta({
	layout: "home",
});


// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

//meta seo data
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName
const MetaIcon = config.public.metaApplicationIcon



const headers = ref({
	Accept: "application/json",
	"App-Master-Key": `${MasterKey}`,
});

// Meta data from env file
const seoData = ref({
	name:`${MetaName}::Home`,
	productUrl:`${MetaUrl}`,
	icon:`${MetaIcon}`,

})



onMounted(async () => {


	const { data, status } = await useAsyncData('cart-discount', async () => {
		const [slides, product, categories, brand, arrivals, hotdeal] = await Promise.all([
			$fetch(`${EndPoint}/slide?data=all&status=1`, {
				method: "get",
				headers: headers.value,
			}),

			$fetch(`${EndPoint}/category/with_data/99?orderBy=desc&limit_per_page=8&relative=feedbacks`, {
				method: "get",
				headers: headers.value,
			}),

			$fetch(`${EndPoint}/category`, {
				method: "get",
				headers: headers.value,
			}),

			$fetch(`${EndPoint}/brand?limit_per_page=10`, {
				method: "get",
				headers: headers.value,
			}),

			$fetch(`${EndPoint}/category/with_data/99?orderBy=desc&limit_per_page=4&relative=feedbacks`, {
				method: "get",
				headers: headers.value,
			}),

			$fetch(`${EndPoint}/category/with_data/107?orderBy=desc&limit_per_page=1&relative=feedbacks`, {
				method: "get",
				headers: headers.value,
			}),
		])

		return {slides, product, categories, brand, arrivals, hotdeal }
	})

	slides.value = data.value?.slides;
	products.value = data.value?.product?.products.data;
	arrivals.value = data.value?.arrivals?.products.data;
	hotdeal.value = data.value?.hotdeal?.products.data;
	categories.value = data.value?.categories?.data;
	brands.value = data.value?.brand?.data;
	
});







</script>

<template>
	<NuxtLayout name="home">
		<Seo :metaData="seoData"/>
		<div class="md:px-4 md:pb-6 pb-2">
			<!-- <CategorySlider class="md:w-10/12 mx-auto" /> -->
				<div class="border-b md:w-10/12 mx-auto">
					<div class="grid grid-cols-1 md:grid-cols-12">
						<div class="hidden col-span-12 lg:col-span-3 lg:flex">
							<Category class="md:border-e" />
						</div>
						<div class="col-span-12 lg:col-span-9">
							<!-- <Banner :slides="slides" /> -->
							 <Slider :slides="slides"/>
						</div>
					</div>
				</div>
		</div>

		<div class="md:w-10/12 px-4 md-px-0 w-full mx-auto">
			<FeaturesItem  />

			<FeaturesOffers />

			<FeaturesCategories :categories="categories" />

			<div class="flex items-center justify-between mb-8 text-left mt-16">
				<TitleWithSub title="This Month" subtitle="Best Selling Products" />
				<NuxtLink to="/product/view/bestSell">
					<Button class="w-32"> View All </Button>
				</NuxtLink>
				
			</div>
			
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<template v-if="products.length > 0">
					<ProductCard class="mt-8 md:mt-10" v-for="product in products" :key="product.id" :product="product" />
				</template>
			</div>

			<ProductNewArrival v-if="products.length > 0" :arrivals="products" />

			<ProductOur />

			<Brand :brands="brands" />

			<FlashSale :product="hotdeal" />
			<!-- <FlashSale category="Categories" :headline="hotdeal[0]?.name" :imageSrc="hotdeal[0]?.icon" imageAlt="JBL Speaker" buttonText="Buy Now!" :endTime="new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000)" /> -->
		</div>
	</NuxtLayout>
</template>