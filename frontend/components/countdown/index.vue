
<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  endTime: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
    default: 'flex flex-col items-center justify-center w-20 h-20 p-4 mb-4 bg-white rounded-full text-dark',
  },
});


const countdown = ref([
    { label: "Days", value: 0 },
    { label: "Hours", value: 0 },
    { label: "Minutes", value: 0 },
    { label: "Seconds", value: 0 },
]);


watch(() => props.endTime, () => {
    countdownTime();
});


const countdownTime = (() => {

    const interval = setInterval(() => {

        if (!props.endTime || isNaN(props.endTime.getTime())) {
            clearInterval(interval);
            countdown.value = [
                { label: "Days", value: 0 },
                { label: "Hours", value: 0 },
                { label: "Minutes", value: 0 },
                { label: "Seconds", value: 0 },
            ];
            return;
        }

        const currentTime = new Date();
        const remainingTime = props.endTime.getTime() - currentTime.getTime();

        if (remainingTime <= 0) {
            clearInterval(interval);
            countdown.value = [
                { label: "Days", value: 0 },
                { label: "Hours", value: 0 },
                { label: "Minutes", value: 0 },
                { label: "Seconds", value: 0 },
            ];
            return;
        }

        countdown.value = [
            {
                label: "Days",
                value: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
            },
            {
                label: "Hours",
                value: Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            },
            {
                label: "Minutes",
                value: Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
            },
            {
                label: "Seconds",
                value: Math.floor((remainingTime % (1000 * 60)) / 1000),
            },
        ];
    }, 1000);
});



</script>

<template>
    <div  class="flex flex-col items-start justify-center md:space-x-4 md:flex-row">
        <div :class="class" class="text-black" v-for="count in countdown">
            <span class="text-2xl font-bold" v-if="count?.value">{{ count?.value }}</span>
            <span class="text-2xl font-bold" v-else>0</span>
            <span class="text-sm">{{ count.label }}</span>
        </div>
    </div>
</template>


<style scoped>
.word {
  color: red;
} 
</style>