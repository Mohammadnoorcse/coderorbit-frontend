<script setup>
import Slider from "primevue/slider";
import { useRoute } from "vue-router";

import { ref } from "vue";
const rangeValue = ref([20, 80]);

const route = useRoute();
const categoryId = ref(route.params.id); // Get category ID from route params

const crumbs = [{ name: "Home", link: "/" }, { name: "Best Sell Products" }];

const products = ref([]);

try {
  await fetch("/api/products")
    .then((response) => response.json())
    .then((data) => {
      products.value = data;
    });
} catch (err) {
  console.log(err);
}

const selectedCategories = ref();
const categories = ref([
  { name: "Phones" },
  { name: "Computers" },
  { name: "Camera" },
  { name: "SmartWatch" },
  { name: "Clothing" },
  { name: "Microphone" },
  { name: "Electronics" },
  { name: "jewelery" },
  { name: "Gaming" },
]);

const selectedBrand = ref();
const brands = ref([
  { name: "Samsung" },
  { name: "Apple" },
  { name: "Google" },
  { name: "Sony" },
  { name: "Adidas" },
  { name: "Reebok" },
  { name: "Microsoft" },
]);

const selectedColor = ref();
const colors = ref([
  { name: "Red" },
  { name: "Purple" },
  { name: "Blue" },
  { name: "Green" },
  { name: "Black" },
  { name: "White" },
]);
const selectedVendor = ref();
const vendors = ref([
  { name: "Bashundhara" },
  { name: "walton" },
  { name: "RFL" },
]);

const ratings = [1, 2, 3, 4, 5];
const selectedRating = ref(null);
function selectRating(rating) {
  selectedRating.value = rating;
}
</script>

<template>
  <NuxtLayout name="home">
    <div class="px-8 pb-10 min-h-screen mx-auto">
      <div class="py-4 text-left">
        <Breadcrumb :crumbs="crumbs" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Filters Section -->
        <div class="col-span-12 lg:col-span-3">
          <!-- range -->
          <div class="border rounded p-4 min-h-screen">
            <div class="mb-4">
              <h4 class="mb-2 text-lg font-semibold text-dark">Price Range</h4>
              <div class="my-3">
                <div class="flex justify-between mb-2">
                  <p>{{ rangeValue[0] }}</p>
                  <p>{{ rangeValue[1] }}</p>
                </div>
                <Slider v-model="rangeValue" range :min="0" :max="100" />
              </div>
            </div>

            <!-- category -->
            <div class="mb-4">
              <div class="card flex justify-content-center shadow rounded">
                <Dropdown
                  v-model="selectedCategories"
                  :options="categories"
                  optionLabel="name"
                  placeholder="Select a City"
                  class="w-full"
                />
              </div>
            </div>

            <!-- brand -->
            <div class="mb-4">
              <div class="card flex justify-content-center shadow rounded">
                <Dropdown
                  v-model="selectedBrand"
                  :options="brands"
                  optionLabel="name"
                  placeholder="Select a Brand"
                  class="w-full"
                />
              </div>
            </div>
            <!-- rating -->
            <div class="mb-2">
              <h4 class="mb-2 text-lg font-semibold text-dark">Rating</h4>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="rating in ratings"
                  :key="rating"
                  class="p-2  rounded cursor-pointer"
                  :class="{
                    'bg-primary text-white': selectedRating === rating,
                    'bg-gray-100 text-black': selectedRating !== rating,
                  }"
                  @click="selectRating(rating)"
                >
                  {{ rating }} Stars
                </li>
                <li
                  class="p-2  rounded cursor-pointer"
                  :class="{
                    'bg-primary text-white': selectedRating === null,
                    'bg-gray-100 text-black': selectedRating !== null,
                  }"
                  @click="selectRating(null)"
                >
                  All Ratings
                </li>
              </ul>
            </div>
            <!-- color -->
            <div class="mb-4">
              <div class="card flex justify-content-center shadow rounded">
                <Dropdown
                  v-model="selectedColor"
                  :options="colors"
                  optionLabel="name"
                  placeholder="Select a Brand"
                  class="w-full"
                />
              </div>
            </div>
            <!-- vendor -->
            <div class="mb-4">
              <div class="card flex justify-content-center shadow rounded">
                <Dropdown
                  v-model="selectedVendor"
                  :options="vendors"
                  optionLabel="name"
                  placeholder="Select a Brand"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Products Section -->
        <div class="col-span-12 lg:col-span-9">
          <div
            class="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
          <!-- Pagination -->
          <pagination />
        </div>
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
</style>
