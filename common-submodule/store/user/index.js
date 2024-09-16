import { h, ref } from 'vue';
import { defineStore } from 'pinia';
import { ls } from '@common/utils/cache';
import { setToken, getToken, removeToken } from '@common/utils/auth';
import { router } from '@/router';
import { getAreaTree, smsSendByAccount } from '@common/api/system/common';
import { AREAS_KEY, CUSTOMERID_KEY } from '@common/enum/cacheEnum';
import { removeEmptyChildrenField } from '@common/utils/common';
import { NInputNumber, NButton, NSpace } from 'naive-ui';
import useSmsCode from '@common/hooks/business/useSmsCode';

import { PageEnum, OrgTypeEnum } from '@common/enum/pageEnum';
import { useApplicationStore } from '../application';
import { useTabStore } from '../tab';
import { logout, getUserInfo, login, getPermCode } from '@common/api/system/user';
import { noticeNum } from '@common/api/system/common';
const { VITE_APP_KEY } = import.meta.env;

export const useUserStore = defineStore('user-store', {
  state: () => ({
    userInfo: {
      orgType: 30
    },
    customerId: ls.get(CUSTOMERID_KEY) || import.meta.env.VITE_APP_CUSTOMER_ID,
    token: getToken(),
    compareToken: '', // 用于比较的token
    areaTree: [], // 地区数据
    permissions: [], // 权限code列表
    noticeSum: 0,
    userOrgType: 'GOVERMENT' // 机构类型 详见枚举@common/enum/pageEnum
  }),
  getters: {
    isLogin(state) {
      return Boolean(state.token);
    },
    getAreaTree(state) {
      return state.areaTree.length > 0 ? state.areaTree : ls.get(AREAS_KEY);
    }
  },
  actions: {
    setNoticeSum(sum) {
      this.noticeSum = sum;
    },
    setUserInfo(info) {
      this.userInfo = info;
    },
    setCustomerId(info) {
      this.customerId = info;
      ls.set(CUSTOMERID_KEY, info);
    },
    setUserOrgType(orgType) {
      this.userOrgType = OrgTypeEnum[+orgType];
    },
    setPermissions(codes) {
      this.permissions = codes;
    },
    setAreaTree(list) {
      this.areaTree = list;
      ls.set(AREAS_KEY, list);
    },
    setToken(info) {
      this.token = info;
      this.compareToken = info;
      setToken(info);
    },
    resetState() {
      removeToken();
      ls.set(AREAS_KEY, []);
      this.setToken('');
      this.$reset();
    },
    async login(params) {
      try {
        const data = await login(params);
        if (!data) {
          return Promise.reject('登录失败！');
        }
        // 验证手机
        if (data.smsConfirm) {
          this.verifyPhoneCode({ ...data, ...params });
        } else {
          this.setToken(data.token);
          // console.log(router.getRoutes());
          !data.needResetPassWord && router.push(PageEnum.BASE_HOME);
        }
        return data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    verifyPhoneCode(data) {
      const code = ref(null);
      let d = null;
      const { getSmsCode, label, isCounting } = useSmsCode(smsSendByAccount);

      const toLogin = () => {
        const params = { smsCode: code.value, account: data.account };
        return login(params).then(data => {
          this.setToken(data.token);
          router.push(PageEnum.BASE_HOME);
        });
      };

      const status = ref();

      const renderContent = () =>
        h('div', null, [
          h(
            'div',
            { class: 'mb-4' },
            `系统已向您的手机 ${data.phone} 发送验证码，请查收！手机号码若有误，请联系上级管理员。`
          ),
          h(NSpace, null, [
            h(NInputNumber, {
              placeholder: '请输入手机验证码',
              showButton: false,
              autofocus: true,
              value: code.value,
              status: status.value,
              'onUpdate:value': val => (code.value = val),
              onKeypress: ({ keyCode }) => {
                if (keyCode === 13) {
                  if (!code.value) {
                    status.value = 'error';
                    return;
                  }
                  status.value = undefined;
                  d.loading = true;
                  toLogin()
                    .then(() => {
                      d.destroy();
                    })
                    .catch(() => {
                      d.loading = false;
                    });
                }
              }
            }),
            h(
              NButton,
              {
                type: 'text',
                disabled: isCounting.value,
                onClick: () => {
                  getSmsCode({ account: data.account });
                }
              },
              () => label.value
            )
          ])
        ]);

      d = window.$preDialog({
        type: 'info',
        title: '手机验证',
        showIcon: false,
        content: renderContent,
        positiveText: '确定',
        maskClosable: false,
        onPositiveClick: () => {
          if (code.value) {
            status.value = undefined;
            return toLogin();
          } else {
            status.value = 'error';
            return false;
          }
        }
      });

      getSmsCode({ account: data.account });
    },
    async getUserInfoAction() {
      try {
        const userInfo = await getUserInfo();
        this.setUserInfo(userInfo);
        this.setUserOrgType(userInfo.orgType);

        // 获取权限列表
        const codes = await getPermCode();
        this.setPermissions(codes);

        // 设置当前应用类型
        const { setAppType } = useApplicationStore();
        setAppType();

        this.handleSetNotice();

        // 获取地区数据
        this.getAreaTreeAction();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async handleSetNotice() {
      if (VITE_APP_KEY !== 'MAIN') return;
      this.handleSetNoticeNum();
      // 起一个异步任务轮询当前的数量
      window.noticeIntervalFn = setInterval(this.handleSetNoticeNum, 20 * 1000);
    },

    async handleSetNoticeNum() {
      if (!this.isLogin) {
        clearInterval(window.noticeIntervalFn);
        window.noticeIntervalFn = null;
        return;
      }
      const noticeSum = await noticeNum();
      this.setNoticeSum(noticeSum);
    },

    async logout() {
      const tabStore = useTabStore();
      if (getToken()) {
        try {
          await logout();
        } catch {
          console.log('注销Token失败');
        }
      }
      tabStore.resetState();
      this.setToken('');
      localStorage.clear();

      if (import.meta.env.VITE_APP_NAME == 'STUDENT_HEALTH') {
        router.push({ path: PageEnum.BASE_LOGIN });
      } else {
        window.location.href = `${PageEnum.BASE_LOGIN}/#/${this.customerId}/login`;
      }

      // const pushData = { path: PageEnum.BASE_LOGIN };

      // if (isRedirect) {
      //   // pushData.query = { redirect: router.currentRoute.value.fullPath };
      //   window.location.href = `${window.location.host}${PageEnum.BASE_LOGIN}?redirect=${router.currentRoute.value.fullPath}`;
      // } else {
      //   window.location.href = `${window.location.host}${PageEnum.BASE_LOGIN}`;
      //   // router.push(pushData);
      // }
    },

    getAreaTreeAction() {
      getAreaTree().then(data => {
        const { provinceVOList = [] } = data;
        const treeList = removeEmptyChildrenField(provinceVOList);
        this.setAreaTree(treeList);
      });
    }
  }
});
