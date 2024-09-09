import { clickCount } from '@common/api/system/common';
export default function useRouteBuried() {
  async function note(route) {
    let { title, notNote } = route.meta;
    if (notNote) return;
    await clickCount({ menuId: route.path, menuName: title });
  }
  return { note };
}
