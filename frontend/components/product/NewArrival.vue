<script setup>

const props = defineProps({
    arrivals:
    {
        type: Object
    }
});


</script>

<template>
    <div>
        <TitleWithSub title="Featured" subtitle="New Arrival" class="flex justify-between mb-8 text-left mt-16"/>
        <div class="grid grid-cols-1 gap-4 mt-10 md:grid-cols-2 lg:grid-cols-4 rounded-md">
            <div class="relative rounded-md" v-for="item in arrivals" :key="item.id"> 
                <NuxtImg :src="item.icon" :alt="item.name" class="w-full h-full col-span-1 row-span-2 md:col-span-2 lg:row-span-2 rounded-md truncate"/>
                <div class="absolute inset-0 flex flex-col justify-end p-4 bg-opacity-50 bg-black rounded-md truncate">
                    <p class="text-xl text-light w-full text-ellipsis overflow-hidden text-wrap" :title="item.name"><LimitTitle :title="item.name" length="70" /></p>
                    <NuxtLink :to="`/product/${item.id}`" class="py-2 my-2 font-medium underline text-light text-md">Shop now <Icon class="size-6" name="mingcute:arrow-right-line" /></NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>

</style>
