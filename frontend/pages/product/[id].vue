<script setup>
import { ref, onMounted } from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useCartsStore } from "@/stores/carts";
import { useWishlistStore } from "@/stores/wishlist";
import { useLoginStore } from "@/stores/login";
import { useRouter } from "vue-router";


import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";





const login = useLoginStore();
const carts = useCartsStore();
const wishlists = useWishlistStore();
const route = useRoute();
const router = useRouter();

const wishlist = ref(false);
const loadingStatus = ref('pendding');

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
let productId = route.params.id;
// current image
const setImage = ref();
const message = ref('');

const feedbacks = ref([]);
const totalRatings = ref(0);
const ratings = ref([0, 0, 0, 0, 0]);



const selectedSize = ref("");
const selectedColor = ref("");
const quantity = ref(1);


// submited rating
const rating = ref(0);
const hoverIndex = ref(0);

// additional 
const additionalValue = ref();
const additionalMediaValue = ref();

const setRating = (value) => {
	rating.value = value;
};

const hoverRating = (value) => {
	hoverIndex.value = value;
};


const customTabStyle = ref({
	headerTitle: {
		class: "text-dark",
	},

	headerAction: {
		class: "text-black",
	},
});


const visibleCount = ref(5);

const visibleComments = computed(() =>
	feedbacks.value.slice(0, visibleCount.value)
);

const showMoreComments = () => {

	visibleCount.value = (visibleCount.value + 5);
};

const closeMoreComments = () => {
	visibleCount.value = 5
}

const headers = ref({
	Accept: "application/json",
	"App-Master-Key": `${MasterKey}`,
	"Authorization": `Bearer ${login.accessToken}`,

});

const details = ref();


const { data: exploreData, status } = await useFetch(`${EndPoint}/product/${productId}?&relative=feedbacks,categories,additional`,
	{
		method: 'get',
		headers: headers.value,
	}
)

loadingStatus.value = status.value;

console.table(exploreData);


let relativeProducts = [];

if (status.value === 'success') {

	exploreData.value.categories?.forEach((products, index) => {

		products?.relative_product.forEach((product, index) => {

			if (product.id != exploreData.value.id) {
				relativeProducts.push(product)
			}

		})

	})

	console.log(relativeProducts);


	feedbacks.value = exploreData.value.feedbacks;



	details.value = exploreData.value
	console.table(details.description?.blocks)

	if (exploreData.value?.additional != undefined) {

		// Random size select here
		let selectedSizeFirst = exploreData.value?.additional[0]?.size;
		selectedSize.value = selectedSizeFirst;

		// Random color select here
		let selectedColorFirst = exploreData.value?.additional[0]?.color;
		// selectedColor.value = selectedColorFirst[Math.floor(Math.random() * selectedColorFirst.length)];
		selectedColor.value = selectedColorFirst;

	}







	totalRatings.value = exploreData.value.feedbacks?.reduce((sum, feedback) => sum + feedback.rattings, 0);

	exploreData.value.feedbacks?.forEach((element, index) => {

		if (element.rattings == 5) {

			ratings.value[0] = (++ratings.value[0])

		} else if (element.rattings == 4) {
			ratings.value[1] = (++ratings.value[1])
		}
		else if (element.rattings == 3) {
			ratings.value[2] = (++ratings.value[2])
		}
		else if (element.rattings == 2) {
			ratings.value[3] = (++ratings.value[3])
		} else {
			ratings.value[4] = (++ratings.value[4])
		}
	});


}




// Send Feedback function call here

const sendFeedback = async () => {

	let feedbackData = {
		"vendor_id": exploreData.value.vendor_id,
		"product_id": exploreData.value.id,
		"rattings": rating.value,
		"comments": message.value
	}

	const res = await useFetch(`${EndPoint}/feedback`, {
		headers: headers.value,
		method: 'POST',

		body: feedbackData
	})


}


