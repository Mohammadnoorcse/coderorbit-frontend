<script setup>
import { ref, onMounted } from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { useCartsStore } from "@/stores/carts";
import { useWishlistStore } from "@/stores/wishlist";

import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Navigation} from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";



const carts = useCartsStore();
const wishlists = useWishlistStore();
const route = useRoute();

const wishlist = ref(false);
const loadingStatus = ref('pendding');

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
let productId = route.params.id;
// current image
const setImage = ref();

const feedbacks = ref({});
const totalRatings = ref(0);
const ratings = ref([0,0,0,0,0]);


// submited rating
const rating = ref(0);
const hoverIndex = ref(0);

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


const visibleCount = ref(2);

const visibleComments = computed(() =>
    comments.value.slice(0, visibleCount.value)
);

const showMoreComments = () => {
	if (visibleCount.value < comments.value.length) {
		visibleCount.value += 2;
	}
};




const headers = ref({
    Accept: "application/json",
    "App-Master-Key": `${MasterKey}`,
});

const details = ref([]);


onMounted(async () => {

    try {

        const { data: exploreData, status } = await useFetch(`${EndPoint}/product/${productId}?&relative=feedbacks,categories`,
				
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

			loadingStatus.value = status.value;

			if(status == 'success'){
				details.value = exploreData
				feedbacks.value = exploreData.feedbacks

				totalRatings.value = exploreData.feedbacks.reduce((sum, feedback) => sum + feedback.rattings, 0);


				exploreData.feedbacks.forEach((element, index) => {

					if(element.rattings == 5){
						
						ratings.value[0] = (++ratings.value[0])

					}else if(element.rattings == 4){
						ratings.value[1] = (++ratings.value[1])
					}
					else if(element.rattings == 3){
						ratings.value[2] = (++ratings.value[2])
					}
					else if(element.rattings == 2){
						ratings.value[3] = (++ratings.value[3])
					}else{
						ratings.value[4] = (++ratings.value[4])
					}
				});

				setImage.value = exploreData.feature; 
			}
			

        }catch (err) {
        console.log(err);
    }

});

// comment

const comments = ref([
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
	{
		profileImg: "../images/Snapseed.jpg",
		customerName: "Mustak Ahmed",
		commentDescription: `প্রিমিয়াম কোয়ালিটি টি-শার্ট: তৈরিকৃত এবং সংহততার জন্য উচ্চ কাঁচামালের ব্যবহার করে নির্মিত ক্লাসিক ডিজাইন। সাধারণত খুবই ভাল খাবে সতর্কতা বিভিন্ন অনুষ্ঠান, সান্ধ্য বেড়াতে প্রিয় টি-শার্ট।...`,
	},
]);

// // Product details
// const product = ref({
// 	id: 1, // Make sure to have an ID for the product
// 	name: "Havic HV G-92 Gamepad",
// 	image: "/images/Group1000005941.png",
// 	rating: {
// 		value: 4,
// 		reviews: 150,
// 	},
// 	availability: "In Stock",
// 	price: "192.00",
// 	prevPrice: "300.00",
// 	description:
// 		"PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal. Pressure sensitive.",
// 	colors: ["red", "gray", "white", "black"],
// 	sizes: ["XS", "S", "M", "L", "XL"],
	
	
// });


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





// Clickable function for slide

function showFullImage(image) {
	setImage.value = image;

}


const selectedSize = ref("M");
const selectedColor = ref("red");

const selectSize = (size) => {
	selectedSize.value = size;
};

const selectColor = (color) => {
	selectedColor.value = color;
};

const increaseQuantity = (item) => {
	item.quantity += 1;
	carts.updateItem(item);
};

// Method to decrease item quantity
const decreaseQuantity = (item) => {
	if (item.quantity > 1) {
		item.quantity -= 1;
		carts.updateItem(item);
	}
};

// Fetch products
const products = ref([]);
const fetchProducts = async () => {
	try {
		const response = await fetch("/api/products");
		const data = await response.json();
		products.value = data;
	} catch (err) {
		console.error(err);
	}
};



const checkWishlistStatus = () => {
	wishlist.value = wishlists.items.some((item) => item.id === product.value.id);
};

onMounted(() => {
	fetchProducts();
	checkWishlistStatus();
});

// Pinia
const addCart = (product) => {
	carts.addToCart(product);
};

const addToWishlist = (product) => {
	wishlist.value = !wishlist.value;
	if (wishlist.value) {
		wishlists.addToWishlist(product);
	} else {
		wishlists.removeFromWishlist(product.id);
	}
};
</script>

<template>

	<NuxtLayout name="home">

		<template v-if="loadingStatus != 'success'">
			<div>Please wait...</div>
		</template>

		<template v-else>
			<Head>
				<Title>{{ details.name }}</Title>
				<Meta name="description" content="This is product Description" />
			</Head>

			<div class="xl:px-36 px-4 w-full md:flex">
				<div class="md:w-1/2 md:px-6 w-full">

					<div class="mt-4 md:h-5/6">
						<swiper 
							:slides-per-view="1"
							:pagination="{ clickable: true }" 
							:autoplay="{delay: 1500, disableOnInteraction: false}"
							
							:modules="[Autoplay, Navigation]"  effect="coverflow" class="mySwiper">
							<swiper-slide v-for="(img, index) in details.gallery" :key="index">
								<NuxtImg :src="img" format="webp" class="cursor-pointer mx-auto" :key="img" @click="showFullImage(img)" alt="Thumbnail" />
							</swiper-slide>
						</swiper>
					</div>
				</div>
				<div class="md:w-1/2 w-full md:mt-4">
					<div class="col-span-12 lg:col-span-5">
						<div class="bg-white mx-auto">
							<h2 class="text-xl font-semibold">{{ feedbacks.length > 0 ?  (totalRatings/feedbacks.length).toFixed(1) : 0 }}</h2>
							<div class="flex items-center mt-2 mb-3">
								<Rating v-if="feedbacks.length > 0" class="mt-2" :rating="Math.floor(totalRatings/feedbacks.length)" :height=28 :width=28 />
								<Rating v-else class="mt-2" :rating="0" :height=28 :width=28 />

								<span class="text-gray-600 ml-2">({{ feedbacks.length }} Reviews)</span>
								<span class="px-2">|</span>
								<span class="text-green-500">Available : {{ details.stock }}</span>

							</div>
							<div class="text-2xl font-bold mb-3">{{ details.current_price }} <del class="text-red-500">{{ details.regular_price }}</del></div>
							<p class="text-gray-700 pb-3 border-b">{{ details.seo_description }}</p>
							<!-- colors -->
							<div class="my-3">
								<div class="flex space-x-2">
									<span class="block font-semibold mb-1">Colours:</span>
									<button v-for="color in details.additional?.colors?.split(',')" :key="color" @click="selectColor(color)" :class="[
										'px-3 py-1 border border-red-300 rounded',
										{ 'bg-red-300': color === selectedColor },
									]">
										{{ color }}
									</button>
								</div>
							</div>
							<!-- size -->
							<div class="mb-3">
								<div class="flex space-x-2">
									<span class="block font-semibold mb-1">Size:</span>
									<button v-for="size in details.additional?.sizes?.split(',')" :key="size" @click="selectSize(size)" :class="[
										'px-3 py-1 border rounded',
										{ 'bg-gray-200': size === selectedSize },
									]">
										{{ size }}
									</button>
								</div>
							</div>
							<div class="flex gap-4 mb-3">
								<div class="relative flex items-center max-w-[9rem]">
									<button class="bg-gray-100 flex justify-center items-center hover:bg-gray-200 border border-gray-300 rounded-s p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none">
										<Icon class="h-5 w-5 text-gray-800" name="ic:baseline-minus" />
									</button>
									<input type="number" value="1" min="1"
										class="bg-gray-50 border border-gray-300 h-11 text-center focus:outline-none text-gray-900 text-sm focus:ring-blue-500 block w-full py-2.5" />
									<button class="bg-gray-100 flex justify-center items-center hover:bg-gray-200 border border-gray-300 rounded-e p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none">
										<Icon class="h-5 w-5 text-gray-800" name="ic:baseline-plus" />
									</button>
								</div>
								<button class="px-4 bg-[#0C7649] text-white py-2 rounded w-72" @click="addCart(details)"> {{ delivery.actions.addToCart }} </button>
								<button class="border border-gray-300 h-11 text-dark py-2 px-3 rounded" @click="addToWishlist(details)">
									<Icon :name="wishlist ? 'fluent:heart-28-filled' : 'fluent:heart-28-regular'" :class="['text-xl', { 'text-primary': wishlist }]" />
								</button>
							</div>
							<button class="flex-1 w-full bg-primary text-white py-2 h-11 rounded mb-3">
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
					<p>Ratings & Reviews {{ (( totalRatings)) }}</p>
				</div>
				<div class="grid grid-cols-12 mt-4 gap-6">
					<div class="col-span-12 md:col-span-3 md:border-e ps-6">
						<div class="flex items-center">
							<div class="text-4xl font-bold">{{ feedbacks.length > 0 ?  (totalRatings/feedbacks.length).toFixed(1) : 0 }} </div>
							<div class="flex py-1 px-3 text-sm text-white items-center gap-1 bg-[#FF8A00] mt-2 ml-2">
								<Icon name="wpf:star" class="relative cursor-pointer w-4 h-4" />
								<p v-if="Math.floor(totalRatings/feedbacks.length).toFixed(1) > 4" class="font-semibold text-base text-dark">Best Quality</p>
								<p v-else-if="Math.floor(totalRatings/feedbacks.length).toFixed(1) > 3" class="font-semibold text-base text-dark">Very Good</p>
								<p v-else-if="Math.floor(totalRatings/feedbacks.length).toFixed(1) > 2" class="font-semibold text-base text-dark">Good</p>
								<p v-else class="font-semibold text-base text-dark">Need Improve</p>
							</div>
						</div>
						<div>
							<Rating v-if="feedbacks.length > 0" class="mt-2" :rating="Math.floor(totalRatings/feedbacks.length)" :height=28 :width=28 />
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

							<!-- <div class="w-full" v-for="(block, index) in details.description.blocks" :key="block">
								<template v-if="block.type === 'header'">
									<h1 class="font-bold text-xl" v-if="block.data.level === 1" v-html="block.data.text"></h1>
									<h2 class="font-bold text-lg" v-else-if="block.data.level === 2" v-html="block.data.text"></h2>
									<h3 class="font-bold text-md" v-else-if="block.data.level === 3" v-html="block.data.text"></h3>
									<h4 class="font-bold text-sm" v-else-if="block.data.level === 4" v-html="block.data.text"></h4>
									<h5 class="font-bold text-xs" v-else-if="block.data.level === 5" v-html="block.data.text"></h5>
									<h6 class="font-bold text-xs" v-else-if="block.data.level === 6" v-html="block.data.text"></h6>
								</template>
								<p class="" v-if="block.type === 'paragraph'" v-html="block.data.text"></p>
							</div> -->

							{{ details.description }}

							<div v-html="details.description" ></div>
							
							<div class="w-full text-black">fwer sdfasdf asdfasdf sadfsaf asdfasdf sdfasdf asdfasdfasfsdf</div>
							
						</TabPanel>
						<!-- comment -->
						<TabPanel header="Comments (9+)" :pt="customTabStyle">
							<!-- message -->
							<div class="px-6 pt-8">
							<!-- submitted rating -->

							<div class="flex space-x-1">
								<span
								v-for="(star, index) in 5"
								:key="index"
								@click="setRating(index + 1)"
								@mouseover="hoverRating(index + 1)"
								@mouseleave="hoverRating(0)"
								class="cursor-pointer"
								>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									:class="[
									'h-8 w-8',
									{
										'text-[#FF8A00]':
										hoverIndex >= index + 1 || rating >= index + 1,
										'text-gray-300':
										hoverIndex < index + 1 && rating < index + 1,
									},
									]"
									viewBox="0 0 24 24"
								>
									<path
									d="M12 .587l3.668 7.451 8.332 1.209-6.05 5.896 1.429 8.316L12 18.896l-7.379 3.863 1.429-8.316-6.05-5.896 8.332-1.209z"
									/>
								</svg>
								</span>
							</div>

							<!-- submitted rating end -->
							<InputTextArea
								class="md:mt-4"
								rows="5"
								id="phone"
								placeholder="Your Feedback"
								v-model="Message"
							/>
							<div class="text-end md:mt-4">
								<button
								type="button"
								class="focus:outline-none text-white bg-primary hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
								>
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
							<div
								class="flex items-center mt-8"
								v-for="(comment, index) in visibleComments"
								:key="index"
							>
								<div class="flex-shrink-0">
								<img
									class="w-12 h-12 bg-gray-300 rounded-full"
									:src="comment.profileImg"
									alt=""
								/>
								</div>
								<div class="ml-4">
								<h4 class="font-bold">{{ comment.customerName }}</h4>
								<div class="flex">
									<Rating :rating="4" />
								</div>
								<p class="mt-2 text-gray-700">
									{{ comment.commentDescription }}
									<NuxtLink class="cursor-pointer">See More</NuxtLink>
								</p>
								</div>
							</div>

							<div
								class="flex items-center justify-center w-full md:pt-16 pt-8"
								v-if="visibleComments.length < comments.length"
							>
								<div class="relative w-full ms-16" @click="showMoreComments">
								<div class="absolute inset-0 flex items-center">
									<div class="w-full border-t border-gray-300"></div>
								</div>
								<div class="relative flex justify-center">
									<div
									class="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer"
									>
									<span class="text-black">   <Icon class="h-6 w-6 text-gray-800" name="ri:arrow-down-double-line" /> </span>
									</div>
								</div>
								</div>
							</div>
							</div>
						</TabPanel>
						<!-- QA -->
						<TabPanel header="QA" :pt="customTabStyle">
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
						</TabPanel>
					</TabView>
				</div>
				<!-- product description -->
				<!-- <ProductDetails /> -->
				<div class="mt-8 md:mt-14">
					<TitleWithSub title="Related Item" subtitle=""/>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
					<ProductCard class="mt-8 md:mt-8" v-for="item in products.slice(0, 4)" :key="item.id" :product="item" />
				</div>
			</div>
		</template>
	</NuxtLayout>
</template>

<style scoped>
.word {
	color: red;
}
</style>
