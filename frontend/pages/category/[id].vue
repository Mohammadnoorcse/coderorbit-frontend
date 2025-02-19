<script setup>
import Slider from "primevue/slider";
import { useRoute } from "vue-router";

import { ref } from "vue";
const rangeValue = ref([0, 0]);
const priceMin = ref(0);
const priceMax = ref(0);
const minRange = ref(0);
const maxRange = ref(0);

const route = useRoute();
const categoryId = ref(route.params.id); // Get category ID from route params

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;


const crumbs = ref([
	{ name: "Home", link: "/" }, 
	{ name: '' }
]);

const products = ref([]);
const links = ref({});

const selectedCats = ref([]);
const selectedBrands = ref([]);
const additionals = ref([]);
const selectedColors = ref([]);
const selectedSizes = ref([]);
const selectedRating = ref("all");

const categories = ref([]);
const brands = ref([]);


const currentPage = ref();
//Loading State
const isLoading = ref(false);

const headers = ref({
    Accept: "application/json",
    "App-Master-Key": `${MasterKey}`,
	
});


onMounted(async () => {

    isLoading.value = true;

    const { data, status } = await useAsyncData( async () => {

        const [product, brands, additional ] = await Promise.all([
            $fetch(`${EndPoint}/category/with_data/${categoryId.value}?limit_per_page=8&page=1&status=1&relative=feedbacks`, {
                method: "get",
                headers: headers.value,
            }),

            $fetch(`${EndPoint}/brand?data=all&status=1`, {
                method: "get",
                headers: headers.value,
            }),

            $fetch(`${EndPoint}/additional`, {
                method: "get",
                headers: headers.value,
            }),

        ])

        return {product, brands, additional }

    })

    if(status.value == "success") {
        isLoading.value = false;
    }


	crumbs.value[1].name = data.value?.product?.category.name;

    products.value = data.value?.product?.products.data;

    links.value = data.value?.product?.products;


    brands.value = data.value?.brands
    additionals.value = data.value?.additional
    currentPage.value = data.value?.product?.current_page;
})



const paginate = async (pageNo) => {

    // for next pagination function
    if(pageNo == 'next'){
        pageNo = parseInt(currentPage.value)+1;
    }

    // for previous pagination function
    if(pageNo == 'previous'){
        pageNo = parseInt(currentPage.value)-1;
    }


    if(currentPage.value != pageNo && pageNo > 0){

        isLoading.value = true;

        const { data, status } = await useFetch(`${EndPoint}/products?limit_per_page=8&page=${pageNo}&status=1&relative=feedbacks`,
            {
                method: 'post',
                headers: headers.value,
                body: {
                    'rattings' : selectedRating.value,
                    'colors' : selectedColors.value,
                    'sizes' : selectedSizes.value,
                    'category_id' : parseInt(categoryId.value),
                    'brand_ids' : selectedBrands.value,
                }
            }
    
        )

        if(status.value == "success") {
            isLoading.value = false;
        }

        currentPage.value = data.value?.current_page;
        products.value = data.value?.data;
        links.value = data.value;

    }
    
}


watch(selectedRating, async () => {
    filterProduct();
})

watch(selectedBrands, async () => {
    filterProduct();
})

watch(selectedColors, async () => {
    filterProduct();
})

watch(selectedSizes, async () => {
    filterProduct();
})


// filter function goes here

const filterProduct = async () => {

    isLoading.value = true


    const { data, status } = await useFetch(`${EndPoint}/products?limit_per_page=8&page=1&status=1&relative=feedbacks`,
        {
            method: 'post',
            headers: headers.value,
            body: {
                'rattings' : selectedRating.value,
                'colors' : selectedColors.value,
                'sizes' : selectedSizes.value,
                'category_id' : parseInt(categoryId.value),
                'brand_ids' : selectedBrands.value,
            }
        },
        

    )

    console.log(data)

        if(status.value == "success") {
            isLoading.value = false;
        }

        currentPage.value = data.value?.current_page;
        products.value = data.value?.data;
        links.value = data.value;

}


// All Select function goes here
const ratings = [1, 2, 3, 4, 5];


const checkRange = (e) => {
    priceMin.value = e[0];
    priceMax.value = e[1];



}

const seeMoreCategory = ref(false);

const seeAllCategory = (seeMoreCategory) => {
    seeMoreCategory.value = !seeMoreCategory
}


const seeMoreBrand = ref(false);

const seeAllBrand = (seeMoreBrand) => {
    seeMoreBrand.value = !seeMoreBrand
}

</script>