const delivery = ref({
	freeDelivery: "Home Delivery",
	return: "Return Delivery",
	verifiedTitle: "Trust & Secured",
	deliveryDetails: "Enter your postal code for Delivery Availability",
	returnDelivery: "Free 30 Days Delivery Returns. Details",
	verified: "Refers to a product or service that prioritizes safety, reliability, and data protection",

	actions: {
		addToCart: "Add To Cart",
		wishlist: "Add to Wishlist",
		buyNow: "Buy Now",
	},
});



//fillting  for addition details
const additionHandler = () => {
	// let a = "68";
	// "68_green_s_40"
	// console.log(a.concat('_',selectedColor.value,"_",selectedSize.value));
	let additiona_id = productId.concat('_', selectedColor.value.toLowerCase(), "_", selectedSize.value.toLowerCase());


	// Find the matching item in the `additional` array
	let matchedItem = exploreData.value?.additional.find((item) => item.additional_key === additiona_id);

	if (matchedItem) {
		additionalValue.value = matchedItem;
		
		console.log("Matched Item:", matchedItem); // Debugging log
	} else {
		console.warn("No matching item found for ID:", additiona_id);
	}

	// addition_media image 
	let additional_media_id = productId.concat('_',selectedColor.value.toLowerCase());

	let mediaItem = exploreData.value?.additional_media.find((item) => item.slug === additional_media_id);

	if (mediaItem) {
		additionalMediaValue.value = mediaItem;
		
		console.log("Additional Media Item:", mediaItem); // Debugging log
	} else {
		console.warn("No matching item found for ID:", additionalMediaValue);
	}

	


}

additionHandler();



// Clickable function for slide

function showFullImage(image) {
	setImage.value = image;

}


const selectSize = (size) => {
	selectedSize.value = size;
	additionHandler();
};

const selectColor = (color) => {
	selectedColor.value = color;

	additionHandler();

};
console.log("selectedcolor: ", selectedColor.value);


const increaseQuantity = () => {
	quantity.value += 1
};

// Method to decrease item quantity
const decreaseQuantity = () => {

	if (quantity.value > 1) {
		quantity.value -= 1
	}

};


// Pinia
const addCart = (product) => {

	product['quantity'] = quantity;

	carts.addToCart(product);

	quantity.value = product['quantity'];
};


// Pinia
const buyNow = (product) => {

	product['quantity'] = quantity;

	carts.addToCart(product);

	router.push("/checkout");
};


const limitData = ref(20)
const seeLimit = ref(0)
const seeid = ref()
// ullist function call goes here
const seeMoreFunction = (limit, seeId) => {
	seeLimit.value = limit;
	seeid.value = seeId;
}

console.log("additionalvalue", additionalValue.value);

</script>

