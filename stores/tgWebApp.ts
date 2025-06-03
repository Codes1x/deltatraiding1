import { defineStore } from 'pinia'
import { useWebApp, useWebAppCloudStorage } from 'vue-tg'

import type { IUser } from '@/types/user'
import type { IBalance } from '@/types/balance'
import type { IFriend } from '~/types/friends'
import type { IProduct } from '@/types/products'
import type { ISubscribesResponseArray } from '~/types/subscribes'
import type { IStats } from '~/types/stats'

// Define custom type for WebApp data structure
interface WebAppInitData {
  user?: IUser;
  [key: string]: unknown;
}

// Define type for WebApp return type
interface WebAppType {
  initData: string;
  initDataUnsafe: WebAppInitData;
  version: string;
  platform: string;
  isVersionAtLeast: (version: string) => boolean;
  [key: string]: unknown;
}

// Define API response types
interface AuthResponse {
  success: boolean;
  access: string;
  refresh: string;
}

export const useTgWebAppStore = defineStore('tgWebApp', {
  state: () => ({
    authenticated: false,
    user: null as IUser | null,
    balance: null as IBalance | null,
    balanceLastFetched: null as number | null, // Timestamp for balance cache
    userFriendsLastFetched: null as number | null, // Timestamp for user friends cache
    statsLastFetched: null as number | null, // Timestamp for stats cache
    userFriends: [] as IFriend[] | [],
    subscribes: [] as ISubscribesResponseArray[],
    stats: {} as IStats,
    accessToken: null as null | string,
    refreshToken: null as null | string,
    webAppData: null as WebAppType | null,
    initData: null as null | string,
    dataUnsafe: null as WebAppInitData | null,
    products: [] as IProduct[] | [],
    appInitialized: false, // Tracks if initial full data load has occurred
    isLoading: false,      // For global loading indicator state
    initializationError: null as string | null, // To store errors during initialization
    totalLoadingSteps: 0, // Total steps for initial data load
    completedLoadingSteps: 0 // Completed steps for initial data load
  }),

  actions: {
    async initializeApp() {
      if (this.appInitialized && !this.isLoading) {
        console.log('App already initialized. Performing minimal refresh or checks.');
        // Optionally, re-run basic init or specific non-critical data refreshes if needed on every start
        // For now, we assume if appInitialized is true, localStorage rehydration is sufficient for most data.
        // The main app entry point should still call this.init() for TG WebApp specifics.
        await this.init(); // Ensure basic TG WebApp data is fresh
        return;
      }

      this.isLoading = true;
      this.initializationError = null;
      this.completedLoadingSteps = 0;
      // Define total steps for the full initial load scenario
      // 1. init() (includes login)
      // 2. fetchUserReferrals()
      // 3. fetchSubsribes()
      this.totalLoadingSteps = 3; 
      console.log('initializeApp: Starting application initialization.');

      try {
        // Step 1: Basic Telegram WebApp init and attempt login.
        // init() calls fetchInitData(), which in turn calls login().
        // login() will throw an error if authentication fails.
        await this.init();
        if (this.authenticated) { // Only count as a step if init (and login) was successful
            this.completedLoadingSteps = 1;
        }
        console.log('initializeApp: Basic init and login attempt complete. Authenticated:', this.authenticated, 'Progress:', this.completedLoadingSteps, '/', this.totalLoadingSteps);

        // Step 2: If it's the first launch (appInitialized is false) AND user is now authenticated,
        // fetch all other necessary data.
        if (!this.appInitialized && this.authenticated) {
          console.log('initializeApp: First launch & authenticated. Fetching all essential data.');
          // Fetch sequentially to update progress more granularly
          try {
            await this.fetchUserReferrals(true); // forceRefresh = true for initial load
            this.completedLoadingSteps = Math.min(this.completedLoadingSteps + 1, this.totalLoadingSteps);
            console.log('initializeApp: fetchUserReferrals complete. Progress:', this.completedLoadingSteps, '/', this.totalLoadingSteps);

            await this.fetchSubsribes();
            this.completedLoadingSteps = Math.min(this.completedLoadingSteps + 1, this.totalLoadingSteps);
            console.log('initializeApp: fetchSubsribes complete. Progress:', this.completedLoadingSteps, '/', this.totalLoadingSteps);
            
            // Add other essential data fetches here, and increment completedLoadingSteps
            // Example: 
            // await this.fetchProducts(true);
            // this.completedLoadingSteps = Math.min(this.completedLoadingSteps + 1, this.totalLoadingSteps);
            // console.log('initializeApp: fetchProducts complete. Progress:', this.completedLoadingSteps, '/', this.totalLoadingSteps);

          } catch (fetchError) {
            console.error('Error during sequential data fetching in initializeApp:', fetchError);
            // this.initializationError = 'Failed to fetch some essential data.'; // Or more specific error
            // Decide if this error should halt isLoading or if partial data is acceptable
          }
          /* Original Promise.all, replaced for granular progress
          await Promise.all([
            this.fetchUserReferrals(true), // forceRefresh = true for initial load
            this.fetchSubsribes(),
            // Add other essential data fetches here, e.g.:
            // this.fetchProducts(true), // Assuming you might have such an action
          // ]); // Removed extraneous bracket
          */
          this.appInitialized = true; // Mark as initialized after successful full load
          console.log('initializeApp: All essential data fetched and appInitialized set to true.');
        } else if (!this.appInitialized && !this.authenticated) {
          // First launch, but authentication failed.
          // init() would have attempted login. If it failed, login() should have thrown an error.
          // This block might be redundant if errors from login() are caught by the main catch block.
          console.warn('initializeApp: First launch, but authentication failed.');
          this.initializationError = this.initializationError || 'Authentication failed during initial setup.';
          this.appInitialized = true; // Mark as initialized to prevent retrying full load if auth is the problem.
        } else if (this.appInitialized) {
          // Not the first launch (appInitialized was true from localStorage).
          // Data should be rehydrated. init() has refreshed basic webAppData and attempted login.
          console.log('initializeApp: Subsequent launch, data rehydrated. Authenticated:', this.authenticated);
          if (!this.authenticated) {
             this.initializationError = 'User is not authenticated on subsequent launch.';
          }
        }
      } catch (error: any) {
        console.error('initializeApp: Critical error during initialization:', error);
        this.initializationError = error.message || 'An unknown error occurred during initialization.';
        // If a critical error occurs (e.g., login fails and throws),
        // set appInitialized to true to avoid retrying the full load sequence on every start
        // if the error is persistent (like bad credentials or server issue).
        if (!this.appInitialized) {
            this.appInitialized = true; 
        }
      } finally {
        this.isLoading = false;
        console.log('initializeApp: Initialization process finished. isLoading set to false.');
      }
    },

    async init() {
      this.webAppData = useWebApp() as WebAppType
      if (this.webAppData && this.webAppData.version > '6.0') {
        try {
            await this.fetchInitData()
        } catch (error) {
            console.error('Error during store init -> fetchInitData:', error);
            throw error; 
        }
      }
    },
    async fetchInitData() {
      try {
        console.time('fetchInitData')
    
        const webApp = useWebApp() as WebAppType
        const storage = useWebAppCloudStorage()
    
        const cachedData = await storage.getStorageItem('initData')
        console.timeLog('fetchInitData', 'got initData from storage')
    
        // Всегда используем актуальные данные
        this.initData = webApp.initData
        this.dataUnsafe = webApp.initDataUnsafe as WebAppInitData
        
        // Безопасно получаем user, если он есть в dataUnsafe
        if (this.dataUnsafe && this.dataUnsafe.user) {
          this.user = this.dataUnsafe.user
        }
    
        // Если initData ещё не сохранены — сохраняем
        if (!cachedData && this.initData) {
          await storage.setStorageItem('initData', this.initData)
          console.timeLog('fetchInitData', 'initData saved to storage')
        }
    
        // Авторизация
        if (this.initData) {
          const payload = { data: this.initData }
          console.timeLog('fetchInitData', 'calling login()')
          await this.login(payload)
        }
    
        console.timeEnd('fetchInitData')
      } catch (error) {
        console.error('Ошибка при инициализации данных initData:', error)
        console.timeEnd('fetchInitData')
      }
    },
    async login(payload: { data: string }): Promise<void> {
      try {
        console.time('login')
    
        const formData = new FormData()
        formData.append('data', payload.data)
    
        const url = 'https://stage.api.delta-trade.app/api/v1/auth/'
        const response = await $fetch<AuthResponse>(url, {
          method: 'POST',
          body: formData,
        })
    
        console.timeLog('login', 'auth complete')
    
        if (response && response.success) {
          this.accessToken = response.access
          this.refreshToken = response.refresh
          this.authenticated = true
    
       
          await Promise.all([
            this.fetchUserBalance(),
            this.fetchStatsOptimized(),
          
          ])
    
          console.timeEnd('login')
          throw new Error(response?.message || 'Login failed due to unsuccessful API response') // Throw error
        } else {
          return response
        }
        return response
      } catch (error) {
        console.warn('login error ', error)
        console.timeEnd('login')
        return error
      }
    },
    async fetchUserBalance(forceRefresh = false) {
      const CACHE_DURATION_MS_BALANCE = 1 * 60 * 1000; // 1 minute for balance
      const now = Date.now();

      // Return cached balance if available, not forced, and not stale
      if (!forceRefresh && this.balance && this.balanceLastFetched && (now - this.balanceLastFetched < CACHE_DURATION_MS_BALANCE)) {
        console.log('fetchUserBalance: Returning fresh balance from cache.');
        return Promise.resolve(this.balance);
      }
      console.log('fetchUserBalance: Cache stale or not available or forced. Fetching balance from API.');

      try {
        if (!this.accessToken) {
          throw new Error("Access token is missing")
        }
        
        const headers: Record<string, string> = {
          Authorization: `JWT ${this.accessToken}`,
        }

        const url = 'https://stage.api.delta-trade.app/api/v1/user/balance/'
        const response = await $fetch<IBalance>(url, {
          method: 'GET',
          headers,
        })
        this.balance = response;
        this.balanceLastFetched = Date.now(); // Update last fetched timestamp for balance
        return response;
      } catch (error) {
        this.balance = {
          dtc: '0',
          hold: '0',
          main: '0'
        }
        console.error('fetchUserBalance ', error)
        return error
      }
    },

    async fetchStatsOptimized(forceRefresh = false) {
      const CACHE_DURATION_MS_STATS = 5 * 60 * 1000; // 5 minutes for stats
      const now = Date.now();

      // Return cached stats if available, not forced, and not stale
      // Check if this.stats is not empty an object by checking its keys
      if (!forceRefresh && this.stats && Object.keys(this.stats).length > 0 && this.statsLastFetched && (now - this.statsLastFetched < CACHE_DURATION_MS_STATS)) {
        console.log('fetchStatsOptimized: Returning fresh stats from cache.');
        return Promise.resolve(this.stats);
      }
      console.log('fetchStatsOptimized: Cache stale or not available or forced. Fetching stats from API.');

      try {
        const accessToken = this.accessToken
        if (!accessToken) {
          throw new Error("Access token is missing");
        }
        const headers: Record<string, string> = {
          Authorization: `JWT ${accessToken}`,
        }

        const url = `https://stage.api.delta-trade.app/api/v1/robots/stats/`
        const response = await $fetch<IStats>(url, {
          method: 'GET',
          headers,
        })
        this.stats = response;
        this.statsLastFetched = Date.now(); // Update last fetched timestamp
        return response;
      } catch (error) {
        console.error('fetchStatsOptimized ', error)
        return error
      }
    },
   
    async fetchUserReferrals(forceRefresh = false) {
      const CACHE_DURATION_MS_FRIENDS = 5 * 60 * 1000; // 5 minutes for friends list
      const now = Date.now();

      // Return cached friends if available, not forced, and not stale
      if (!forceRefresh && this.userFriends.length > 0 && this.userFriendsLastFetched && (now - this.userFriendsLastFetched < CACHE_DURATION_MS_FRIENDS)) {
        console.log('fetchUserReferrals: Returning fresh friends list from cache.');
        return Promise.resolve(this.userFriends);
      }
      console.log('fetchUserReferrals: Cache stale or not available or forced. Fetching friends list from API.');

      console.time('fetchUserReferrals')
    
      try {
        if (!this.accessToken) {
          throw new Error("Access token is missing")
        }
        
        const headers = { Authorization: `JWT ${this.accessToken}` }
    
        const url = `https://stage.api.delta-trade.app/api/v1/referral/all_user_referrals/?max_level=5`
        this.userFriends = await $fetch<IFriend[]>(url, { headers });
        this.userFriendsLastFetched = Date.now(); // Update last fetched timestamp
    
        console.timeEnd('fetchUserReferrals');
        return this.userFriends;
      } catch (error) {
        this.userFriends = []
        console.error('fetchUserReferrals error', error)
        console.timeEnd('fetchUserReferrals')
        return error
      }
    },
    async fetchSubsribes() {
      console.time('fetchSubsribes')
    
      try {
        if (!this.accessToken) {
          throw new Error("Access token is missing")
        }
        
        const headers = { Authorization: `JWT ${this.accessToken}` }
    
        const url = `https://stage.api.delta-trade.app/api/v1/purchases/all_subscribes/`
        this.subscribes = await $fetch<ISubscribesResponseArray[]>(url, { headers })
    
        console.timeEnd('fetchSubsribes')
        return this.subscribes
      } catch (error) {
        this.subscribes = []
        console.error('fetchSubsribes error', error)
        console.timeEnd('fetchSubsribes')
        return error
      }
    },
    
    async logout() {
      const storage = useWebAppCloudStorage()
      await storage.removeStorageItem('accessToken')
      this.user = null
      this.accessToken = null
      this.refreshToken = null
    },
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getUserBalance(state) {
      return state.balance
    },
    getUserReferralsCount(state) {
      return state.userFriends.length
    },
    getMainStats(state) {
      if (state.stats) {
        return state.stats
      }
      return null
    },
    loadingProgressPercentage(state) {
      if (state.totalLoadingSteps === 0) {
        return 0; // Avoid division by zero, or return 100 if isLoading is false but no steps
      }
      return (state.completedLoadingSteps / state.totalLoadingSteps) * 100;
    }
  },
  persist: {
    paths: [
      'accessToken',
      'refreshToken',
      'authenticated',
      'user',
      'balance',
      'balanceLastFetched',
      'userFriends',
      'userFriendsLastFetched',
      'stats',
      'statsLastFetched',
      'appInitialized',
      'subscribes',
      // Add other state properties you want to persist here, e.g.:
      // 'userFriends', 
      // 'subscribes', 
      // 'stats',
      // 'initData', 
      // 'dataUnsafe',
      // 'products'
    ],
  },
})
