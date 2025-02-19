<script setup>
    const crumbs = [{ name: "Home", link: "/" }, { name: " Acocunt" }];
    import { useTokenStore } from "@/stores/token";
    const login = useTokenStore();

</script>

<template>
    <div>
        <Header class="print:hidden"/>
        <div class="xl:px-36 px-4 mb-20 w-full">

            <div class="flex justify-between items-center py-4 print:hidden">
                <Breadcrumb :crumbs="crumbs" />
                <div>
                    <!-- <p>Welcome! <span class="text-primary">{{ login.userData.name }}</span></p> -->
                    <AccountMessage :message="'Welcome!'" :name="login?.userData?.name"/>
                </div>
            </div>
            <div class="md:flex col ">
                <div class="sm:w-full md:w-1/5 print:hidden">
                    <!-- profile sider bar -->
                    <AccountMenu />
                </div>
                <div class="sm:w-full md:w-4/5">
                    <slot />
                </div>
            </div>
        </div>
        <Footer class="print:hidden" />
    </div>
</template>