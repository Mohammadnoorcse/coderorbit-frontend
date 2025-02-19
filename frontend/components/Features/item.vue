<script setup>
import { Icon } from '@iconify/vue';
import { useWebSettingsStore } from '@/stores/web';

//web_setting data fetching
const webSettingsStore = useWebSettingsStore();

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const headers = ref({
	Accept: "application/json",
	"App-Master-Key": `${MasterKey}`,
});


const featuresData = ref({
	firstItem:{
		title:'',
		subtitle:''
	},
	secondItem:{
		title:'',
		subtitle:''
	},
	thirdItem:{
		title:'',
		subtitle:''
	},
	fourItem:{
		title:'',
		subtitle:''
	},

})

onMounted(async () => {

	// FeaturesItem data fetching

	// const features = await $fetch(`${EndPoint}/web_settings?group=features&data=all`, {
	// 	headers: headers.value,
	// });

	// features.map((item) => {
	// 	if (item.field_name === 'title1') {
	// 		featuresData.value.firstItem.title = item.value;
	// 	}
	// 	if (item.field_name === 'sub_title1') {
	// 		featuresData.value.firstItem.subtitle = item.value;
	// 	}
	// 	if (item.field_name === 'title2') {
	// 		featuresData.value.secondItem.title = item.value;
	// 	}
	// 	if (item.field_name === 'sub_title2') {
	// 		featuresData.value.secondItem.subtitle = item.value;
	// 	}
	// 	if (item.field_name === 'title3') {
	// 		featuresData.value.thirdItem.title = item.value;
	// 	}
	// 	if (item.field_name === 'sub_title3') {
	// 		featuresData.value.thirdItem.subtitle = item.value;
	// 	}
	// 	if (item.field_name === 'title4') {
	// 		featuresData.value.fourItem.title = item.value;
	// 	}
	// 	if (item.field_name === 'sub_title4') {
	// 		featuresData.value.fourItem.subtitle = item.value;
	// 	}
	await webSettingsStore.fetchWebSettings();

	if (webSettingsStore.webSettings) {
		webSettingsStore.webSettings.map((item) => {
			if (item.field_name == 'title1' && item.group == 'features') {
				featuresData.value.firstItem.title = item.value;
			}
			if (item.field_name == 'sub_title1' && item.group == 'features') {
				featuresData.value.firstItem.subtitle = item.value;
			}
			if (item.field_name == 'title2' && item.group == 'features') {
				featuresData.value.secondItem.title = item.value;
			}
			if (item.field_name == 'sub_title2' && item.group == 'features') {
				featuresData.value.secondItem.subtitle = item.value;
			}
			if (item.field_name == 'title3' && item.group == 'features') {
				featuresData.value.thirdItem.title = item.value;
			}
			if (item.field_name == 'sub_title3' && item.group == 'features') {
				featuresData.value.thirdItem.subtitle = item.value;
			}
			if (item.field_name == 'title4' && item.group == 'features') {
				featuresData.value.fourItem.title = item.value;
			}
			if (item.field_name == 'sub_title4' && item.group == 'features') {
				featuresData.value.fourItem.subtitle = item.value;
			}
			
		});
	}
})

</script>

