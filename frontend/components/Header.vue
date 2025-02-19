<script setup>
import { ref } from "vue";
import Sidebar from "primevue/sidebar";
import { useWebSettingsStore } from '@/stores/web';
import { useTokenStore } from "@/stores/token";
import { useCartsStore } from "@/stores/carts";


const carts = useCartsStore();
const tokenStore = useTokenStore();
const token = useTokenStore();
const isLoggedIn = tokenStore.isAuthenticated;

//web_setting data fetching
const webSettingsStore = useWebSettingsStore();

const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
	"Accept": "application/json",
	"App-Master-Key": `${MasterKey}`,
	"Authorization": `Bearer ${token.token}`
});



const visibleRight = ref(false);

const toggleSidebar = () => {
	visibleRight.value = !visibleRight.value;
};

const isMenuOpen = ref(false);
const isSearch = ref(false);
const isMobileDropdownOpen = ref(false);
const isDesktopDropdownOpen = ref(false);
const searchLength = ref(0)
const topTitle = ref("");

// Mobile  view
const MobilesearchQuery = ref("");
const MobilesearchResults = ref();
const MobileisSearching = ref(false);
const MobilesearchLength = ref(0);

const searchQuery = ref("");
const searchResults = ref();
const isSearching = ref(false);

const MobiledebounceTimer = ref(null);
const debounceTimer = ref(null);

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};
const search = () => {
	isSearch.value = !isSearch.value;
};
const toggleMobileDropdown = (value) => {
	isMobileDropdownOpen.value = value;
};
const toggleDesktopDropdown = (value) => {
	isDesktopDropdownOpen.value = value;
};

const menus = [
	{ text: "Home", link: "/" },
	{ text: "Contact", link: "/contact" },
	{ text: "About", link: "/about" },
	{ text: "Sign Up", link: "/account/signup" },
];

// desktop view

const fetchSearchResults = async (query) => {


	if (!query.trim()) {
		searchResults.value = {};
		searchLength.value = 0;
		isSearching.value = false;

		return;
	}
	// console.log(query);


	isSearching.value = true;

	try {
		const { data } = await $fetch(`${EndPoint}/products?name=${query}`,

			{

				method: 'get',
				headers: headers.value,

			},
		);

		searchResults.value = data;
		searchLength.value = searchResults.value.length


	} catch (error) {
		console.error("Error fetching search results:", error);

	}


};


const handleInputChange = (event) => {
	const query = event.target.value;
	// Clear the previous timer to reset the delay
	clearTimeout(debounceTimer.value);

	debounceTimer.value = setTimeout(() => {
		fetchSearchResults(query);
		// console.log(query);
	}, 300);

};


//  mobile view for search
const MobilefetchSearchResults = async (query) => {

	if (!query.trim()) {
		MobilesearchResults.value = {};
		MobilesearchLength.value = 0;
		MobileisSearching.value = false;

		return;
	}
	// console.log(query);


	MobileisSearching.value = true;

	try {
		const { data } = await $fetch(`${EndPoint}/products?name=${query}`,

			{

				method: 'get',
				headers: headers.value,

			},
		);

		MobilesearchResults.value = data;
		MobilesearchLength.value = MobilesearchResults.value.length


	} catch (error) {
		console.error("Error fetching search results:", error);

	}


};


const MobilehandleInputChange = (event) => {
	const query = event.target.value;

	// Clear the previous timer to reset the delay
	clearTimeout(MobiledebounceTimer.value);

	debounceTimer.value = setTimeout(() => {
		MobilefetchSearchResults(query);
		// console.log(query);
	}, 300);

};


// fetching data for top header


onMounted(async () => {
	// supporting url
	// const response = await $fetch(`${EndPoint}/web_settings?group=topheader&data=all`, {
	// 	headers: headers.value,
	// });

	// // ascending order
	// response.map((item) => {
	// 	if (item.field_name === 'title') {
	// 		topTitle.value = item.value;
	// 	}

	// })

	await webSettingsStore.fetchWebSettings();

	if (webSettingsStore.webSettings) {
    webSettingsStore.webSettings.map((item) => {
		// store the top header group data
      if (item.field_name == 'title' && item.group == 'topheader') {
        topTitle.value = item.value;
      }
    
    });
  } else {
    console.error('webSettings is null or empty');
  }
	


});





// logout handler
const logout = () => {
	tokenStore.removeToken();

};

