<script setup>
import Dropdown from "primevue/dropdown";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useOrdersStore } from '@/stores/orders';

const orders = useOrdersStore();

import { useCartsStore } from "@/stores/carts";
import { useTokenStore } from "@/stores/token";

    const route = useRoute();
    const router = useRouter();

    const token = useTokenStore();
    const carts = useCartsStore();
    //Loading State
    const isLoading = ref(false)
    const working = ref('Place Order')
    // replace with actual API endpoint and master key
    const config = useRuntimeConfig();
    const EndPoint = config.public.baseURl;
    const MasterKey = config.public.masterToken;

     //meta seo data

    const MetaUrl = config.public.metaBaseUrl;
    const MetaName = config.public.metaApplicationName;
    const MetaIcon = config.public.metaApplicationIcon;

    const selectedPolice = ref();
    const selectedCity = ref();
    const selectedCountry = ref();

    const countries = ref({})
    const districts = ref({})
    const polices = ref({})


    const boundle_name = ref('')
    const note = ref('')
    const type = ref("Sigle")
    const promo_code = ref("")
    const discount_by_promo_code = ref(0)
    const promo_code_slug = ref("")
    const payment_type = ref(1)
    const others = ref({})



    const contact = ref({
        name: "",
        address: "",
        email: "",
        mobile: "",
    })

    const headers = ref({
        "Accept": "application/json",
        "App-Master-Key" : `${MasterKey}`,
        "Authorization" : `Bearer ${token.token}`
    });
    
    // Meta data from env file
     const seoData = ref({
        name:`${MetaName}::Checkout`,
        productUrl:`${MetaUrl}`,
        icon:`${MetaIcon}`,

    })

    

    onMounted( async () => {

        isLoading.value = true;
        
        try {
            countries.value = await $fetch(`${EndPoint}/countries?data=all`, {headers:headers.value});
            // console.log(countries);

            selectedCountry.value = 18

            getDistrict(selectedCountry);

        }catch (err) {
        console.log(err)
        } finally {

            isLoading.value = false
        }
    })


    // Get district by country id
    const getDistrict = async (countryId) => {
        districts.value = await $fetch(`${EndPoint}/district/${countryId.value}`, {headers:headers.value});
    }


    // Get district by country id
    const getThana = async (districtId) => {

        polices.value = await $fetch(`${EndPoint}/police_station/${districtId.value}`, {headers:headers.value});

    }

    const crumbs = [
        { name: "View Cart", link: "/cart" },
        { name: "Checkout" },
    ];

    const methods = ref([
        {
            src: "/images/Bkash.png",
            alt: "Bkash",
        },
        {
            src: "/images/Nagad.png",
            alt: "Nagad",
        },
        {
            src: "/images/Mastercard.png",
            alt: "Mastercard",
        },
        {
            src: "/images/Visa.png",
            alt: "Visa",
        },
    ]);

    const shippingCost = ref(0); // Shipping is free

const getDiscount = async () => {

    working.value = 'Working Process ...'
    isLoading.value = true;

    let promo = promo_code.value;

    try {

        let getPromo = await $fetch(`${EndPoint}/coupon/${promo}`, {
            method: 'GET',
            headers:headers.value,
        });
        isLoading.value = true;

        discount_by_promo_code.value = getPromo.data.max_amount;
        promo_code_slug.value = getPromo.data.slug;

        console.log(getPromo)
        

    }catch (err) {
        console.log(err)
        isLoading.value = false;
    } finally {

        working.value = 'Done';
        isLoading.value = false;
    }
}



