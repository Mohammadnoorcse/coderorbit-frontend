<!-- <script setup>



const props = defineProps(['amount']);

const { amount } = props;

</script>

<template>

     {{ (parseInt(amount)).toLocaleString('en-US', { style: 'currency', currency: 'BDT', }) }}

</template> -->


<script setup>
const props = defineProps(['amount']);
</script>
<template>

    <!-- {{ (parseInt(props.amount)).toLocaleString('en-US', { style: 'currency', currency: 'BDT', }) }} -->
    {{ (parseFloat(amount)).toLocaleString('en-US', { style: 'currency', currency: 'BDT', }) }}
</template>