</script>
<template>
	<div class="sticky top-0 z-50">

		<!-- <Head>
			<Title>Shipping</Title>
			<Meta name="description" content="This is product Description" />
			<link rel="shortcut icon" href="/images/fevicon.png" type="image/x-icon" />
		</Head> -->
		<!-- Top header -->
		<div v-if="topTitle !== ''" class="hidden px-4 py-2 text-white bg-black md:flex lg:px-6">
			<div class="md:w-10/12 flex items-center justify-between mx-auto">
				<div class="flex-1 text-center">
					<span class="text-sm">
						<!-- Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! -->
						{{ topTitle }}
					</span>
					<a href="/category/116" class="hover:underline">
						<span class="ml-4 font-semibold text-white">ShopNow</span>
					</a>
				</div>
				<div class="flex">
					<!-- <select class="px-2 py-1 ml-4 text-white bg-transparent border-0 rounded-md hover:text-black hover:bg-gray-100 focus:outline-none">
				<option value="en">English</option>
				<option value="fr">Français</option>
			</select> -->
				</div>
			</div>
		</div>
		<!-- Main header -->
		<header class=" bg-white border-b pt-4">
			<div class="w-10/12 flex items-center justify-between py-1 mx-auto">
				<!-- Logo -->
				<div class="flex items-center">
					<NuxtLink to="/">
						<span class="text-xl font-bold">
							<NuxtImg height="45" src="/images/logo.png" alt="logo" />
						</span>
					</NuxtLink>
				</div>
				<!-- Navigation Links for larger screens -->
				<nav class="hidden space-x-10 lg:flex">
					<NuxtLink v-for="menu in menus" :key="menu.text" :href="menu.link"
						class="font-bold text-black text-md hover:underline">{{ menu.text }}</NuxtLink>
				</nav>
				<!-- Icons and Menu button -->
				<div class="relative flex items-center justify-center space-x-2">
					<!-- Search icon and search box for smaller screens -->
					<div class="lg:hidden">
						<div>
							<button class="text-gray-600 hover:text-black focus:outline-none">
								<Icon @click="search" name="material-symbols:search" class="w-6 h-6" />
							</button>
						</div>
						<div class="absolute inset-0 z-20 flex items-center justify-center top-20 -left-36 flex-col"
							v-if="isSearch">
							<div class="flex items-center px-4 py-2 space-x-2 bg-white border rounded-md">
								<input v-model="MobilesearchQuery" @keyup="MobilehandleInputChange" type="text"
									placeholder="What are you looking for?"
									class="text-black bg-[#F5F5F5] focus:outline-none" />
								<button @click="search" class="text-gray-600 hover:text-black focus:outline-none">
									<Icon name="material-symbols:close" class="w-6 h-6" />
								</button>
							</div>
							<!-- product search information for mobile -->
							<div v-if="MobilesearchLength > 0"
								:class="MobilesearchLength > 5 ? 'absolute top-6 w-full border bg-white z-50  flex flex-col gap-1 max-h-[20rem] overflow-y-auto' : 'absolute top-10 w-full border bg-white z-50  flex flex-col gap-1'">

								<NuxtLink v-for="(item, index) in MobilesearchResults" :key="index"
									class="flex gap-2 hover:bg-gray-100 items-center p-1 cursor-pointer border-b border-dotted"
									:to="`/product/${item.id}`">
									<div>
										<img :src="item.icon" alt="" class="w-[2rem] h-[2rem]">
									</div>
									<div class="flex flex-col">
										<span class="text-sm font-medium text-gray-500">
											<LimitTitle :title="item.name" length="25" />
										</span>
										<span class="text-sm font-normal text-gray-500">
											<Currency :amount="item.current_price" />
										</span>

									</div>

								</NuxtLink>
								<a href="/product/view/all" class="w-full text-center bg-[#F5F5F5]">
									<button>View All</button>
								</a>
							</div>
							<div v-else-if="MobileisSearching == true && MobilesearchLength <= 0"
								class="absolute top-6 w-full border bg-white z-50 text-center p-2 text-gray-500">
								Product not available
							</div>




						</div>

					</div>
					<!-- Icons mobile -->
					<!-- wishlist -->
					<NuxtLink to="/wishlist" class="text-gray-600 lg:hidden hover:text-black focus:outline-none">
						<Icon name="mdi:heart-outline" class="flex items-center justify-center w-6 h-6" />
					</NuxtLink>
					<!-- user for mobile -->
					<div class="relative lg:hidden">
						<button @mouseenter="toggleMobileDropdown(true)" @mouseleave="toggleMobileDropdown(false)"
							class="text-gray-600 hover:text-black focus:outline-none">
							<Icon name="mdi:account" class="flex items-center justify-center w-6 h-6" />
						</button>
						<div v-if="isMobileDropdownOpen"
							class="mobile-dropdown absolute right-0 z-50 mt-2 w-48 bg-white shadow-lg"
							@mouseenter="toggleMobileDropdown(true)" @mouseleave="toggleMobileDropdown(false)">


							<NuxtLink v-if="isLoggedIn" to="/account/"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Account
							</NuxtLink>
							<NuxtLink v-if="!isLoggedIn" to="/account/login"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log In
							</NuxtLink>
							<NuxtLink v-if="!isLoggedIn" to="/account/signup"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign
								Up</NuxtLink>
							<NuxtLink v-if="isLoggedIn" @click="logout"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100"><button>LogOut</button>
							</NuxtLink>


						</div>
					</div>
					<!-- cart icon -->
					<div @click="toggleSidebar"
						class="relative text-gray-600 bloc lg:hidden hover:text-black focus:outline-none">
						<Icon name="mdi:cart-outline" class="relative w-6 h-6 cursor-pointer" />
						<div
							class="absolute flex items-center justify-center w-1 h-1 p-3 text-xs font-bold text-white rounded-full -right-3 -top-3 bg-primary">
							{{ carts.totalItem }}
						</div>
					</div>
					<button @click="toggleMenu" class="text-gray-600 lg:hidden hover:text-black focus:outline-none">
						<Icon name="material-symbols:menu" class="w-6 h-6" />
					</button>
					<!-- Search bar -->
					<div class="relative hidden lg:block w-60">
						<div>
							<input type="text" v-model="searchQuery" @keyup="handleInputChange"
								placeholder="What are you looking for?"
								class="w-full text-black px-4 py-2 border rounded-md bg-[#F5F5F5] focus:outline-none" />
							<button class="absolute text-gray-600 transform -translate-y-1/2 right-2 top-1/2">
								<Icon name="material-symbols:search" class="w-5 h-5" />
							</button>
						</div>
						<!-- product search information for desktop -->
						<div v-if="searchLength > 0"
							:class="searchLength > 5 ? 'absolute top-10 w-full border bg-white z-50  flex flex-col gap-1 max-h-[20rem] overflow-y-auto' : 'absolute top-10 w-full border bg-white z-50  flex flex-col gap-1'">

							<NuxtLink v-for="(item, index) in searchResults" :key="index"
								class="flex gap-2 hover:bg-gray-100 items-center p-1 cursor-pointer border-b border-dotted"
								:to="`/product/${item.id}`">
								<div>
									<img :src="item.icon" alt="" class="w-[2rem] h-[2rem]">
								</div>
								<div class="flex flex-col">
									<span class="text-sm font-medium text-gray-500">
										<LimitTitle :title="item.name" length="25" />
									</span>
									<span class="text-sm font-normal text-gray-500">
										<Currency :amount="item.current_price" />
									</span>

								</div>

							</NuxtLink>
							<a href="/product/view/all" class="w-full text-center bg-[#F5F5F5]">
								<button>View All</button>
							</a>
						</div>
						<div v-else-if="isSearching == true && searchLength <= 0"
							class="absolute top-10 w-full border bg-white z-50 text-center p-2 text-gray-500">
							Product not available
						</div>

					</div>

					<!-- Icons desktop-->
					<!-- wishlist -->
					<NuxtLink to="/wishlist" class="hidden text-gray-600 lg:block hover:text-black focus:outline-none">
						<Icon name="mdi:heart-outline" class="w-6 h-6" />
					</NuxtLink>
					<!-- user for desktop -->
					<div class="relative hidden lg:block">
						<button @mouseenter="toggleDesktopDropdown(true)" @mouseleave="toggleDesktopDropdown(false)"
							class="text-gray-600 hover:text-black focus:outline-none">
							<Icon name="mdi:account" class="w-6 h-6" />
						</button>
						<div ref="desktopDropdown" v-if="isDesktopDropdownOpen"
							class="desktop-dropdown absolute -right-40 top-[18px] z-50 mt-2 w-48 bg-white shadow-lg"
							@mouseenter="toggleDesktopDropdown(true)" @mouseleave="toggleDesktopDropdown(false)">
							<NuxtLink v-if="isLoggedIn" to="/account/"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Account
							</NuxtLink>
							<NuxtLink v-if="!isLoggedIn" to="/account/login"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log In
							</NuxtLink>
							<NuxtLink v-if="!isLoggedIn" to="/account/signup"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign
								Up</NuxtLink>
							<NuxtLink v-if="isLoggedIn" @click="logout"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100"><button>LogOut</button>
							</NuxtLink>

						</div>
					</div>
					<!-- cart icon -->
					<div @click="toggleSidebar"
						class="relative hidden text-gray-600 bloc lg:block hover:text-black focus:outline-none">
						<Icon name="mdi:cart-outline" class="relative w-6 h-6 cursor-pointer" />
						<div
							class="absolute flex items-center justify-center w-1 h-1 p-3 text-xs font-bold text-white rounded-full -right-3 -top-3 bg-primary cursor-pointer">
							{{ carts.totalItem }}
						</div>
					</div>
					<Sidebar v-model:visible="visibleRight" header="Your Cart" position="right" class="w-[22rem]">
						<Cart />
					</Sidebar>
				</div>
			</div>
			<!-- Sidebar menu for mobile and tablet -->
			<transition name="slide">
				<div v-if="isMenuOpen" class="fixed inset-y-0 z-50 flex">
					<div class="flex-1 h-full bg-black opacity-50" @click="toggleMenu"></div>
					<div class="flex flex-col h-full p-6 space-y-4 overflow-y-auto bg-white shadow-md opacity-95 w-80">
						<button @click="toggleMenu"
							class="flex items-center mb-6 text-gray-600 hover:text-black focus:outline-none">
							<Icon name="material-symbols:close" class="w-6 h-6" />
						</button>
						<Category />
					</div>
				</div>
			</transition>
		</header>
	</div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}

.slide-enter,
.slide-leave-to {
	transform: translateX(-100%);
}
</style>

<style>
.p-sidebar-content {
	padding: 0;
}
</style>
