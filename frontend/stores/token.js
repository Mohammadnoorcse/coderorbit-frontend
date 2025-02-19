export const useTokenStore = defineStore('token',{
    state: () => ({
        userData: {},
        isLoggedIn: false,
        token:'',
    }),
    getters:{
        isAuthenticated : (state) => state.isLoggedIn,
        getToken : (state) => state.token,
    },
    actions: {
        setToken(token){
            this.token = token;
            this.isLoggedIn = true;
        },
        setUserData(user){
            this.userData = user; // store user data in the store
        },
        removeToken(){
            this.$reset();
            const router = useRouter();
            router.push('/');
        }
    },
    persist: true,
})