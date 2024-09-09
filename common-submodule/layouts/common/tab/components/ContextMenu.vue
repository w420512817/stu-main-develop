<template>
  <n-dropdown
    :show="dropdownVisible"
    :options="options"
    placement="bottom-start"
    :x="x"
    :y="y"
    @clickoutside="hide"
    @select="handleDropdown"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { bool, object, number } from 'vue-types';
import { useAppStore, useTabStore } from '@/store';
import { iconifyRender } from '@common/utils/common/icon';

defineOptions({ name: 'ContextMenu' });

const props = defineProps({
  /** 右键菜单可见性 */
  visible: bool().def(false),
  /** 当前路由信息 */
  current: object().def({}),
  /** 鼠标x坐标 */
  x: number(),
  /** 鼠标y坐标 */
  y: number()
});

const emit = defineEmits(['update:visible']);

const router = useRouter();
const appStore = useAppStore();
const tabStore = useTabStore();

const index = computed(() => tabStore.tabList.findIndex(tab => tab.path === props.current.path));
const isCurItem = computed(() => props.current.path === router.currentRoute.value.path);
const disabled = computed(() => tabStore.tabList.length === 1);
const closeLeftDisabled = computed(() => index.value === 0 || !isCurItem.value);
const closeRightDisabled = computed(() => !isCurItem.value || index.value === tabStore.tabList.length - 1);
// const index = tabStore.tabList.findIndex(tab => tab.path === props.current.path);
// const isCurItem = props.current.path === router.currentRoute.value.path;
// const disabled = tabStore.tabList.length === 1;
// const closeLeftDisabled = index === 0 || !isCurItem;
// const closeRightDisabled = !isCurItem.value || index.value === tabStore.tabList.length - 1;

const dropdownVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

function hide() {
  console.log(props.current);
  dropdownVisible.value = false;
}

const options = computed(() => [
  {
    label: '重新加载',
    key: 'reload-current',
    disabled: !isCurItem.value,
    icon: iconifyRender('ant-design:reload-outlined')
  },
  {
    label: '关闭',
    key: 'close-current',
    disabled: disabled.value,
    icon: iconifyRender('ant-design:close-outlined')
  },
  {
    label: '关闭其他',
    key: 'close-other',
    disabled: disabled.value || !isCurItem.value,
    icon: iconifyRender('ant-design:column-width-outlined')
  },
  {
    label: '关闭左侧',
    key: 'close-left',
    disabled: closeLeftDisabled.value,
    icon: iconifyRender('mdi:format-horizontal-align-left')
  },
  {
    label: '关闭右侧',
    key: 'close-right',
    disabled: closeRightDisabled.value,
    icon: iconifyRender('mdi:format-horizontal-align-right')
  }
]);

const actionMap = new Map([
  [
    'reload-current',
    () => {
      appStore.reloadPage();
    }
  ],
  [
    'close-current',
    () => {
      tabStore.closeTab(props.current, router);
    }
  ],
  [
    'close-other',
    () => {
      tabStore.closeOtherTabs(props.current);
    }
  ],
  [
    'close-left',
    () => {
      tabStore.closeLeftTabs(props.current);
    }
  ],
  [
    'close-right',
    () => {
      tabStore.closeRightTabs(props.current);
    }
  ]
]);

function handleDropdown(optionKey) {
  const key = optionKey;
  const actionFunc = actionMap.get(key);
  if (actionFunc) {
    actionFunc();
  }
  hide();
}
</script>

<style scoped></style>
