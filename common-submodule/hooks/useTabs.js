import { unref } from 'vue';
import { useRouter } from 'vue-router';
import { theme } from '@common/settings/theme';
import { useTabStore } from '@/store';

const TableActionEnum = {
  CLOSE_LEFT: 'close_left',
  CLOSE_RIGHT: 'close_right',
  CLOSE_OTHER: 'close_other',
  CLOSE_CURRENT: 'close_current',
  CLOSE: 'close'
};

export function useTabs(_router) {
  function canIUseTabs() {
    const { visible } = theme.tab;
    if (!visible) {
      throw new Error('The multi-tab page is currently not open, please open it in the settings！');
    }
    return !!visible;
  }

  const tabStore = useTabStore();
  const router = _router || useRouter();

  const { currentRoute } = router;

  function getCurrentTab() {
    const route = unref(currentRoute);
    return tabStore.tabList.find(item => item.path === route.path);
  }

  async function updateTabTitle(title, tab) {
    const canIUse = canIUseTabs();
    if (!canIUse) {
      return;
    }
    const targetTab = tab || getCurrentTab();
    await tabStore.setTabTitle(title, targetTab);
  }

  async function handleTabAction(action, tab) {
    const canIUse = canIUseTabs();
    if (!canIUse) {
      return;
    }
    const currentTab = getCurrentTab();
    switch (action) {
      case TableActionEnum.CLOSE_LEFT:
        await tabStore.closeLeftTabs(currentTab);
        break;

      case TableActionEnum.CLOSE_RIGHT:
        await tabStore.closeRightTabs(currentTab);
        break;

      case TableActionEnum.CLOSE_OTHER:
        await tabStore.closeOtherTabs(currentTab);
        break;

      case TableActionEnum.CLOSE_CURRENT:
      case TableActionEnum.CLOSE:
        await tabStore.closeTab(tab || currentTab, router);
        break;
    }
  }

  return {
    closeLeft: () => handleTabAction(TableActionEnum.CLOSE_LEFT),
    closeRight: () => handleTabAction(TableActionEnum.CLOSE_RIGHT),
    closeOther: () => handleTabAction(TableActionEnum.CLOSE_OTHER),
    closeCurrent: () => handleTabAction(TableActionEnum.CLOSE_CURRENT),
    close: tab => handleTabAction(TableActionEnum.CLOSE, tab),
    setTitle: (title, tab) => updateTabTitle(title, tab)
  };
}
