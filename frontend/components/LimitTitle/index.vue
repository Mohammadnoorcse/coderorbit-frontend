<script setup>

    const props = defineProps(['title', 'length']);

    const { title, length } = props;

</script>

<template>
    {{ title.substring(0, length )  }}...
</template>