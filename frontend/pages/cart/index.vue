<script setup>
const crumbs = [{ name: "Home", link: "/" }, { name: " Cart" }];
import { ref, computed } from "vue";
import { useCartsStore } from "@/stores/carts";



const additional = ref({});

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
    "Accept": "application/json",
    "App-Master-Key": `${MasterKey}`
})

const carts = useCartsStore();

// Method to increase item quantity
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

// Method to delete item
const deleteItem = (item) => {
    carts.removeItem(item.id);
};


const additionalColor = async (e, productId) => {

    const existingItem = carts.items.find((item) => item.item_id === productId);

    let uniqueId = productId + "_" + e.target.value+ "_" + existingItem.size;

    additionaData(uniqueId);

}


const additionalSize = async (e, productId) => {

    const existingItem = carts.items.find((item) => item.item_id === productId);
    let uniqueId = productId + "_" + existingItem.color + "_" + e.target.value;

    additionaData(uniqueId);

    
}

const additionaData = async (uniqueId) => {

    try {
        let productData = await $fetch(`${EndPoint}/additional/${uniqueId}`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        carts.additional(productData);

    } catch (err) {
        console.log(err)
    }
}



console.log("Add Cart ",carts);
console.log(carts.items);
</script>

<template>
    <NuxtLayout name="home">
        
        <div class="px-4 py-10 lg:px-36">
            <div class="py-2 text-left">
                <Breadcrumb :crumbs="crumbs" />
            </div>
            <div class="w-full mb-4 lg:mb-4">
                <div class="overflow-x-auto">
                    <table class="hidden w-full p-8 sm:table" style="border-spacing: 0 1rem">
                        <thead class="border custom-row-gap">
                            <tr class="text-sm">
                                <th class="px-6 py-3 text-left">Product</th>
                                <th class="px-6 py-3 text-left">Price</th>
                                <th class="px-6 py-3 text-left">Quantity</th>
                                <th class="px-6 py-3 text-left">Color</th>
                                <th class="px-6 py-3 text-left">Size</th>
                                <th class="px-6 py-3 text-left">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm font-light text-gray-600 custom-row-gap">
                            <tr v-for="item in carts.items" :key="item.id" class="border hover:bg-gray-100">
                                <td class="relative flex items-center px-6 py-3 text-left">
                                    <NuxtImg :src="item.icon" :alt="item.name" class="w-16 h-16 mr-4 rounded-md" />
                                    <Icon name="material-symbols:close"
                                        class="absolute w-4 h-4 text-white rounded-full cursor-pointer bg-primary left-9 top-7 hover:text-primary hover:bg-white"
                                        @click="deleteItem(item)" />
                                    <div class="font-bold">{{ item.name }}</div>
                                </td>
                                <td class="px-6 py-3 font-bold text-left">
                                    <!-- <del>{{ item.regular_price }}</del>
                                    {{ item.current_price }} -->
                                   <del v-if="item.regular_price>0"><Currency :amount="item.regular_price"/></del>
                                    <Currency :amount="item.current_price"/>

                                </td>
                                <td class="px-6 py-3 font-bold text-left">
                                    <div class="flex items-center mt-2">
                                        <button class="px-2 border rounded-l" @click="decreaseQuantity(item)">
                                            <Icon name="fluent-emoji-high-contrast:minus" />
                                        </button>
                                        <input type="number" :value="item.quantity" min="1"
                                            class="w-10 h-[26px] text-center border-t border-b"
                                            @input="($event) => { item.quantity = Number($event.target.value); carts.updateItem(item); }" />
                                        <button class="px-2 border rounded-r" @click="increaseQuantity(item)">
                                            <Icon name="fa6-solid:plus" />
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-3 font-bold text-left">
                                    <select class="border p-1"  @change="additionalColor($event, item.item_id)">
                                        <option v-for="(colorData, index) in item.attributes.colors?.split(',')"
                                            :key="index" :value="colorData">{{ colorData }}</option>
                                    </select>
                                </td>
                                <td class="px-6 py-3 font-bold text-left">
                                    <select class="border p-1" @change="additionalSize($event, item.item_id)">
                                        <option v-for="(sizeData, index) in item.attributes.sizes?.split(',')"
                                            :key="index" :value="sizeData">{{ sizeData }}</option>
                                    </select>
                                </td>

                                <td class="px-6 py-3 font-bold text-left">
                                    {{ item.quantity * item.current_price }}
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <div class="md:hidden lg:hidden xl:hidden block">
                        <div v-for="item in carts.items" :key="item.id" class="pb-4 mb-4 border-b">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <img :src="item.icon" alt="product image" class="w-16 h-16 mr-4 rounded-md" />
                                    <div class="font-semibold text-md">{{ item.name }}</div>
                                </div>
                                <Icon name="material-symbols:close"
                                    class="w-4 h-4 text-white rounded-full cursor-pointer bg-primary hover:text-primary hover:bg-white"
                                    @click="removeItem(item.id)" />
                            </div>

                            <div class="flex justify-between mt-2">
                                <div class="flex items-center">
                                    <label class="mr-2">Color:</label>
                                    <select class="border p-1 rounded-md" v-model="color" @change="additionalColor">
                                        <option v-for="(colorData, index) in item.attributes.colors?.split(',')"
                                            :key="index" :value="colorData">{{ colorData }}</option>
                                    </select>
                                </div>
                                <div class="flex items-center">
                                    <label class="mr-2">Size:</label>
                                    <select class="border p-1 rounded-md" v-model="size" @change="additionalSize($event, item.id)">
                                        <option v-for="(sizeData, index) in item.attributes.sizes?.split(',')"
                                            :key="index" :value="sizeData">{{ sizeData }}</option>
                                    </select>
                                </div>
                                
                            </div>


                            <div class="mt-2 flex justify-between">
                                <div class="flex w-2/3 ">
                                    <div class="mr-2">Quantity:</div>
                                    <div> <input type="number" class="w-full px-2 border rounded" v-model="item.quantity" min="1" /></div>
                                </div>

                                <div class="flex justify-between w-1/3">
                                    <div class="mx-2">Price:</div>
                                    <div class="font-bold">{{ item.current_price }}</div>
                                </div>
                               
                            </div>
                            <div class="mt-2 justify-end flex w-full">
                                <div class="flex">
                                    <div class="mx-2">Subtotal:</div>
                                    <div class="font-bold">{{ item.current_price * item.quantity }}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between mt-8">
                    
                        <NuxtLink to="/" class="w-1/2 px-2 lg:w-48 mr-2 p-1 text-center rounded-md border border-dark hover:border-primary hover:bg-primary hover:!text-white">
                            Return To Shop
                        </NuxtLink>
                   
                        <NuxtLink to="/checkout" class="w-1/2 bg-primary lg:w-48 pr-2 p-1 border border-primary text-center rounded-md text-white md:w-40">
                            Checkout
                        </NuxtLink>
                  

                    
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style scoped>
.text-danger {
    color: red;
}

@media (min-width: 640px) {
    table {
        display: inline-table !important;
    }

    thead tr:not(:first-child) {
        display: none;
    }
}

.custom-row-gap tr {
    margin-bottom: 1rem;
    /* Adjust this value as needed */
}

.custom-row-gap td,
.custom-row-gap th {
    padding-top: 24px;
    padding-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
}
</style>
