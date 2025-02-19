<script setup>
import { ref } from "vue";
import { useTokenStore } from "@/stores/token";
import { useWebSettingsStore } from '@/stores/web';
import ColumnGroup from "primevue/columngroup";
const token = useTokenStore();
const router = useRouter();


//web_setting data fetching
const webSettingsStore = useWebSettingsStore();
// const webSettings = webSettingsStore.webSettings;

const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

// const support = ref();
// const socialLength = ref(0);
// const supportLength = ref(0);
// const exclusiveLength = ref(0);

// console.log('web setting:',webSettings)

const headers = ref({
	"Accept": "application/json",
	"App-Master-Key": `${MasterKey}`,
	// "Authorization": `Bearer ${token.token}`
});


const email = ref("");
const handleSubmit = () => {
	// Add form submission logic here
	console.log("Form submitted", {
		email: email.value,
	});
};

const suporrtAsde = ref({
	address: '',
	mail: '',
	contact: '',
	new: ''
})

const socialAddress = ref({
	facebook: '',
	instagram: '',
	youtube: ''

})


const exclusiveData = ref({
	text1: '',
	// text2: '',
	// text3: '',
	// text4: ''
})



onMounted(async () => {
	// supporting url
	// const response = await $fetch(`${EndPoint}/web_settings?group=support&data=all`, {
	// 	headers: headers.value,
	// });

	// support.value = response || null;
	// supportLength.value = support.value.length;


	// ascending order
	// response.map((item) => {
	// 	if (item.field_name == 'address' && item.group == 'support') {
	// 		suporrtAsde.value.address = item.value;
	// 	}
	// 	if (item.field_name == 'mail') {
	// 		suporrtAsde.value.mail = item.value;
	// 	}
	// 	if (item.field_name == 'contact') {
	// 		suporrtAsde.value.contact = item.value;
	// 	}
	// 	if (item.field_name == 'new') {
	// 		suporrtAsde.value.new = item.value;
	// 	}
	// })

	// social 
	// const social = await $fetch(`${EndPoint}/web_settings?group=social&data=all`, {
	// 	headers: headers.value,
	// });
	// socialLength.value = social.length;
	// // console.log(socialLength);

	// social.map((item) => {
	// 	if (item.field_name === 'facebook') {
	// 		socialAddress.value.facebook = item.value;
	// 	}
	// 	if (item.field_name === 'instagram') {
	// 		socialAddress.value.instagram = item.value;
	// 	}
	// 	if (item.field_name === 'youtube') {
	// 		socialAddress.value.instagram = item.value;
	// 	}

	// })
   
	// exclusive data fetch

	// const exclusive = await $fetch(`${EndPoint}/web_settings?group=exclusive&data=all`, {
	// 	headers: headers.value,
	// });
	// exclusiveLength.value = exclusive.length;
	// console.log(exclusiveLength);

	// exclusive.map((item) => {
	// 	if (item.field_name === 'title') {
	// 		exclusiveData.value.text1 = item.value;
	// 	}
	// 	// if (item.field_name === 'text2') {
	// 	// 	exclusiveData.value.text2 = item.value;
	// 	// }
	// 	// if (item.field_name === 'text3') {
	// 	// 	exclusiveData.value.text3 = item.value;
	// 	// }
	// 	// if (item.field_name === 'text4') {
	// 	// 	exclusiveData.value.text4 = item.value;
	// 	// }

	// })

	// await settingsStore.fetchSupportData();
   
	await webSettingsStore.fetchWebSettings();

	// fetching supporting group data

  if (webSettingsStore.webSettings) {
    webSettingsStore.webSettings.map((item) => {
		// store the supporting group data
      if (item.field_name == 'address' && item.group == 'support') {
        suporrtAsde.value.address = item.value;
      }
      if (item.field_name == 'mail' && item.group == 'support') {
        suporrtAsde.value.mail = item.value;
      }
      if (item.field_name == 'contact' && item.group == 'support') {
        suporrtAsde.value.contact = item.value;
      }
      if (item.field_name == 'new' && item.group == 'support') {
        suporrtAsde.value.new = item.value;
      }

	// store the social group data

		if (item.field_name === 'facebook' && item.group == 'social') {
			socialAddress.value.facebook = item.value;
		}
		if (item.field_name === 'instagram' && item.group == 'social') {
			socialAddress.value.instagram = item.value;
		}
		if (item.field_name === 'youtube' && item.group == 'social') {
			socialAddress.value.instagram = item.value;
		}
		
		// store the exclusive group data
		if (item.field_name === 'title' && item.group == 'exclusive') {
			exclusiveData.value.text1 = item.value;
		}
    });
  } else {
    console.error('webSettings is null or empty');
  }
	


});



const accountHandler = () => {
	if (token) {
		router.push('/account');
	} else {
		router.push('/account/signup');
	}
}


</script>


