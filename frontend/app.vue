<template>
    
    <ClientOnly>
      <template #fallback>
        <div class="text-center w-full flex-col items-center h-screen grid justify-items-center ">
            <div class="text-center">
                <img class="w-auto h-16" src="\public\images\logo.jpg" alt="Loading logo" />
                <p class="mt-4">loading...</p>
            </div>
        </div>
      </template>
      <ScrollToTop/>
      <NuxtPage />
    </ClientOnly>
</template>
