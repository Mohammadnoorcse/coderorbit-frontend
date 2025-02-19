<script setup>
import { ref } from "vue";
// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const menus = ref({});

onMounted(async () => {
    try {
        const data = await $fetch(`${EndPoint}/category?data=all&extendProps[sidebar]=menu&status=1`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "App-Master-Key": MasterKey,
        },
        });

        menus.value = data;
    } catch (err) {
        console.log(err);
    }
});
</script>

<template>
  <div class="flex w-full">
    <!-- Side Menu -->
    <nav class="w-full">
        <ul>
            <li v-for="menu in menus" :key="menu.id" class="relative group/list">
                <NuxtLink :to="'/category/' + menu.id">
                    <div class="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"> {{ menu.name }}
                        <span v-if="menu.categories.length" class="text-gray-500">
                            <Icon name="iconamoon:arrow-right-2-light" width="20" height="16" />
                        </span>
                    </div>
                </NuxtLink>

                <ul v-if="menu.categories.length" class="md:absolute invisible group-hover/list:visible md:ps-0 ps-4 md:w-80 w-full z-30 md:left-full left-1 md:top-0 top-10 bg-white border-gray-200 md:shadow-md">
                    <li v-for="subItem in menu.categories" :key="subItem.id">
                    <NuxtLink :to="'/category/' + subItem.id" class="p-2 ps-4 hover:bg-gray-200 bg-gray-100 block border-b">
                        {{ subItem.name }}
                    </NuxtLink>
                    </li>
                </ul>
            
            </li>
        </ul>
    </nav>
  </div>
</template>

<style>
/* Additional styling for better visibility */
.group-hover\:visible {
    visibility: visible;
}
</style>
