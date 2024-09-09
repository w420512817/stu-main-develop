import { iconifyRender } from '@common/utils/common/icon';
import { isUrl } from '@common/utils/common/is';
import { filter, removeEmptyChildrenField } from '@common/utils/common';
import { cloneDeep } from 'lodash-es';

function joinParentPath(menus, parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // https://next.router.vuejs.org/guide/essentials/nested-routes.html
    // Note that nested paths that start with / will be treated as a root path.
    // This allows you to leverage the component nesting without having to use a nested URL.
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // path doesn't start with /, nor is it a url, join parent path
      menu.path = `${parentPath}/${menu.path}`;
      // 用path作为menu的key
      menu.key = menu.path;
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.path);
    }
  }
}

function treeMap(treeData, func) {
  return treeData.map(item => treeMapEach(item, func));
}

function treeMapEach(data, func) {
  const haveChildren = Array.isArray(data.children) && data.children.length > 0;

  const conversionData = func(data) || {};

  if (haveChildren) {
    return {
      ...conversionData,
      children: data.children.map(i => treeMapEach(i, func))
    };
  } else {
    return {
      ...conversionData
    };
  }
}

function findPath(tree, func) {
  const path = [];
  const list = [...tree];
  const visitedSet = new Set();
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node.children && list.unshift(...node.children);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function getAllParentPath(treeData, path) {
  const menuList = findPath(treeData, n => n.path === path);
  return (menuList || []).map(item => item.path);
}

/** 将路由转换成菜单 */
function transformRouteToMenu(routes) {
  const cloneRouteModList = cloneDeep(routes);
  const routeList = [];

  cloneRouteModList.forEach(item => {
    if (item.meta?.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect;
      item.children = undefined;
    }
    routeList.push(item);
  });

  const list = treeMap(routeList, node => {
    const { name, meta: { title, icon } = {} } = node;

    return {
      meta: node.meta,
      key: node.path,
      label: title,
      name,
      icon: icon && iconifyRender(icon),
      path: node.path,
      ...(node.redirect ? { redirect: node.redirect } : {})
    };
  });

  // 路径拼接
  joinParentPath(list);
  // 排序
  list.sort((a, b) => (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0));

  return cloneDeep(list);
}

export function getMenusFromRoutes(routes) {
  let menus = transformRouteToMenu(routes);

  menus = filter(menus, item => !item.meta?.hideMenu);
  menus = menus.filter(item => !item.meta?.hideMenu);

  // 删除children为空的字段
  menus = removeEmptyChildrenField(menus);

  return menus;
}