<template>
	<footer class="px-4 py-10 mt-10 text-white bg-black">
		<div class="md:w-10/12 gap-8 mx-auto space-y-8 md:grid md:grid-cols-3 lg:grid-cols-5 md:space-y-0">
			<!-- Exclusive Section -->
			<div class="space-y-4">
				<h2 class="text-3xl font-semibold">Exclusive</h2>
				<div class="flex flex-col"  v-if="exclusiveData.text1 !=''">
					<p class="mt-4 text-lg">{{ exclusiveData.text1 }}</p>
					<!-- <p class="text-base">{{ exclusiveData.text2 }}</p>
					<p class="text-base">{{ exclusiveData.text3 }}</p>
					<p class="text-base">{{ exclusiveData.text4 }}</p> -->
					<form @submit.prevent="handleSubmit" class="relative flex mt-4">
						<div class="relative">
							<input type="email" placeholder="Enter Your Email" v-model="email"
								class="bg-transparent w-60 px-4 py-3 border border-[#FAFAFA] rounded-md focus:outline-none" />
							<button class="absolute text-[#FAFAFA] transform -translate-y-1/2 right-2 top-1/2">
								<Icon name="material-symbols:send" class="w-5 h-5" />
							</button>
						</div>
					</form>
				</div>
				<span v-else>Not Available Information</span>
			</div>

			<!-- Support Section -->
			<div>
				<h2 class="font-xl semibold text-">Support</h2>

				<div v-if="suporrtAsde.mail !='' || suporrtAsde.contact !='' || suporrtAsde.address !='' " class="flex flex-col">

					<address class="mt-4 text-base not-italic">
						<!-- {{ suporrtAsde.address }} -->
						{{suporrtAsde.address}}
					</address>
					<p class="mt-2 text-base">
						<NuxtLink :to="`/${suporrtAsde.mail}`" class="hover:underline">{{ suporrtAsde.mail }}</NuxtLink>
					</p>

					<p class="mt-2 text-base">
						<NuxtLink :to="`/${suporrtAsde.contact}`" class="hover:underline">{{ suporrtAsde.contact }}
						</NuxtLink>
					</p>
					<p class="mt-2 text-base">
						<NuxtLink :to="`/${suporrtAsde.new}`" class="hover:underline">{{ suporrtAsde.new }}</NuxtLink>
					</p>

				</div>
				<span v-else>Not Available address</span>



			</div>

			<!-- Account Section -->
			<div>
				<h2 class="font-semibold font-xl">Account</h2>
				<ul class="mt-4 space-y-2 text-base">
					<li @click="accountHandler" class="cursor-pointer">
						<NuxtLink class="hover:underline">My Account</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/account/signup" class="hover:underline">Login / Register</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/cart" class="hover:underline">Cart</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/wishlist" class="hover:underline">Wishlist</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/product/view/all" class="hover:underline">Shop</NuxtLink>
					</li>
				</ul>
			</div>

			<!-- Quick Link Section -->
			<div>
				<h2 class="font-semibold font-xl">Quick Link</h2>
				<ul class="mt-4 space-y-2 text-base">
					<li>
						<NuxtLink to="/policy" class="hover:underline">Privacy Policy</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/terms" class="hover:underline">Terms Of Use</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/faq" class="hover:underline">FAQ</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/contact" class="hover:underline">Contact</NuxtLink>
					</li>
				</ul>
			</div>

			<!-- Download App Section -->
			<div>
				<h2 class="font-semibold font-xl">Download App</h2>
				<p class="mt-4 text-[12px] text-[#FAFAFA]">
					Save $3 with App New User Only
				</p>
				<div class="grid grid-cols-1 lg:gap-x-2 mt-4 md:grid-cols-2">
					<div class="col-span-1 row-span-2">
						<img src="/images/Qrcode.png" alt="QR Code"
							class="object-fill w-28 h-24 lg:h-24 lg:w-full md:object-contain" />
					</div>
					<div class="col-span-1">
						<img src="/images/GooglePlay.png" alt="Download on Google Play"
							class="w-auto h-auto lg:h-12 lg:w-full md:object-fill" />
					</div>
					<div class="col-span-1">
						<img src="/images/app-store.png" alt="Download on App Store"
							class="w-auto h-auto lg:h-10 lg:w-full md:object-fill" />
					</div>
				</div>
				<div v-if="socialAddress.facebook !='' || socialAddress.instagram !='' || socialAddress.youtube !='' "  class="flex mt-4 space-x-10" >
					<a :href="socialAddress.facebook" target="_blank" class="hover:underline">
						<Icon name="brandico:facebook" class="w-5 h-5" />
					</a>

					<a :href="socialAddress.instagram" target="_blank" class="hover:underline">
						<Icon name="ph:instagram-logo" class="w-5 h-5" />
					</a>
					<a :href="socialAddress.youtube" target="_blank" class="hover:underline">
						<Icon name="ri:linkedin-line" class="w-5 h-5" />
					</a>
				</div>
				<span v-else>Can not provide social address</span>
			</div>
		</div>
		<div class="mt-8 text-center text-gray-500">
			<p>Copyright &copy; 2024 Exclusive. All rights reserved</p>
		</div>
	</footer>
</template>
