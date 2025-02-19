<script setup>
const crumbs = [{ name: "Home", link: "/" }, { name: " Profile" }];

import Dropdown from "primevue/dropdown";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";



import { useCartsStore } from "@/stores/carts";
import { useTokenStore } from "@/stores/token";
// import { Countdown } from "#build/components";
const login = useTokenStore();

const route = useRoute();
const router = useRouter();

const token = useTokenStore();
const carts = useCartsStore();

const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

//meta seo data
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName;
const MetaIcon = config.public.metaApplicationIcon;

//Loading State
const isLoading = ref(false)

const selectedPolice = ref();
const selectedCity = ref();
const selectedCountry = ref();

const countries = ref({})
const districts = ref({})
const polices = ref({})
const working = ref('Update');
const passwordMessage = ref(false);


//Define Page Meta
definePageMeta({
	layout: "account",
	middleware: ['auth'],
})

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



// Fetch countries on mount
onMounted(async () => {
  isLoading.value = true;
  try {
    countries.value = await $fetch(`${EndPoint}/countries?data=all`, {
      headers: headers.value,
    });

    // Set initial values from user data
    selectedCountry.value = token.userData?.country_id || null;

    if (selectedCountry.value) {
      await getDistrict(selectedCountry.value);
    }
  } catch (err) {
    console.error("Error fetching countries:", err);
  } finally {
    isLoading.value = false;
  }
});