<template>

	<NuxtLayout name="home">

		<template v-if="loadingStatus != 'success'">
			<div>Please wait...</div>
		</template>

		<template v-else>
			<!-- <Head>
				<Title>{{ details.name }}</Title>
				<Meta name="description" content="This is product Description" />
			</Head> -->
			<Seo :metaData="details" />
			<!-- {{ additionalValue }} -->
			<div class="xl:px-36 px-4 w-full md:flex">
				<div class="md:w-1/2 md:px-6 w-full">

					<!-- <div class="mt-4 md:h-5/6">
						<swiper :slides-per-view="1" :pagination="{ clickable: true }"
							:autoplay="{ delay: 1500, disableOnInteraction: false }" :modules="[Autoplay, Navigation]"
							effect="coverflow" class="mySwiper">
							<swiper-slide v-for="(img, index) in details.gallery" :key="index">
								<NuxtImg :src="img" format="webp" class="cursor-pointer mx-auto" :key="img"
									@click="showFullImage(img)" alt="Thumbnail" />
							</swiper-slide>
						</swiper>
					</div> -->
					<div class="mt-4 md:h-5/6">
						<swiper :slides-per-view="1" :pagination="{ clickable: true }"
							:autoplay="{ delay: 1500, disableOnInteraction: false }" :modules="[Autoplay, Navigation]"
							effect="coverflow" class="mySwiper">
							<swiper-slide v-for="(img, index) in additionalMediaValue?.color_galleries" :key="index">
								<NuxtImg :src="img" format="webp" class="cursor-pointer mx-auto" :key="img"
									@click="showFullImage(img)" alt="Thumbnail" />
							</swiper-slide>
						</swiper>
					</div>
				</div>
				<div class="md:w-1/2 w-full md:mt-4">
					<div class="col-span-12 lg:col-span-5">
						<div class="bg-white mx-auto">
							<h2 class="text-xl border-b pb-6 text-gray-700">{{ details.name }}</h2>
							<h2 class="text-xl mt-3 semibold">{{ feedbacks.length > 0 ?
								(totalRatings / feedbacks.length).toFixed(1) : 0 }}</h2>

							<div class="flex items-center mt-2 mb-3">
								<Rating v-if="feedbacks.length > 0" class="mt-2"
									:rating="Math.floor(totalRatings / feedbacks.length)" :height=28 :width=28 />
								<Rating v-else class="mt-2" :rating="0" :height=28 :width=28 />

								<span class="text-gray-600 ml-2">({{ feedbacks.length }} Reviews)</span>
								<span class="px-2">|</span>
								<span class="text-green-500">Available : {{ details.stock }}</span>

							</div>
							<!-- <div class="text-2xl font-bold mb-3">{{ details.current_price }} <del class="text-red-500" >{{ details.regular_price }}</del></div> -->
							<!-- <div class="text-2xl font-bold mb-3">
								<Currency :amount="details.current_price" /> <del class="text-red-500"
									v-if="details.regular_price > 0">
									<Currency :amount="details.regular_price" />
								</del>
							</div> -->
							<div class="text-2xl font-bold mb-3">
								<Currency :amount="additionalValue.current_price" /> <del class="text-red-500"
									v-if="additionalValue.regular_price > 0">
									<Currency :amount="additionalValue.regular_price" />
								</del>
							</div>
							<p class="text-gray-700 pb-3 border-b">{{ details.seo_description }}</p>
							<!-- colors -->
							<div class="my-3">
								<div class="flex space-x-2">
									<span class="block font-semibold mb-1">Colours:</span>
									<button v-for="color in details.attributes?.colors?.split(',')" :key="color"
										@click="selectColor(color)" :class="[
											'px-3 py-1 border rounded',
											{ 'bg-gray-300 border-red-500': color === selectedColor },
										]">
										{{ color }}
									</button>
								</div>
							</div>
							<!-- size -->
							<div class="mb-3">
								<div class="flex space-x-2">
									<span class="block font-semibold mb-1">Size:</span>
									<button v-for="size in details.attributes?.sizes?.split(',')" :key="size"
										@click="selectSize(size)" :class="['px-3 py-1 border rounded', { 'bg-gray-200 border-red-500': size === selectedSize },
										]">
										{{ size }}
									</button>
								</div>
							</div>
							<div class="flex gap-4 mb-3">
								<div class="relative flex items-center max-w-[9rem]">
									<button
										class="bg-gray-100 flex justify-center items-center hover:bg-gray-200 border border-gray-300 rounded-s p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
										@click="decreaseQuantity">
										<Icon class="h-5 w-5 text-gray-800" name="ic:baseline-minus" />
									</button>
									<input type="number" v-model="quantity" min="1"
										class="bg-gray-50 border border-gray-300 h-11 text-center focus:outline-none text-gray-900 text-sm focus:ring-blue-500 block w-full py-2.5" />
									<button
										class="bg-gray-100 flex justify-center items-center hover:bg-gray-200 border border-gray-300 rounded-e p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
										@click="increaseQuantity">
										<Icon class="h-5 w-5 text-gray-800" name="ic:baseline-plus" />
									</button>
								</div>
								<button class="px-4 bg-[#0C7649] text-white py-2 rounded w-72"
									@click="addCart(details)"> {{ delivery.actions.addToCart }} </button>
								<button class="border border-gray-300 h-11 text-dark py-2 px-3 rounded"
									@click="addToWishlist(details)">
									<Icon :name="wishlist ? 'fluent:heart-28-filled' : 'fluent:heart-28-regular'"
										:class="['text-xl', { 'text-primary': wishlist }]" />
								</button>

								
							</div>
							<button class="flex-1 w-full bg-primary text-white py-2 h-11 rounded mb-3"
								@click="buyNow(details)">

								{{ delivery.actions.buyNow }}

							</button>

						</div>
					</div>
					<!-- share to social -->
					<!-- <button class="border border-gray-500 h-11 text-white px-2 py-1 rounded">
								<Icon class="h-6 w-6 text-gray-800" name="gg:facebook" />
							</button> -->
					<div class="rounded border border-gray-300 mt-4">
						<div class="flex gap-2 border-b p-3">
							<span>
								<Icon class="h-10 w-10" name="iconoir:delivery-truck" />
							</span>
							<div>
								<span class="block font-semibold">{{ delivery.freeDelivery }}</span>
								<p>{{ delivery.deliveryDetails }}</p>
							</div>
						</div>
						<div class="flex gap-2 border-b p-4">
							<span>
								<Icon class="h-10 w-10" name="icon-park-outline:return" />
							</span>
							<div>
								<span class="block font-semibold">{{ delivery.return }}</span>
								<p>{{ delivery.returnDelivery }}</p>
							</div>
						</div>
						<div class="flex gap-2 p-4">
							<span>
								<Icon class="h-10 w-10" name="tdesign:secured" />
							</span>
							<div>
								<span class="block font-semibold">{{ delivery.verifiedTitle }}</span>
								<p>{{ delivery.verified }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="xl:px-36 px-4 w-full">

				<div class="ps-6 py-2 bg-[#EFEDED]">
					<p>Ratings & Reviews</p>
				</div>
				<div class="grid grid-cols-12 mt-4 gap-6">
					<div class="col-span-12 md:col-span-3 md:border-e ps-6">
						<div class="flex items-center">
							<div class="text-4xl font-bold">{{ feedbacks.length > 0 ?
								(totalRatings / feedbacks.length).toFixed(1) : 0 }} </div>
							<div class="flex py-1 px-3 text-sm text-white items-center gap-1 bg-[#FF8A00] mt-2 ml-2">
								<Icon name="wpf:star" class="relative cursor-pointer w-4 h-4" />
								<p v-if="Math.floor(totalRatings / feedbacks.length).toFixed(1) > 4"
									class="font-semibold text-base text-dark">Best Quality</p>
								<p v-else-if="Math.floor(totalRatings / feedbacks.length).toFixed(1) > 3"
									class="font-semibold text-base text-dark">Very Good</p>
								<p v-else-if="Math.floor(totalRatings / feedbacks.length).toFixed(1) > 2"
									class="font-semibold text-base text-dark">Good</p>
								<p v-else class="font-semibold text-base text-dark">Need Improve</p>
							</div>
						</div>
						<div>
							<Rating v-if="feedbacks.length > 0" class="mt-2"
								:rating="Math.floor(totalRatings / feedbacks.length)" :height=28 :width=28 />
							<Rating v-else class="mt-2" :rating="0" :height=28 :width=28 />
							<p class="mt-2">{{ feedbacks.length }} Ratings</p>
						</div>

					</div>
					<div class="col-span-12 md:col-span-6 lg:col-span-4 mt-3 md:mt-0">
						<div v-for="(count, index) in ratings" :key="index" class="flex items-center">
							<div class="w-20 text-right">
								<Rating :rating="(5 - index)" />
							</div>
							<div class="relative w-full h-2 bg-gray-300 rounded mx-2">
								<div :style="{ width: ((count / feedbacks.length) * 100) + '%' }"
									class="absolute h-full bg-orange-500 rounded"></div>
							</div>
							<div class="w-12 text-right">{{ count }} </div>
						</div>
					</div>
				</div>

				<!-- product description -->
				<div class="product-details-tab">
					<TabView class="mt-16">
						<!-- Product Details -->
						<TabPanel header="Product Details" :pt="customTabStyle">

							<div class="w-full" v-for="(block, index) in details.description?.blocks" :key="block">
								<template v-if="block.type === 'header'">
									<h1 class="font-bold text-xl mt-8 mb-2" v-if="block.data.level === 1"
										v-html="block.data.text"></h1>
									<h2 class="font-bold text-lg mt-8 mb-2" v-else-if="block.data.level === 2"
										v-html="block.data.text"></h2>
									<h3 class="font-bold text-md mt-8 mb-2" v-else-if="block.data.level === 3"
										v-html="block.data.text"></h3>
									<h4 class="font-bold text-sm mt-8 mb-2" v-else-if="block.data.level === 4"
										v-html="block.data.text"></h4>
									<h5 class="font-bold text-xs mt-8 mb-2" v-else-if="block.data.level === 5"
										v-html="block.data.text"></h5>
									<h6 class="font-bold text-xs mt-8 mb-2" v-else-if="block.data.level === 6"
										v-html="block.data.text"></h6>
								</template>
								<p class="" v-if="block.type === 'paragraph'" v-html="block.data.text"></p>

								<!-- <NestedList :items="block?.data" v-if="block.type === 'list'" />
								<NestedOrderList :items="block?.data" v-if="block.type === 'ordered'" /> -->

								<NestedList :items="block?.data" v-if="block.data.style === 'unordered'" />
								<NestedOrderList :items="block?.data" v-if="block.data.style === 'ordered'" />

								<table class="custom my-4" v-if="block.type === 'table'">
									<tr v-for="contents in block.data?.content">
										<td v-for="content in contents" v-html="content"></td>
									</tr>
								</table>

								<div v-if="block.type === 'RawTool'" v-html="block.data.html"></div>
							</div>

							<!-- {{ details.description }} -->

							<!-- <div v-html="details.description" ></div> -->


						</TabPanel>
						<!-- comment -->
						<TabPanel :header="`Comments ( ${feedbacks.length})`" :pt="customTabStyle">
							<!-- message -->
							<div class="px-6 pt-8">
								<!-- submitted rating -->

								<div class="flex space-x-1">
									<span v-for="(star, index) in 5" :key="index" @click="setRating(index + 1)"
										@mouseover="hoverRating(index + 1)" @mouseleave="hoverRating(0)"
										class="cursor-pointer">
										<Icon name="wpf:star" class="relative cursor-pointer w-4 h-4"
											:class="['h-8 w-8', { 'text-[#FF8A00]': hoverIndex >= index + 1 || rating >= index + 1, 'text-gray-300': hoverIndex < index + 1 && rating < index + 1, }]" />
									</span>
								</div>

								<!-- submitted rating end -->
								<InputTextArea class="md:mt-4" rows=5 id="phone" placeholder="Your Feedback"
									v-model="message" />
								<div class="text-end md:mt-4">
									<button type="button" @click="sendFeedback"
										class="focus:outline-none text-white bg-primary hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
										Send Feedback
									</button>
								</div>
							</div>
							<div class="mt-8 md:mt-14 ps-6">
								<TitleWithSub title="Comments" />
								<hr class="relative top-[-40px] ms-36" />
							</div>
							<!-- comment list -->
							<div class="mt-4 ps-6">
								<div class="flex items-center mt-8" v-for="(comment, index) in visibleComments"
									:key="index">

									<template v-if="++index <= visibleCount">
										<div class="flex-shrink-0">
											<img class="w-12 h-12 bg-gray-300 rounded-full" alt="" />
										</div>

										<div class="ml-4">
											<h4 class="font-bold">{{ comment?.customer.name }}</h4>
											<div class="flex">
												<Rating :rating=comment.rattings />
											</div>

											<p class="mt-2 text-gray-700">

												<template v-if="comment?.id == seeid">
													{{ comment?.comments.substring(0, seeLimit) }}
													<NuxtLink v-if="comment?.comments.length > seeLimit"
														@click="seeMoreFunction(comment?.comments.length, comment?.id)"
														class="cursor-pointer text-blue-600"> ...See more</NuxtLink>
												</template>
												<template v-else>
													{{ comment?.comments.substring(0, limitData) }}
													<NuxtLink
														@click="seeMoreFunction(comment?.comments.length, comment?.id)"
														class="cursor-pointer text-blue-600"> ...See more</NuxtLink>
												</template>
											</p>
										</div>
									</template>
								</div>

								<div class="flex items-center justify-center w-full md:pt-16 pt-8"
									v-if="visibleComments.length < feedbacks.length">
									<div class="relative w-full ms-16" @click="showMoreComments">
										<div class="absolute inset-0 flex items-center">
											<div class="w-full border-t border-gray-300"></div>
										</div>
										<div class="relative flex justify-center">
											<div
												class="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer">
												<span class="text-black">
													<Icon class="h-6 w-6 text-gray-800"
														name="ri:arrow-down-double-line" />
												</span>
											</div>
										</div>
									</div>
								</div>
								<div class="flex items-center justify-center w-full md:pt-16 pt-8" v-else>
									<div class="relative w-full ms-16" @click="closeMoreComments">
										<div class="absolute inset-0 flex items-center">
											<div class="w-full border-t border-gray-300"></div>
										</div>
										<div class="relative flex justify-center">
											<div
												class="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer">
												<span class="text-black">
													<Icon class="h-6 w-6 text-gray-800"
														name="ri:arrow-up-double-line" />
												</span>
											</div>
										</div>
									</div>
								</div>

							</div>
						</TabPanel>
						<!-- QA -->
						<!-- <TabPanel header="QA" :pt="customTabStyle">
							<div class="ms-6">
							<h2 class="text-lg font-semibold bg-gray-300 py-2 ps-4">
								Premium Polo T-Shirt
							</h2>
							<ul class="list-disc ps-12 py-4 space-y-2 bg-gray-100">
								<li>
								<span class="font-semibold">প্রিমিয়াম পোলো টি-শার্ট:</span>
								দৈর্ঘ্যপ্রীতি এবং সহজতা জন্য উচ্চ গুণমানের উপাদান ব্যবহার করে
								নির্মিত।
								</li>
								<li>
								<span class="font-semibold">ক্লাসিক ডিজাইন:</span> সাধারণ ঘুরে
								দেখা যাবে সমস্ততা বিভিন্ন অনুষ্ঠান, সাধারণ বেড়াতে প্রস্তুতি মুক্ত
								স্টাইল।
								</li>
							</ul>
							</div>
						</TabPanel> -->
					</TabView>
				</div>
				<!-- product description -->
				<!-- <ProductDetails /> -->
				<div class="mt-8 md:mt-14">
					<TitleWithSub title="Related Item" subtitle="" />
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
					<ProductCard class="mt-8 md:mt-8" v-for="item in relativeProducts.slice(0, 4)" :key="item.id"
						:product="item" />
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<style scoped>
.word {
	color: red;
}

.custom {
	font-family: Arial, Helvetica, sans-serif;
	border-collapse: collapse;
	min-width: 30%;
}

.custom td,
.custom th {
	border: 1px solid #ddd;
	padding: 3px 5px;
}

.custom tr:nth-child(even) {
	background-color: #f2f2f2;
}

.custom tr:hover {
	background-color: #ddd;
}

.custom th {
	padding-top: 12px;
	padding-bottom: 12px;
	text-align: left;
	background-color: #04AA6D;
	color: white;
}
</style>
