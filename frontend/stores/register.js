export const useSignUpStore = defineStore("signup", {
	state: () => ({
		userData: {},
		loading: false,
		token: null,
	}),
	actions: {
		async signup(form) {
			// replace with actual API endpoint and master key
			const config = useRuntimeConfig();
			const EndPoint = config.public.baseURl;
			const MasterKey = config.public.masterToken;
			const formData = form;
			this.loading = true;
			try {
				const res = await fetch(`${EndPoint}/register`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"App-Master-Key": `${MasterKey}`,
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				console.log(data);
				if (data.access_token && data.user_data) {
					this.token = data.access_token;
					this.userData = data.user_data; // store user data in the store
					return { success: true };
				} else {
					return { success: false, message: "Invalid credentials" };
				}
			} catch (error) {
				console.error(error);
				return { success: false, message: "An error occurred during signup" };
			} finally {
				this.loading = false;
			}
		},
	},
	persist: true,
});
