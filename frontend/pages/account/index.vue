<script setup>
import { ref } from "vue";

import { useDataDate } from '~/composables/useDataDate';
import { useTokenStore } from "@/stores/token";
import ColumnGroup from "primevue/columngroup";


const { dateMonthFunction, dateFunction } = useDataDate();

const token = useTokenStore();

//Define Page Meta
definePageMeta({
	layout: "account",
	middleware: ['auth'],
})

//Loading State
const isLoading = ref(false)
const links = ref({});
const currentPage = ref();

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

//meta seo data
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName;
const MetaIcon = config.public.metaApplicationIcon;


const headers = ref({
	"Accept": "application/json",
	"App-Master-Key": `${MasterKey}`,
	"Authorization": `Bearer ${token.token}`
});

// Meta data from env file
const seoData = ref({
	name:`${MetaName}::Account`,
	productUrl:`${MetaUrl}`,
	icon:`${MetaIcon}`,

})

const invoices = ref([]);
const popUp = ref('');


onMounted(async () => {

	isLoading.value = true;

	try {

		let data = await $fetch(`${EndPoint}/customer/dashboard?limit_per_page=10`,
			{
				headers: headers.value
			});

		invoices.value = data.orders?.data;
		links.value = data?.orders;
		currentPage.value = data?.orders?.current_page;

		console.log(invoices.value);

	} catch (err) {
		console.log(err)
	} finally {

		isLoading.value = false
	}
})


const paginate = async (pageNo) => {


	// // for next pagination function
	// if (pageNo == 'next') {
	// 	pageNo = parseInt(currentPage.value) + 1;
	// }

	// // for previous pagination function
	// if (pageNo == 'previous') {
	// 	pageNo = parseInt(currentPage.value) - 1;
	// }

	if (pageNo == 'next' ) {

		if(links.value.current_page < links.value.last_page){
			// console.log('hii');
			pageNo = parseInt(currentPage.value) + 1;
		}

	}

	// for previous pagination function
	if (pageNo == 'previous') {

		if(links.value.current_page>=1){
	
			pageNo = parseInt(currentPage.value) - 1;

		}
	}

	


	if (currentPage.value != pageNo && pageNo > 0) {

		isLoading.value = true;

		const data = await $fetch(`${EndPoint}/customer/dashboard?limit_per_page=10&page=${pageNo}`,
			{
				method: 'get',
				headers: headers.value,
				// body: {
				// 	'rattings' : selectedRating.value,
				// 	'colors' : selectedColors.value,
				// 	'sizes' : selectedSizes.value,
				// 	'category_ids' : selectedCats.value,
				// 	'brand_ids' : selectedBrands.value,
				// }
			}

		)


		invoices.value = data.orders?.data;
		links.value = data?.orders;
		currentPage.value = data?.orders?.current_page;

	}

}

const showPopUP = async (id) => {

	popUp.value = id;

}
const cencelPopUP = async () => {

	popUp.value = null;

}

const productDelete = async (id) => {



	const { data, status } = await useFetch(`${EndPoint}/admin/${MasterKey}/order_status`, {
		method: 'post',
		headers: headers.value,
		body: {
			"order_id": id,
			"confirm_id": 6
		}
	})

	if (status.value === "success") {
		popUp.value = null;
	}

	console.log(data);


}


</script>

<template>
	<Seo :metaData="seoData"/>
	<!-- about us banner -->
	<NuxtLayout name="account">
		<div class="md:col-span-8 col-span-12">
			<div class="relative overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-[#7D8184]">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								SL
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Name
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Invoice#
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Qty
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Total
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Date
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						<tr class="odd:bg-white even:bg-gray-50 border-0" v-for="(invoice, index) in invoices"
							:key="index">
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{{ index + 1 }}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<div class="flex" v-for="item in invoice?.order_items ">
									<div class="col">
										<NuxtImg :src="item.icon" alt="Product Image" class="w-8 h-8 object-cover" />
									</div>
									<div class="col pl-1" :title="item.item_name">
										<LimitTitle :title="item.item_name" length="25" />
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<NuxtLink :to="`/account/order/${invoice.unique_id}`"
									class="text-blue-500 hover:underline">{{ invoice.unique_id }}</NuxtLink>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{{ invoice.quantity }}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								<Currency :amount="invoice.total" />
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{{ dateFunction(invoice.created_at) }}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{{ invoice.status?.name }}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
								<!-- {{ invoice.action }} -->
								<!-- {{ invoice.unique_id }} -->

								<div class="flex gap-1" v-if="invoice.status?.name === 'Pending'">
									<button @click="showPopUP(invoice.unique_id)">Cancel</button>
                                    <NuxtLink  :to="`/account/order/${invoice.unique_id}`" class="text-blue-500 hover:underline">view</NuxtLink>

								</div>
								

								<NuxtLink v-else :to="`/account/order/${invoice.unique_id}`"
									class="text-blue-500 hover:underline">view</NuxtLink>


							</td>

							
							<div v-if="popUp === invoice.unique_id " class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
								
								<div class="fixed inset-0  transition-opacity" aria-hidden="true"></div>

								<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
									<div
										class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				
										<div
											class="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
											<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
												<div class="sm:flex sm:items-start">
													<div
														class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
														<svg class="size-6 text-red-600" fill="none" viewBox="0 0 24 24"
															stroke-width="1.5" stroke="currentColor" aria-hidden="true"
															data-slot="icon">
															<path stroke-linecap="round" stroke-linejoin="round"
																d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
														</svg>
													</div>
													<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
														<h3 class="text-base font-semibold text-gray-900"
															id="modal-title">Cancel Order</h3>
														<div class="mt-2">
															<p class="text-sm text-gray-500">Are you sure you want to cancel?</p>
														</div>
													</div>
												</div>
											</div>
											<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
												<button @click="productDelete(invoice.unique_id)" type="button"
													class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Confirm</button>
												<button @click="cencelPopUP()" type="button"
													class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
											</div>
										</div>
									</div>
								</div>
							</div>



						</tr>


					</tbody>
				</table>
				<pagination @paginate="paginate" :links="links.links" />
			</div>
		</div>
	</NuxtLayout>
</template>


<style scoped>
tr,
td {
	border: 0;
}
</style>