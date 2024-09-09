import { defineStore } from 'pinia';
import { AppTypeEnum } from '@common/enum/pageEnum';
export const useApplicationStore = defineStore('application-store', {
  state: () => ({
    appType: '1'
  }),

  actions: {
    setAppType() {
      const { VITE_APP_KEY } = import.meta.env;
      const typeNum = AppTypeEnum[VITE_APP_KEY] ?? '';
      this.appType = typeNum;
    }
  }
});
