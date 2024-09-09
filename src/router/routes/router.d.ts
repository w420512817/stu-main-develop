interface RouteMeta {
  /** 路由名称(作为菜单时为菜单的名称) */
  title: string;
  /** 缓存页面 */
  keepAlive?: boolean;
  /** 不作为菜单 */
  hideMenu?: boolean;
  /** 菜单和面包屑对应的图标 */
  icon?: string;
  /** 导入的路由模块排序，可用于菜单的排序 （越小越靠前） */
  orderNo?: number;
  /* 资源id 用于鉴权 */
  resourceId?: number;
  /* 忽略鉴权 */
  ignoreAuth?: boolean;
  /* 多页签固定（不可关闭） */
  // affix?: boolean;
  /* 不展示面包屑菜单 */
  hideBreadcrumb?: boolean;
  /* 隐藏子菜单（用于仅有一个展示的子菜单） */
  hideChildrenInMenu?: boolean;
  /* 当前激活菜单（用于当隐藏菜单时关联激活菜单） */
  activeMenu?: string;
  /* 多页签不展示 */
  hideTab?: boolean;
  /* 路由及菜单生效环境 */
  envMode?: string;
  /* iframe地址 */
  frameSrc?: string;
}