const orderSubmit = async () => {

    working.value = 'Working Process ...'
    isLoading.value = true;

    contact.value = {
        ...contact.value,
        thana_id: selectedPolice.value,
        city_id: selectedCity.value,
        country_id: selectedCountry.value,
    }

    let data = {
        boundle_name : boundle_name.value,
        note : note.value,
        type : type.value,
        promo_code : promo_code.value,
        discount_by_promo_code : discount_by_promo_code.value,
        promo_code_slug : promo_code_slug.value,
        payment_type : payment_type.value,
        contact : contact.value,
        others: others.value,
        items: carts.items
    }

    try {

        let orderd;

        console.table(token.token)

        if(token.token != ""){
                orderd = await $fetch(`${EndPoint}/order`, {
                method: 'POST',
                headers:headers.value,
                body: data
            });
        }else{
            orderd = await $fetch(`${EndPoint}/general_order`, {
                method: 'POST',
                headers:headers.value,
                body: data
            });

            
        }

      
        isLoading.value = true;
        
        // Save the order in Pinia
        orders.addOrder(orderd.order);

        console.log(orderd);

        if(token.token == ""){
            token.setToken(orderd.loginData.access_token);
            token.setUserData(orderd.loginData.user_data);
        }
        

    }catch (err) {
        console.log(err)
        isLoading.value = false;
    } finally {

        working.value = 'Done';
        isLoading.value = false;

        router.push("/thankYou");
    }



    
}

const totalPrice = computed(() => {
    return carts.items.reduce((total, item) => {
        return total + (item.current_price * item.quantity);
    }, 0);
});





</script>

<template>
    <!-- Meta -->
    <Seo :metaData="seoData"/>
    <!-- about us banner -->
    <NuxtLayout name="home">
       
        <spiner v-if="isLoading" />
        <div class="lg:px-36 px-4 mb-20 w-full">
            <div class="text-left py-4">
                <Breadcrumb :crumbs="crumbs" />
            </div>

            <!-- delivery info -->
            <div class="grid md:grid-cols-12 grid-cols-1 md:gap-6 sm:gap-0">
                <div class="md:col-span-6 col-span-12 ">
                    <InputContactInputField type="text"  label="Your Name" id="name" v-model="contact.name" class="mb-3" />
                    <InputContactInputField type="number" label="Phone Number*" id="phone-number" v-model="contact.mobile" class="mb-3" />

                    <div class="rounded justify-center w-full mb-3">
                        <label class="text-gray-700 font-medium text-sm">Country</label>
                        <Dropdown v-model="selectedCountry" editable :options="countries" @change="getDistrict" optionValue="id" optionLabel="name" class="w-full p-1 px-2 bg-light border" placeholder="Select a Country" />
                        
                    </div>

                    <div class="rounded justify-center w-full mb-3">
                        <label class="text-gray-700 font-medium text-sm">District/City</label>
                        <Dropdown v-model="selectedCity" editable :options="districts" @change="getThana" optionValue="id" optionLabel="name" placeholder="Select a Thana" class="w-full p-1 px-2 bg-light border" />
                    </div>
                    <!-- select city -->

                    <div class="rounded  justify-center w-full mb-3">
                        <label class="text-gray-700 font-medium text-sm">Thana/Police Station</label>
                        <Dropdown v-model="selectedPolice" editable :options="polices" optionValue="id" optionLabel="name" placeholder="Select a City" class="w-full p-1 px-2 bg-light  border" />
                    </div>
                    <!-- select conuntry -->

                    <InputContactInputField type="text" label="Address*" id="street-address" v-model="contact.address" class="mb-3" />
                    <InputContactInputField type="text" label="Note" id="apartment" v-model="note" class="mb-3" />

                    <!-- select Thana -->

                    
                </div>

                <!-- payment info -->
                <div class="md:col-span-6 col-span-12">
                    <div class="space-y-4">
                        <div v-for="item in carts.items" :key="item.id"
                            class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <NuxtImg :src="item.icon" :alt="item.name" class="w-16 h-16" />
                                <div>
                                    <h3 class="text-sm font-medium">{{ item.name }}</h3>
                                    <div class="flex text-xs">
                                        <div>Color: <i>{{ item.color }}</i></div>
                                        <div class="mx-2">Size: <i>{{ item.size }}</i></div>
                                    </div>
                                </div>

                            </div>
                            <div>
                                <span>{{ item.quantity }}</span> x {{ item.current_price }} = <span>{{ item.quantity * item.current_price }}</span>
                            </div>
                        </div>

                        <div class="pt-4">
                            <div class="flex justify-between border-b-[2px] py-2">
                                <p>Subtotal:</p>
                                <!-- <p><Currency :amount="carts.totalPrice" /> </p> -->
                                <p><Currency :amount="totalPrice" /> </p>
                            </div>
                            <!-- <div class="flex justify-between border-b-[2px] py-2">
                                <p>Shipping:</p>
                                <p>Free</p>
                            </div> -->
                            <div class="flex justify-between font-bold py-2">
                                <p>Total:</p>
                                <!-- <p><Currency :amount="carts.totalPrice"/></p> -->
                                <p><Currency :amount="totalPrice"/></p>
                            </div>


                            <div class="flex justify-between py-2" v-if="discount_by_promo_code > 0">
                                <p> Promo <i>{{ promo_code }}</i>:</p>
                                <p>{{ parseInt(discount_by_promo_code) }}</p>
                            </div>

                            <div class="flex justify-between font-bold py-2" v-if="discount_by_promo_code > 0">
                                <p>Grand Total:</p>
                                <p><Currency :amount="(parseInt(totalPrice) - parseInt(discount_by_promo_code))"/></p>
                            </div>

                            
                        </div>
                        <!-- bank payment -->
                        <div class="flex justify-between">
                            <div>
                                <label class="flex items-center">
                                    <input type="radio"  v-model="payment_type" name="payment" value="0" class="form-radio" />
                                    <span class="ml-2">Online Pay</span>
                                </label>
                            </div>
                            <div class="flex gap-4">
                                <p v-for="(method, index) in methods" :key="index" class="curser-pointer">
                                    <img class="w-auto" :src="method.src" :alt="method.alt" />
                                </p>
                            </div>
                        </div>
                        <!-- cash on delivery -->

                        <div>
                            <label class="flex items-center">
                                <input type="radio" name="payment" value="1" v-model="payment_type" class="form-radio" checked />
                                <span class="ml-2">Cash on delivery</span>
                            </label>
                        </div>
                        <div class="flex space-x-2">
                            <input type="text" v-model="promo_code"  placeholder="Coupon Code" class="form-input flex-1 border px-4 bg-light focus:outline-none rounded" />
                            <button class="bg-red-500 text-white px-4 py-2 rounded" @click="getDiscount"> Apply Coupon </button>
                        </div>
                        <button @click="orderSubmit" class="w-full bg-red-500 text-white px-4 py-2 rounded">{{ working }}</button>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style>
