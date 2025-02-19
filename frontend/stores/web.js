import { defineStore } from 'pinia';
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;

const headers = ref({
	"Accept": "application/json",
	"App-Master-Key": `${MasterKey}`,
	// "Authorization": `Bearer ${token.token}`
});

export const useWebSettingsStore = defineStore('webSettings', {
  state: () => ({
    webSettings: null, // Initial state
  }),

  actions: {
    async fetchWebSettings() {
      // Only call the API if webSettings is null
      if (this.webSettings === null) {
        try {
          const response = await $fetch(`${EndPoint}/web_settings?data=all`, {
            headers: headers.value,
          });
          this.webSettings = response; // Store the fetched data
        } catch (error) {
          console.error('Failed to fetch web settings:', error);
        }
      }
    },
  },
});
