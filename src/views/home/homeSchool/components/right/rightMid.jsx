import { defineComponent, ref, onMounted } from 'vue';
import { NGrid, NGi, NEllipsis } from 'naive-ui';
import { iconifyRender } from '@common/utils/common/icon';
import { useRouteStore } from '@/store';
import { commonFunction } from '@/api/dashbord/school';
import { useGo } from '@common/hooks/usePage';
import Empty from '../empty.vue';
export default defineComponent({
  setup() {
    const { go } = useGo();
    const routeStore = useRouteStore();
    const comFuncList = ref([]);

    async function getCommonFunction() {
      let routers = JSON.parse(JSON.stringify(routeStore.getMenuList));
      let res = await commonFunction();

      let stack = [...routers];

      for (let i = 0; i < stack.length; i++) {
        if (!res?.length) break;
        let route = stack[i];
        let index = res.findIndex(item => item.menuId === route.path);
        if (index !== -1) {
          let { menuName, clickTime: clickCount, menuId } = res[index];
          comFuncList.value.push({ menuName, menuId, icon: route.meta.icon, clickCount });
          res.splice(index, 1);
        }
        if (route.children?.length) {
          route.children.forEach(item => {
            item.meta.icon = item.meta.icon || route.meta.icon;

            stack.push(item);
          });
        }
      }
      comFuncList.value.sort((n, n1) => n1.clickCount - n.clickCount);
    }
    onMounted(() => {
      getCommonFunction();
    });
    return { comFuncList, go };
  },
  render() {
    return (
      <NGrid cols="3" x-gap="20" y-gap="20" className="h-128px">
        {this.comFuncList.map(item => {
          return (
            <NGi>
              <div
                className="rounded-1 py-3  bg-[#f7f9fc] flex-center cursor-pointer"
                onClick={() => this.go(item.menuId)}
              >
                {item.icon && <span className="text-[#5083FF] text-20px mr-3">{iconifyRender(item.icon)()}</span>}
                <NEllipsis className="text-14px text-[#222] font-medium ">
                  <span className="whitespace-nowrap">{item.menuName}</span>
                </NEllipsis>
              </div>
            </NGi>
          );
        })}
        {!this.comFuncList.length ? (
          <NGi span="3">
            <Empty />
          </NGi>
        ) : null}
      </NGrid>
    );
  }
});
