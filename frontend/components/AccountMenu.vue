<script setup>
import { Title } from "~/node_modules/nuxt/dist/head/runtime/components";

const manageAccount = [
    {
		menu: "Profile",
		link: "/account/profile",
    },

    {
		menu: "All Orders",
		link: "/account/",
    },
    {
      	menu: "Returns",
        link: "/account/return",
    },
    {
      	menu: "Cancel",
        link: "/account/cancel",
    },
];
const orders = [];
</script>

<template>
  <div>
    <h2 class="font-semibold text-sm mb-4">Manage My Account</h2>
    <ul class="ps-4">
      <li class="mb-2" v-for="(account, index) in manageAccount" :key="index">
        <NuxtLink
          :to="account.link"
          :class="{ 'text-primary': $route.path === account.link }"
        >
          {{ account.menu }}
        </NuxtLink>
      </li>
    </ul>

  </div>
</template>
<style scoped>
.word {
  color: red;
}
</style>
