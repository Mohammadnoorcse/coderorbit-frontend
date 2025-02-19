<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps(['slides']);

const items = ref(props.slides || []); // Initialize `items` from `slides`
const activeIndex = ref(0);
let interval = null;

// Method to go to a specific slide
const goToSlide = (index) => {
  activeIndex.value = index;
};

// Start autoplay
const startAutoplay = () => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % items.value.length;
  }, 3000); // Change slide every 3 seconds
};

// Stop autoplay
const stopAutoplay = () => {
  if (interval) clearInterval(interval);
};

// Initialize autoplay and clean up
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

// Watch for changes in `slides` prop
watch(
  () => props.slides,
  (newSlides) => {
    items.value = newSlides || [];
    activeIndex.value = 0; // Reset to the first slide
  },
  { immediate: true }
);
</script>

<template>
  <div id="default-carousel" class="w-full">
    <!-- Carousel wrapper -->
    <div class="sm:min-h-full md:h-[auto]">
      <!-- Items -->
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :class="['carousel-item', { active: activeIndex === index }]"
      >
        <div
          class="w-full h-full md:flex"
          :style="{ backgroundColor: item.extend_props?.bgcolor || '#FF7900' }"
        >
          <div class="text-center md:text-left w-full md:w-3/5 relative pt-8 md:mt-0">
            <div
              class="md:absolute bottom-0 left-0 px-12 mb-12 text-wrap hover:text-balance"
              :style="{ color: item.extend_props?.textColor || '#000' }"
            >
              <div class="flex md:justify-start pb-4">
                <Icon class="size-8" :name="item.extend_props?.icon" />
                <p class="text-3xl">{{ item.name }}</p>
              </div>
              <h1 class="text-md text-balance text-justify">
                {{ item.description }}
              </h1>
              <div class="md:mt-4 mt-12">
                <NuxtLink
                  v-if="item.extend_props?.category_url"
                  :to="item.extend_props?.category_url"
                >
                  <button
                    type="button"
                    class="bg-transparent focus:outline-none focus:ring-4 hover:translate-x-4 duration-500 focus:ring-gray-100 font-medium rounded-lg text-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Shop Now
                    <Icon class="size-6" name="mingcute:arrow-right-line" />
                  </button>
                </NuxtLink>
                <NuxtLink v-else to="#">
                  <button
                    type="button"
                    class="bg-transparent focus:outline-none focus:ring-4 hover:translate-x-4 duration-500 focus:ring-gray-100 font-medium rounded-lg text-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  >
                    Shop Now
                    <Icon class="size-6" name="mingcute:arrow-right-line" />
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="md:w-2/5 h-full w-full">
            <NuxtImg class="w-full h-full" :src="item.icon" :alt="item.name" />
          </div>
        </div>
      </div>
    </div>

    <!-- Slider indicators -->
    <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        type="button"
        class="w-3 h-3 rounded-full"
        :class="{
          'bg-[#DB4444] ring-2 ring-gray-200': activeIndex === index,
          'bg-white': activeIndex !== index
        }"
        @click="goToSlide(index)"
        :aria-label="`Slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.carousel-item {
  display: none;
  transition: opacity 0.7s ease-in-out;
}

.carousel-item.active {
  display: block;
  opacity: 1;
}
</style>