<template>
    <NuxtLayout name="home">
        <div class="min-h-screen w-10/12 mx-auto flex">

            <spiner v-if="isLoading" />

            <div class="min-h-screen md:border-r md:border-b w-1/5 hidden  md:block">
                <div class="w-full flex justify-between h-10 border-b py-1 px-2">
                    <div><h2 class="text-xl">Filter</h2></div>
                    <div class="text-xl">
                        <Icon  name="mingcute:settings-2-line" />
                    </div>
                </div>

                <!-- <div class="mt-4 px-2">
                    <div class="mb-2 w-full" for="vol">Price Range: {{ priceMin }}  , {{ priceMax }}</div>
                    <Slider v-model="rangeValue" range :min="minRange" :max="maxRange" @change="checkRange" />
                </div> -->

                <div class="card justify-content-center mt-4 ">

                    <div class="w-full flex justify-between h-10 border-b border-t px-2 py-1">
                        <div><h2 class="text-md font-semibold">Colors</h2></div>
                        <div class="text-xl">
                            <Icon  name="ion:color-filter" />
                        </div>
                    </div>

                    <div :class="seeMoreCategory ? 'min-h-80' : 'h-80'"  class=" overflow-hidden">
                        <div class="flex px-2 mt-1" v-for="color in additionals.colors" :key="color.color">

                            <input :id="`${color.color}`" :value="color.color" class="w-4 h-4 cursor-pointer" type="checkbox" v-model="selectedColors">                           
                            <label :for="`${color.color}`" class="ml-1 cursor-pointer text-sm">
                                {{ color.color }}
                            </label>
                        </div>
                    </div>

                    <div class="text-blue-700 text-center cursor-pointer" @click="seeAllCategory(seeMoreCategory = !seeMoreCategory)"> {{ seeMoreCategory ? "Less view" : "View all" }}</div>
                </div>

                <div class="card justify-content-center mt-4 ">

                    <div class="w-full flex justify-between h-10 border-b border-t px-2 py-1">
                        <div><h2 class="text-md font-semibold">Sizes</h2></div>
                        <div class="text-xl">
                            <Icon  name="gg:size" />
                        </div>
                    </div>

                    <div :class="seeMoreCategory ? 'min-h-80' : 'h-80'"  class=" overflow-hidden">
                        <div class="flex px-2 mt-1" v-for="size in additionals.sizes" :key="size.size">

                            <input :id="`${size.size}`" :value="size.size" class="w-4 h-4 cursor-pointer" type="checkbox" v-model="selectedSizes">                           
                            <label :for="`${size.size}`" class="ml-1 cursor-pointer text-sm">
                                {{ size.size }}
                            </label>
                        </div>
                    </div>

                    <div class="text-blue-700 text-center cursor-pointer" @click="seeAllCategory(seeMoreCategory = !seeMoreCategory)"> {{ seeMoreCategory ? "Less view" : "View all" }}</div>
                </div>

                <div class="card justify-content-center mt-4 ">

                    <div class="w-full flex justify-between h-10 border-b border-t px-2 py-1">
                        <div><h2 class="text-md font-semibold">Brands</h2></div>
                        <div class="text-xl">
                            <Icon  name="tabler:brand-pnpm" />
                        </div>
                    </div>

                    <div :class="seeMoreBrand ? 'min-h-80' : 'h-fit max-h-80'"  class="overflow-hidden">
                        <div class="flex px-2 mt-1" value="" v-for="brand in brands" :key="brand.id">
                            <div>
                                <input :id="`${brand.id}`" :value="brand.id"  v-model="selectedBrands" class="w-4 h-4 cursor-pointer" type="checkbox" >
                            </div>
                            <label :for="`${brand.id}`" class="ml-1 cursor-pointer text-sm">
                                {{ brand.name }}
                            </label>
                        </div>
                        
                    </div>

                    <div class="text-blue-700 text-center cursor-pointer" @click="seeAllBrand(seeMoreBrand = !seeMoreBrand)"> {{ seeMoreBrand ? "Less view" : "View all" }}</div>

                </div>

                <!-- <div class="card justify-content-center mt-4 ">

                    <div class="w-full flex justify-between h-10 border-b border-t px-2 py-1">
                        <div><h2 class="text-md font-semibold">Colors</h2></div>
                        <div class="text-xl">
                            <Icon  name="ion:color-filter" />
                        </div>
                    </div>

                    <div class="flex px-2 mt-1" value="" v-for="color in colors" :key="color.id">
                        <div>
                            <input :id="`${color.id}`" class="w-4 h-4 cursor-pointer" type="checkbox" >
                        </div>
                        <label :for="`${color.id}`" class="ml-1 cursor-pointer text-sm">
                            {{ color.name }}
                        </label>

                    </div>
                </div> -->


                <div class="card justify-content-center mt-4 ">

                    <div class="w-full flex justify-between h-10 border-b border-t px-2 py-1">
                        <div><h2 class="text-md font-semibold">Rattings</h2></div>
                        <div class="text-xl">
                            <Icon  name="wpf:star" />
                        </div>
                    </div>

                    <ul class="flex flex-wrap gap-2 m-2">
                        <li v-for="rating in ratings" :key="rating" class="p-2  rounded cursor-pointer relative" :class="{
                            'bg-primary text-white': selectedRating === rating,
                            'bg-gray-100 text-black': selectedRating !== rating,
                        }">
                        <input :id="`${rating}`" :value="rating"  v-model="selectedRating" class="w-full h-full cursor-pointer absolute top-0 right-0 opacity-0" type="radio" >

                            <Icon class="text-yellow-500"  name="wpf:star" /> {{ rating }} Stars
                        </li>
                        <li class="p-2  rounded cursor-pointer relative" :class="{
                            'bg-primary text-white': selectedRating === 'all',
                            'bg-gray-100 text-black': selectedRating !== null,
                        }"> <input id="null" value="all"  v-model="selectedRating" class="w-full h-full cursor-pointer absolute top-0 right-0 opacity-0" type="radio" > <Icon class="text-yellow-500"  name="wpf:star" /> All Ratings
                        </li>
                    </ul>
                </div>
            </div>


            <div class="px-4 w-full">
                <div class="px-4 text-left w-full">
                    <Breadcrumb :crumbs="crumbs" />
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-1">
                    <template v-if="products.length > 0">
                        <ProductCard class="mt-8 md:mt-1" v-for="product in products" :key="product.id" :product="product" />
                    </template>
                </div>


                <pagination @paginate="paginate" :links="links.links" />

            </div>
        </div>
    </NuxtLayout>
</template>

<style>
.p-slider .p-slider-range {
    background: #db4444 !important;
}

.p-dropdown:not(.p-disabled).p-focus {
    outline: 0 !important;
}

.see_all {
    box-shadow: rgba(0, 0, 0, .5) 20px -124px 42px -100px inset;
}


</style>