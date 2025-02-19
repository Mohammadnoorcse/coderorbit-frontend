<script setup>
definePageMeta({
    layout: "home",
});

import { ref } from "vue";
const router = useRouter();
const isLoading = ref(false)

const password_confirmation = ref("");
const newPassword = ref("");
const otp = ref();
const message = ref("");
const popUp = ref(false);

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
  "Accept": "application/json",
  "App-Master-Key": `${MasterKey}`,
//   "Authorization": `Bearer ${token.token}`
});


const submitHandler = async()=>{
    isLoading.value = true;
    try {
        const res = await $fetch(`${EndPoint}/resetPassword`,
			{  
                method:"POST",
				headers: headers.value,
                body:{
                    // email:email.value
                    password:newPassword.value,
                    password_confirmation:password_confirmation.value,
                    otp:otp.value
                }
			});
        popUp.value = true;
        message.value = res.message
        console.log(res)

        if(res.send == "success"){
           

            setTimeout(() => {
                popUp.value = false;
                router.push("/");
            }, 300);

            
        }
        
    } catch (error) {
        console.log(error);
        isLoading.value = false;
        
    }
}

</script>


<template>
    <NuxtLayout :name="home">
        <spiner v-if="isLoading" />
        <div class="grid w-full grid-cols-12 gap-5 py-10">
            <!-- Image -->
            <div class="col-span-12 lg:col-span-7 xl:col-span-6">
                <img src="/images/forgot.jpg" alt="Reset Up Image" class="w-full h-full" />
            </div>
            <!-- Form -->
            <div class="col-span-12 pl-0 lg:col-span-5 lg:content-center xl:pl-20 xl:col-span-6">
                <div class="w-full p-4 rounded-md lg:pe-36">
                    <div class="text-center lg:text-left">
                        <h2 class="mb-4 text-3xl font-bold">Reset Password</h2>

                        <form @submit.prevent="submitHandler" class="pt-6 text-center lg:text-left">
                            <InputField id="password" type="password" placeholder="New Password" v-model="newPassword" dynamicClass="w-full  mt-4 border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
                            <InputField id="confirm_password" type="password" placeholder="Confirmation Password" v-model="password_confirmation" dynamicClass="w-full  mt-4 border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
                            <InputField id="otp" type="number" placeholder="OTP" v-model="otp" dynamicClass="w-full  mt-4 border-b border-gray-300 p-4 bg-transparent focus:outline-none" />
                           <div class="mb-2">
                            <span class="text-base font-normal text-gray-700">Please check the mail for OTP.</span>
                           </div>  
                                
                            <div class="flex flex-col items-center  w-full gap-2 lg:gap-6  md:flex-row md:w-4/5">

                                <Button type="submit" class="w-full py-3 mb-0 text-white rounded-md lg:w-3/6 md:w-3/5 bg-primary hover:bg-danger">Confirm</Button>

                            </div>

                            <!-- <NuxtLink to="/account/reset" class="flex flex-col items-center  w-full gap-2 lg:gap-6  md:flex-row md:w-4/5">
                                <Button type="submit" class="w-full py-3 mb-0 text-white rounded-md lg:w-3/6 md:w-3/5 bg-primary hover:bg-danger">Reset Password</Button>
                            </NuxtLink> -->
                        </form>
                    </div>

                </div>
            </div>
            <!-- pop message -->
            <div :class="'absolute top-[5rem] right-0  z-20 p-2 shadow-sm round-md', popUp ? '' : 'hidden'">
                <span class="text-base font-normal text-red-500">{{ message }}</span>

            </div>
        </div>
    </NuxtLayout>
</template>