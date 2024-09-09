import { unref } from 'vue';
import { defineStore } from 'pinia';
import { getTaskProgress, getTaskDealCount, cancelTask } from '@/api/information/student';
import { router } from '@/router';
import useApi from '@common/hooks/business/useApi';
import { useUserStore } from '../user';

const { fetch } = useApi(getTaskProgress);
export const useStudentStore = defineStore('student-store', {
  state: () => ({
    visible: false,
    showResultModal: false,
    state: {},
    params: {},
    isStartTimer: false,
    isClosed: false,
    retryCount: 0
  }),
  actions: {
    setParams(params) {
      this.params = params;
    },
    updateImportResult(state) {
      console.log(state, 'state');
      this.state = state;
    },
    showImportBtn() {
      this.visible = true;
    },
    openResultModal() {
      this.showResultModal = true;
    },
    hideResultModal() {
      this.showResultModal = false;
    },
    async jumpPageAndOpenModal() {
      const { path } = unref(router.currentRoute);
      const studentPath = '/information/student';
      if (path !== studentPath) {
        router.push({ path: studentPath });
        setTimeout(() => {
          this.showResultModal = true;
        }, 500);
      } else {
        this.showResultModal = true;
      }
    },
    startTimer() {
      // 上传文件之后需要启动定时器
      this.isStartTimer = true;
      window.studentTimer = setInterval(() => {
        setTimeout(async () => {
          this.getData();
        }, 0);
      }, 5000);
    },
    clearTimer() {
      this.isStartTimer = false;
      if (window.studentTimer) {
        clearInterval(window.studentTimer);
        window.studentTimer = null;
      }
    },
    async getData() {
      const data = await fetch(this.param);
      if (!data?.state) {
        // 请求异常三次之后清除定时器
        if (this.retryCount == 3) {
          this.clearTimer();
          return;
        } else {
          this.retryCount += 1;
          if (!window.studentTimer) this.startTimer();
        }
      } else {
        // 请求成功显示
        if ((data.state == 1 || data.state == 2) && !window.studentTimer) {
          // 页面刷新,如果后端导入功能未完成，则启动定时器,并显示导入进度的按钮
          this.startTimer();
          this.showImportBtn();
        }
        if (data.state >= 3) this.clearTimer();
        this.updateImportResult(data);
        this.retryCount = 0;
      }
    },
    async onClose() {
      if (this.isClosed) return;
      this.isClosed = true;

      const data = await fetch(this.params);
      console.log(data, 'data');
      if (!data?.state) return;
      this.updateImportResult(data);
      const { state, taskId } = this.state;
      if (state == 1 || state == 2) {
        // 排队中，进行中的任务进行取消操作
        let count = 0;
        if (state == 2) {
          count = await getTaskDealCount({ taskId });
        }
        const str = `当前已导入${count}条数据，如果确认放弃导入，已导入数据将不再保留`;
        const userStore = useUserStore();
        window.$dialogError(str, () => {
          return cancelTask({ orgId: userStore.orgId, taskId }).then(() => {
            window.$message.success('取消导入成功');
            this.visible = false;
            this.showResultModal = false;
            this.clearTimer();
            this.updateImportResult({ state: 4 }); // 中途中止导入需更新成中止状态，以确保页面 导入 按钮状态更新
          });
        });
        this.isClosed = false;
      } else {
        // 关闭按钮 关闭导入结果弹窗
        this.visible = false;
        this.showResultModal = false;
        this.isClosed = false;
      }
    }
  }
});
