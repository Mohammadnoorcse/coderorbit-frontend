<script setup>
definePageMeta({
	layout: "home",
});

//meta seo data
const config = useRuntimeConfig();
const MetaUrl = config.public.metaBaseUrl;
const MetaName = config.public.metaApplicationName;
const MetaIcon = config.public.metaApplicationIcon;
// Meta data from env file
const seoData = ref({
	name:`${MetaName}::SignUp`,
	productUrl:`${MetaUrl}`,
	icon:`${MetaIcon}`,

})
</script>

<template>
	<Seo :metaData="seoData"/>
	<NuxtLayout name="home">
		<div class="grid w-full grid-cols-12 gap-5 py-10">
			<!-- Image -->
			<div class="col-span-12 lg:col-span-7 xl:col-span-6">
				<img src="~\images\signup.png" alt="Sign Up Image" class="w-full h-full" />
			</div>
			<!-- Form -->
			<div class="col-span-12 pl-0 lg:col-span-5 lg:content-center xl:pl-20 xl:col-span-6">
				<SignUpForm />
			</div>
		</div>
	</NuxtLayout>
</template>
