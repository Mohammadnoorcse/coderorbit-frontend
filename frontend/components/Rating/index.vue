<!-- Rating.vue -->
<script setup>
const props = defineProps({
    rating: {
        default: 0
    },
    height: {
        type: Number,
        default: 16
    },
    width: {
        type: Number,
        default: 16
    }
});

const ratings = ref(Math.round( props.rating));

</script>

<template>
    <div>
        <div class="flex gap-1">
            <Icon name="wpf:star" class="relative cursor-pointer text-[#FF8A00]" :class="`w-[${width}] h-[${height}]`" v-for="item in ratings" :key="item" />
            <Icon name="wpf:star" class="relative cursor-pointer text-gray-400" :class="`w-[${width}] h-[${height}]`" v-for="item in 5-ratings" :key="item" />
        </div>
    </div>
</template>
