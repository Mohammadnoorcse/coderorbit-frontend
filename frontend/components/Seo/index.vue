<script setup lang="ts">
// const title = ref('Hello World')
import { defineProps } from 'vue'


const props = defineProps({
    metaData: {
        type: Object,
        // required: true
    }
})

console.log("seo page:", props.metaData);
</script>

<template>

    <Head>
      
        <!-- Title Tag: Website's title -->
        <Title>{{ metaData?.name || 'Default Product Title' }}</Title>

        <!-- SEO Meta Tags -->
        <Meta name="description" :content="metaData?.description || metaData?.name||'Default product description if not available'" />
        <Meta name="keywords" content="product, nuxt, seo, ecommerce, shop" />
        <Meta name="robots" content="index, follow" />
        <Meta name="author" content="Coder orbit" />

        <!-- Open Graph Meta Tags -->
        <meta property="og:type" content="website" />
        <meta property="og:title" :content="metaData?.name || 'Default Title for Open Graph'" />
        <meta property="og:description" :content="metaData?.description || metaData?.name ||metaData?.current_price||metaData?.regular_price||'Default Open Graph description'" />
        <meta property="og:image" :content="metaData?.icon || 'default-image-url.jpg'" />
        <meta property="og:image:alt" content="Product Image" />
        <meta property="og:url" :content="metaData?.url || metaData?.productUrl" />
        <meta property="og:site_name" content="Your Website Name" />

        <!-- Twitter Card Meta Tags -->
        <meta property="twitter:card" :content="metaData?.icon" />
        <meta property="twitter:title" name="twitter:title" :content="metaData?.name  || 'Default Twitter Title'" />
        <meta property="twitter:description" name="twitter:description"
            :content="metaData?.description || metaData?.name ||metaData?.current_price||metaData?.regular_price|| 'Default Twitter Description'" />
        <meta property="twitter:image" name="twitter:image" :content="metaData?.icon || 'default-twitter-image.jpg'" />
        <meta property="twitter:site" name="twitter:site" content="@YourTwitterHandle" />
        <meta property="twitter:creator" name="twitter:creator" content="@YourTwitterHandle" />
    </Head>
</template>
