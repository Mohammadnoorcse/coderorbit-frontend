
<script setup>

const props = defineProps(['items']);

const { items } = props;

console.log(items);


</script>


<template>
    <ul class="list-disc [&_ul]:list-[revert] ml-4 pl-5">
        <li v-for="item in items?.items" :key="item.id" class="py-1">
            
            <span v-html="item.content"></span>
            <NestedList :items="item" />

        </li>
    </ul>
</template>