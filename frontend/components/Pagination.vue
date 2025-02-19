<script setup>
const emit = defineEmits('paginate');
const props = defineProps({
    links: {
        type: Object
    }
});

const pagination = (number) => {
  emit('paginate', number);

 
};


</script>

<template>
    <div class="mt-10 flex justify-center md:justify-end">
        <nav aria-label="Page navigation" class="navigation">
            <ul class="flex items-center">
                <li class="flex items-center justify-center leading-tight text-gray-500 border-y [&:nth-child(2)]:border-l border-r border-gray-300 hover:bg-gray-100 hover:text-gray-700 first:border-none last:border-none">
                    <a  @click="pagination('previous')" class="p-2 px-4 block text-black"  href="javascript:"> <Icon name="fa-solid:arrow-left"></Icon> </a>
                </li>
                <li v-for="(link, index) in props?.links" :key="index" :class="{'bg-red-100 text-red-500':link.active }" class="flex items-center justify-center leading-tight text-gray-500  hover:bg-gray-100 hover:text-gray-700">
                    <a  @click="pagination(link.label)" v-if="parseInt(link.label)"  v-html="link.label" class="p-2 px-4 block text-black"  href="javascript:" />
                </li>
                <li  class="flex items-center justify-center leading-tight text-gray-500 border-y [&:nth-child(2)]:border-l border-r border-gray-300 hover:bg-gray-100 hover:text-gray-700 first:border-none last:border-none">
                    <a  @click="pagination('next')" class="p-2 px-4 block text-black"  href="javascript:"> <Icon name="fa-solid:arrow-right"></Icon> </a>
                </li>
            </ul>
        </nav>
    </div>
</template>


  

<style lang="css" scoped>

.navigation ul li {
    border-left: solid 1px #e5e7eb;
}

.navigation ul li:first-child {
    border-left: none;
}

.navigation ul {
    border: solid 1px #e5e7eb;
}

</style> 


 


  