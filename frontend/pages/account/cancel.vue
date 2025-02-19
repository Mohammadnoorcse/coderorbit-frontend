<script setup>
import { ref } from "vue";
const crumbs = [{ name: "Home", link: "/" }, { name: " Acocunt" }];


const { dateMonthFunction, dateFunction } = useDataDate();

import { useTokenStore } from "@/stores/token";

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
const lastPage = ref(0);



const invoices = ref([]);


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

// fetch data on mount
  onMounted(async () => {

    isLoading.value = true;

    try {

        let data = await $fetch(`${EndPoint}/customer/dashboard?limit_per_page=10&status=6`,
          {
            headers: headers.value
          });

        invoices.value = data.orders?.data;
        links.value = data?.orders;
        currentPage.value = data?.orders?.current_page;
        lastPage.value = data?.orders?.last_page;
        
        console.log(links.value);
      



      } catch (error) {
        console.error("Error fetching return data", error);

      } finally {
        isLoading.value = false;
      }
    })

    //pagination 

  const paginate = async (pageNo) => {

    // for next pagination function
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

    // console.log(lastPage.value);


    if (currentPage.value != pageNo && pageNo > 0 ) {

      isLoading.value = true;

        const data = await $fetch(`${EndPoint}/customer/dashboard?limit_per_page=10&page=${pageNo}&status=6`,
          {
            method: 'get',
            headers: headers.value,
          
          }

      )

      invoices.value = data.orders?.data;
      links.value = data?.orders;
      currentPage.value = data?.orders?.current_page;
      // console.log(links.value)
      
    }

  }



</script>


<template>
  <Seo :metaData="seoData"/>
  <!-- about us banner -->
  <NuxtLayout name="home">
    <div class="xl:px-36 px-4 mb-20 w-full">
      <div class="flex justify-between items-center py-4">
        <Breadcrumb :crumbs="crumbs" />
        <div>
          <AccountMessage :message="'Welcome!'" :name="token?.userData?.name"/>
        </div>
      </div>
      <div class="grid md:grid-cols-12 grid-cols-1 gap-6">
        <div class="md:col-span-4 col-span-12">
          <!-- profile sider bar -->
             <AccountMenu/>
        </div>
        <div class="md:col-span-8 col-span-12">
           <div class="relative overflow-x-auto">
             <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#7D8184]">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    SL
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Invoice#
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Qty
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="odd:bg-white even:bg-gray-50 border-0" v-for="(invoice, index) in invoices" :key="index">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.name }} -->
                    <div class="flex" v-for="item in invoice?.order_items ">
                      <div class="col">
                        <NuxtImg :src="item.icon" alt="Product Image" class="w-8 h-8 object-cover" />
                      </div>

                      <div class="col pl-1" :title="item.item_name">
                        <LimitTitle :title="item.item_name" length="15" />
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.invoiceNumber }} -->
                    <NuxtLink :to="`/account/order/${invoice.unique_id}`" class="text-blue-500 hover:underline">{{
                      invoice.unique_id }}</NuxtLink>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.qty }} -->
                    {{ invoice.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.total }} -->
                    <Currency :amount="invoice.total" />
                    
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.date }} -->
                    {{ dateFunction(invoice.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.status }} -->
                    {{ invoice.status?.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <!-- {{ invoice.action }} -->
                    <NuxtLink :to="`/account/order/${invoice.unique_id}`" class="text-blue-500 hover:underline">view
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <pagination/> -->
            <pagination @paginate="paginate" :links="links.links" />
           </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>


<style scoped>
tr, td{
  border: 0;
}
</style>