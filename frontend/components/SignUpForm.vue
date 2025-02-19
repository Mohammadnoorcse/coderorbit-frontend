<script setup>
import Dropdown from "primevue/dropdown";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useSignUpStore } from "@/stores/register";
import { useTokenStore } from "@/stores/token";

const register = useSignUpStore();
const router = useRouter();
const token = useTokenStore();
const selectedCountry = ref(18);
const countries = ref()

const form = reactive({
	name: "",
	email: "",
	password: "",
	password_confirmation: "",
	country_id: selectedCountry.value,
});


const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
	"Accept": "application/json",
	"App-Master-Key": `${MasterKey}`
});



// Fetch countries on mount
onMounted(async () => {
  try {
	countries.value = await $fetch(`${EndPoint}/countries?data=all`, {headers:headers.value});
            
    selectedCountry.value = 18;
 
  } catch (err) {
    console.error(err);
  }
});





async function handleRegister() {
	try {
		const res = await register.signup(form);
		if (res.success) {
			router.push("/");
		} else {
			console.error("Registration failed:", res);
		}
	} catch (error) {
		console.error("Error during registration:", error);
	}
}

// const name = ref("");
// const email = ref("");
// const password = ref("");

// const handleSubmit = () => {
//   console.log("Form submitted", {
//     name: name.value,
//     email: email.value,
//     password: password.value,
//   });
// };

const signUpWithGoogle = () => {
	// Add sign-up with Google logic here
	console.log("Sign up with Google");
};
</script>
<template>
	<div class="w-full p-4 rounded-md lg:pe-36">
		<div class="text-center lg:text-left">
			<h2 class="mb-4 text-3xl font-bold">Create an account</h2>
			<p class="mt-6 text-base font-medium text-dark">
				Enter your details below
			</p>
			<form @submit.prevent="handleRegister" class="pt-6 text-center lg:text-left">
				<InputField id="name" placeholder="Name" v-model="form.name"
					dynamicClass="w-full mt-4 border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
				<InputField id="email" type="email" placeholder="Email or Phone Number" v-model="form.email"
					dynamicClass="w-full border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
				<!-- <InputField id="country" type="number" placeholder="Country code" v-model="form.country_id"
					dynamicClass="w-full border-b border-gray-300 p-4 bg-transparent focus:outline-none" /> -->

					<div class="rounded justify-center w-full mb-3">
                        <label class="text-gray-700 font-medium text-sm">Country</label>
                        <Dropdown v-model="selectedCountry" editable :options="countries"  optionValue="id" optionLabel="name" class="w-full p-1 px-2 bg-light border" placeholder="Select a Country" />
						<!-- {{ countries }} -->
                        
                    </div>
					
				<InputField id="password" type="password" placeholder="Password" v-model="form.password"
					dynamicClass="w-full  border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
				<InputField id="password" type="password" placeholder="Confirm Password"
					v-model="form.password_confirmation"
					dynamicClass="w-full  border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
				<button type="submit" class="w-full py-3 mb-4 text-white rounded-md bg-primary hover:bg-danger">
					Create Account
				</button>
				<div class="flex flex-col items-center lg:items-start">
					<button type="button" class="w-full py-3 mb-4 border border-gray-300 rounded-md hover:bg-gray-100"
						@click="signUpWithGoogle">
						<Icon name="logos:google-icon" class="w-5 h-5 mr-4" />
						Sign up with Google
					</button>
					<div class="">
						<p class="w-full">
							Already have an account?
							<router-link to="/account/login" class="text-black underline hover:underline">Log
								in</router-link>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