// Fetch districts based on selected country
const getDistrict = async (countryId) => {
	if (!countryId || typeof countryId !== "number") return;

  isLoading.value = true;
  try {
    districts.value = await $fetch(`${EndPoint}/district/${countryId}`, {
      headers: headers.value,
    });

    // Reset dependent fields only if the country ID has changed
    if (selectedCountry.value !== token.userData?.country_id) {
      selectedCity.value = null;
      selectedPolice.value = null;
    } else {
      // Set initial city from user data if available
      selectedCity.value = token.userData.extend_props?.city_id || null;
      if (selectedCity.value) {
        await getThana(selectedCity.value);
      }
    }
  } catch (err) {
    console.error("Error fetching districts:", err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch police stations based on selected district
const getThana = async (districtId) => {
 if (!districtId || typeof districtId !== "number") return;

  isLoading.value = true;
  try {
    polices.value = await $fetch(`${EndPoint}/police_station/${districtId}`, {
      headers: headers.value,
    });

    // Reset dependent fields only if the district ID has changed
    if (selectedCity.value !== token.userData.extend_props?.city_id) {
      selectedPolice.value = null;
    } else {
      selectedPolice.value = token.userData.extend_props?.thana_id || null;
    }
  } catch (err) {
    console.error("Error fetching police stations:", err);
  } finally {
    isLoading.value = false;
  }
};

// Watch for changes in selectedCountry
watch(selectedCountry, async (newCountry, oldCountry) => {
  if (newCountry !== oldCountry) {
    // Reset districts and polices when country changes
    districts.value = [];
    polices.value = [];
    selectedCity.value = null;
    selectedPolice.value = null;

    if (newCountry) {
      await getDistrict(newCountry);
    }
  }
});

// Watch for changes in selectedCity
watch(selectedCity, async (newCity, oldCity) => {
  if (newCity !== oldCity) {
    polices.value = [];
    selectedPolice.value = null;

    if (newCity) {
      await getThana(newCity);
    }
  }
});



const userData = ref({
	name: token.userData.name,
	// mobile: token.userData.mobile,
	email: token.userData.email,
	extend_props: {
		mobile:token.userData.extend_props?.mobile,
		address: token.userData.extend_props?.address,
		country_id: selectedCountry.value,
		city_id: selectedCity.value,
		thana_id: selectedPolice.value,
	},

	oldPassword: '',
	password: '',
	password_confirmation: '',
})



// Validate user data before submission
const validateUserData = () => {
	if (userData.value.password !== userData.value.password_confirmation) {
		alert("Passwords do not match!");
		return false;
	}

	if(userData.value.password === userData.value.password_confirmation && userData.value.password !==''){
      passwordMessage.value = true;
	  return true;
	}

	return true;


}

const orderSubmit = async () => {

	if (!validateUserData()) return;

	working.value = 'Working Process ...'
	isLoading.value = true;

	try {

		isLoading.value = true;

		const { data, status } = await useFetch(`${EndPoint}/profile/${token.userData.id}`, {
			method: 'post',
			headers: headers.value,
			body: {
				'name': userData.value.name,
				'password': userData.value.password,
				'password_confirmation': userData.value.password_confirmation,
				'country_id': selectedCountry.value,
				'extend_props': {
					'mobile': userData.value.extend_props.mobile,
					'address': userData.value.extend_props.address,
					'city_id': selectedCity.value,
					'thana_id': selectedPolice.value
				}

			}
		})

		if (status.value === 'success') {
			alert('Profile update successfully');
			passwordMessage.value = false;

			 // Update store with new data
			token.setUserData({

				name: userData.value.name,
				email: userData.value.email,
				country_id:selectedCountry.value,
				extend_props: {

				mobile: userData.value.extend_props.mobile,
				address: userData.value.extend_props.address,
				city_id: selectedCity.value,
				thana_id: selectedPolice.value,
        },

		
      });
	  passwordMessage.value = false;
		}

	} catch (err) {
		console.log(err)
		isLoading.value = false;
	} finally {

		working.value = 'Done';
		isLoading.value = false;

	}


}






</script>

<template>
	<Seo :metaData="seoData"/>
	<!-- about us banner -->
	<NuxtLayout name="account">
		<div class="xl:px-36 px-4 mb-20 w-full">

			<div class="grid md:grid-cols-12 grid-cols-1 gap-6">

				<div class="md:col-span-8 col-span-12">
					<div class="shadow p-6 rounded">
						<!-- <h2 class="text-lg text-primary font-semibold mb-4">
							Edit Your Profile {{ token.userData }}
						</h2> -->
						<div class="grid md:grid-cols-12 grid-cols-1 gap-x-6">
							<div class="md:col-span-6 col-span-12 mb-2">
								<InputContactInputField type="text" id="name" label="Name" v-model="userData.name" />
							</div>
							<div class="md:col-span-6 col-span-12 mb-2">
								<InputContactInputField type="text" id="mobile" label="Mobile"  v-model="userData.extend_props.mobile" />
							</div>
							<div class="md:col-span-6 col-span-12 mb-2">
								<InputContactInputField type="email" id="email" label="Email"  v-model="userData.email"/>
							</div>
							<div class="md:col-span-6 col-span-12 mb-2">
								<InputContactInputField type="text" id="address" label="Address" v-model="userData.extend_props.address"/>

							</div>
						</div>

						<!-- select Thana -->

						<div class="rounded justify-center w-full mb-2">
							<label class="text-gray-700 font-medium text-sm">Country</label>
							<Dropdown  v-model="selectedCountry" editable :options="countries" @change="getDistrict"
								optionValue="id" optionLabel="name" class="w-full p-1 px-2 bg-light border"
								placeholder="Select a Country" />
						</div>
						<!-- select city -->

						<div class="rounded justify-center w-full mb-3">
							<label class="text-gray-700 font-medium text-sm">District/City</label>
							<Dropdown v-model="selectedCity" editable :options="districts" @change="getThana"
								optionValue="id" optionLabel="name" placeholder="Select a Thana"
								class="w-full p-1 px-2 bg-light border" />
						</div>
						<!-- select conuntry -->

						<div class="rounded  justify-center w-full mb-3">
							<label class="text-gray-700 font-medium text-sm">Thana/Police Station</label>
							 <Dropdown v-model="selectedPolice" editable :options="polices" optionValue="id" optionLabel="name" placeholder="Select a City" class="w-full p-1 px-2 bg-light  border" />
						</div>

						<div class="rounded  justify-center w-full mb-3">
							<label for="oldPass" class="text-gray-700 font-medium text-sm">Password Changes</label>

							<InputContactInputField inputType="password" class="mb-2" id="oldpass" 
							 placeholder="Current Password" v-model="userData.oldPassword"/>
							

						</div>
						<div class="rounded  justify-center w-full mb-3">
							<label for="newPass" class="text-gray-700 font-medium text-sm">New Password</label>

							<InputContactInputField inputType="password"  class="mb-2" id="newPass"
							 placeholder="New Password" v-model="userData.password"/>

						</div>
						<div class="rounded  justify-center w-full mb-3">
							<label for="passCon" class="text-gray-700 font-medium text-sm">Confirm Password</label>

							<InputContactInputField inputType="password" class="mb-2" id="passCon"
							 placeholder="Confirm Password" v-model="userData.password_confirmation"  />

						</div>

						<div v-if="passwordMessage" class="text-sm text-red-600">
  							Password updated Now login time using this password
						</div>


						<div class="text-end md:mt-4 space-x-2">
							<button type="button" @click="orderSubmit"
								class="focus:outline-none text-white bg-primary hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
								{{ working }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>


<style>
.account .p-inputtext {
	font-size: 15px !important;
	color: #343a40;
}
</style>