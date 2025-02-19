<script setup>
const props = defineProps({
    message:{
        type:String,
        default:"Welcome!"
    },
    name:{
        type:String,
        default:"user"
    }
})

</script>

<template>
    <div>
        <p>{{ message }} <span class="text-primary">{{ name }}</span></p>
    </div>
</template>