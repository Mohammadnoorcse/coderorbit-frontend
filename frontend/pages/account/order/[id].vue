<script setup>

import { useTokenStore } from "@/stores/token";

const token = useTokenStore();




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

//Define Page Meta
definePageMeta({
    layout: "account",
    middleware: ['auth'],
})

const route = useRoute();
const orderId = route.params.id;
const details = ref(null);
console.log(orderId);

const fetchOrderDetails = async () => {
    try {
        // details.value = await $fetch(`${EndPoint}/admin/${MasterKey}/orders/${orderId}`, {
        //     method: 'GET',
        //     headers: headers.value,
        // });
        details.value = await $fetch(`${EndPoint}/order/${orderId}`, {
            method: 'GET',
            headers: headers.value,
        });
        console.table(details.value);
    } catch (err) {
        console.log(err);
    }

};

fetchOrderDetails();

function printPage() {
    if (process.client) {
        window.print();
    }
}
</script>

<template>
    <Seo :metaData="seoData"/>
    <NuxtLayout name="account">
        <div class="max-w-ful mx-auto p-8 bg-white rounded border print:border-none my-6" id="invoice">

            <div class="flex justify-between">
                <div>
                    <!--  Company logo  -->
                    <img src="https://coderorbit.com/_next/static/media/coderorbit.3e82d816.png" alt="company-logo"
                        height="100" width="100">
                </div>

                <div class="text-justify">
                    <!-- <p>
                        coderorbit.com
                    </p> -->
                    <a href="https://coderorbit.com/" target="_blank" rel="noopener noreferrer" class="hover:underline">Coderorbit.com</a>
                    <p class="text-gray-500 text-sm">
                        sales@coderorbit.com
                    </p>
                    <p class="text-gray-500 text-sm mt-1">
                        +880-1712345678
                    </p>
                    <p class="text-gray-500 text-sm mt-1">
                        VAT: 8657671212
                    </p>
                </div>
            </div>


            <div class="flex justify-between  mt-8">
                <div class="flex flex-col gap-1 text-justify">
                   <p class="font-medium text-gray-800 text-base">Customer Information :</p>
                   <p class="text-gray-500 text-base font-nomal"> Name: {{ details?.extend_props.contact.name }}</p>
                   <p class="text-gray-500 text-base font-nomal"> Email: {{ details?.created_by.email }}</p>
                   <p class="text-gray-500 text-base font-nomal"> Address: {{ details?.extend_props.contact.address }}</p>

                </div>
                <div class="flex flex-col gap-1 text-justify">
                    <p class="text-gray-500 text-base font-nomal">Invoice Number: <span class="font-medium text-base text-gray-800">{{ details?.unique_id }}</span></p>
                    <p class="text-gray-500 text-base font-nomal">Invoice date: <span class="text-gray-800">{{ details?.created_at.trim().split('T')[0] }}</span></p>

                </div>

            </div>

            <!-- Invoice Items -->
            <div class="-mx-4 mt-8 flow-root sm:mx-0">
                <table class="min-w-full">
                    <thead class="border-b border-gray-400 bg-gray-100 text-gray-900">
                        <tr>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">SL</th>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Items
                            </th>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Quantity
                            </th>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Price
                            </th>
                            <th scope="col"
                                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in details?.order_items" :key="index" class="border-b border-gray-200">
                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ index + 1 }}
                            </td>
                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ item.item_name
                                }}</td>
                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ item.quantity
                                }}</td>
                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">
                                <Currency :amount="item.current_price" />
                            </td>
                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">
                                <Currency :amount="item.grand_total" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-full flex justify-between mt-8 ">
                <div class="">
                    <img src="https://i.ibb.co.com/6gDfDYK/qr-code.png" alt="" height="100" width="100">
                </div>
                
                <div class="flex flex-col gap-1 items-end">
                    <p class="flex gap-1 text-sm font-normal text-gray-500">Subtotal :  <span><Currency :amount="details?.total" /></span></p>
                    <p class="flex gap-1 text-sm font-normal text-gray-500">Tax :  <span> <Currency :amount="details?.order_items.reduce((total, item) => total + item.extend_props.tax, 0)" /></span></p>
                    <p class="flex gap-1 text-sm font-normal text-gray-500">Discount : <span><Currency :amount="details?.discount" /></span></p>
                    <p class="flex gap-1 text-sm font-normal text-gray-500 border-b border-[black] pb-1 border-dotted">Shipping Fee : <span><Currency :amount="0" /></span></p>
                    <p class="flex gap-1 text-sm font-semibold text-gray-900 mt-1">Total : <span><Currency :amount="details?.total - details?.discount" /></span></p>

                </div>
               
            </div>

            <!--  Footer  -->
            <div class="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                Please pay the invoice before the due date. You can pay the invoice by logging in to your account from
                our client
                portal.
            </div>

        </div>

        <div class="flex gap-5 justify-center print:hidden ">
            <button @click="$router.back()" type="button" class=" bg-red-500 text-white py-2 px-4 my-3 rounded-sm">Back</button>
            <button type="button" class="bg-red-800 text-white py-2 px-4 my-3 rounded-sm"
                @click="printPage">Print</button>
        </div>
    </NuxtLayout>
</template>



<style>
  @media print {
    #invoice {
      border: none;
    }

    /* Optionally, hide other elements you don't want in the print */
    .print:border-hidden {
      border: none;
    }
  }
</style>