.p-dropdown-filter {
    padding: 7px !important;
}

.p-dropdown-label {
    font-size: 14px !important;
    color: #000;
}

.p-dropdown:not(.p-disabled).p-focus {
    outline: 0 !important;
}
</style>

<style scoped>
.form-radio {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #db4444;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
}

.form-radio:checked::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background-color: #db4444;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 3px;
}

.form-radio+.ml-2 {
    vertical-align: middle;
}

/* checkbox */

.styled-checkbox {
    position: absolute;
    opacity: 0;
}

.styled-checkbox+label {
    position: relative;
    cursor: pointer;
    padding: 0;
}

/* Box */
.styled-checkbox+label:before {
    content: "";
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-top;
    width: 20px;
    height: 20px;
    border: 1px solid #343a40;
}

/* Box hover */
.styled-checkbox:hover+label:before {
    background: #db4444;
    border: 1px solid #db4444;
}

/* Box focus */
.styled-checkbox:focus+label:before {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}

/* Box checked */
.styled-checkbox:checked+label:before {
    background: #db4444;
    border: 1px solid #db4444;
}

/* Disabled state label */
.styled-checkbox:disabled+label {
    color: #b8b8b8;
    cursor: auto;
}

/* Disabled box */
.styled-checkbox:disabled+label:before {
    box-shadow: none;
    background: #ddd;
}

/* Checkmark. Could be replaced with an image */
.styled-checkbox:checked+label:after {
    content: "";
    position: absolute;
    left: 5px;
    top: 11px;
    background: white;
    width: 2px;
    height: 2px;
    box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white,
        4px -6px 0 white, 4px -8px 0 white;
    transform: rotate(45deg);
}
</style>