<template>
	<div class="pt-10 pb-10">
		<div  class="grid grid-cols-1 gap-6 md:grid-cols-4">
			<!-- <div v-for="(feature, index) in features" :key="index" class="flex flex-col items-center text-center">
				<div class="flex items-center justify-center w-12 h-12 mb-2 bg-gray-300 rounded-full">
					<div class="flex items-center justify-center p-1 w-8 h-8 rounded-full bg-dark">
						<Icon v-if="feature.icon !== 'custom-call-support'" :icon="feature.icon"
							class="text-3xl text-white" />
						<Icon v-else icon="mdi:headset" class="text-3xl text-white" />
					</div>
				</div>
				<h3 class="text-sm font-bold">{{ feature.title }}</h3>
				<p class="text-xs text-dark">{{ feature.description }}</p>
			</div> -->

			<div  class="flex flex-col items-center text-center">
				<div class="flex items-center justify-center w-12 h-12 mb-2 bg-gray-300 rounded-full">
					<div class="flex items-center justify-center p-1 w-8 h-8 rounded-full bg-dark">
						<Icon  icon="mdi:truck-fast-outline" class="text-3xl text-white" />
					</div>
				</div>
				<h3 v-if="featuresData.firstItem.title !== ''" class="text-sm font-bold">{{ featuresData.firstItem.title }}</h3>
				<h3 v-if="featuresData.firstItem.title === ''" class="text-sm font-bold">FREE AND FAST DELIVERY</h3>

				<p v-if="featuresData.firstItem.subtitle !== ''"class="text-xs text-dark">{{ featuresData.firstItem.subtitle }}</p>
				<p v-if="featuresData.firstItem.subtitle === ''"class="text-xs text-dark">Free delivery for all orders over BD 3000</p>
			</div>
			<div  class="flex flex-col items-center text-center">
				<div class="flex items-center justify-center w-12 h-12 mb-2 bg-gray-300 rounded-full">
					<div class="flex items-center justify-center p-1 w-8 h-8 rounded-full bg-dark">
						<Icon  icon="mdi:headset" class="text-3xl text-white" />
					</div>
				</div>
				<h3 v-if="featuresData.secondItem.title !== ''" class="text-sm font-bold">{{ featuresData.secondItem.title }}</h3>
				<h3 v-if="featuresData.secondItem.title === ''" class="text-sm font-bold">24/7 CUSTOMER SERVICE</h3>

				<p v-if="featuresData.secondItem.subtitle !== ''"class="text-xs text-dark">{{ featuresData.secondItem.subtitle }}</p>
				<p v-if="featuresData.secondItem.subtitle === ''"class="text-xs text-dark">Friendly 24/7 customer support</p>
			</div>
			<div  class="flex flex-col items-center text-center">
				<div class="flex items-center justify-center w-12 h-12 mb-2 bg-gray-300 rounded-full">
					<div class="flex items-center justify-center p-1 w-8 h-8 rounded-full bg-dark">
						<Icon  icon="mdi:shield-check-outline" class="text-3xl text-white" />
					</div>
				</div>
				<h3 v-if="featuresData.thirdItem.title !== ''" class="text-sm font-bold">{{ featuresData.thirdItem.title }}</h3>
				<h3 v-if="featuresData.thirdItem.title === ''" class="text-sm font-bold">MONEY BACK GUARANTEE</h3>

				<p v-if="featuresData.thirdItem.subtitle !== ''"class="text-xs text-dark">{{ featuresData.thirdItem.subtitle }}</p>
				<p v-if="featuresData.thirdItem.subtitle === ''"class="text-xs text-dark">We return money within 30 days</p>
			</div>
			<div  class="flex flex-col items-center text-center">
				<div class="flex items-center justify-center w-12 h-12 mb-2 bg-gray-300 rounded-full">
					<div class="flex items-center justify-center p-1 w-8 h-8 rounded-full bg-dark">
						<Icon  icon="mdi:secure-outline" class="text-3xl text-white" />
					</div>
				</div>
				<h3 v-if="featuresData.fourItem.title !== ''" class="text-sm font-bold">{{ featuresData.fourItem.title }}</h3>
				<h3 v-if="featuresData.fourItem.title === ''" class="text-sm font-bold">SAFE AND SECURE</h3>

				<p v-if="featuresData.fourItem.subtitle !== ''"class="text-xs text-dark">{{ featuresData.fourItem.subtitle }}</p>
				<p v-if="featuresData.fourItem.subtitle === ''"class="text-xs text-dark">Ensuring safe and reliable transactions.</p>
			</div>
		</div>
	</div>
</template>



<style scoped>
.word {
	color: red;
}
</style>
