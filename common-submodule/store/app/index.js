import { nextTick } from 'vue';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app-store', {
  state: () => ({
    reloadFlag: true,
    siderCollapse: false
  }),
  actions: {
    /** 设置侧边栏折叠状态 */
    setSiderCollapse(collapse) {
      this.siderCollapse = collapse;
    },
    /** 折叠/展开 侧边栏折叠状态 */
    toggleSiderCollapse() {
      this.siderCollapse = !this.siderCollapse;
    },
    /**
     * 重载页面
     * @param duration - 重载的延迟时间(ms)
     */
    async reloadPage(duration = 0) {
      this.reloadFlag = false;
      await nextTick();
      if (duration) {
        setTimeout(() => {
          this.reloadFlag = true;
        }, duration);
      } else {
        this.reloadFlag = true;
      }
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
      }, 100);
    }
  }
});
