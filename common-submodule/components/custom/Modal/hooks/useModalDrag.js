import { unref, watchEffect, nextTick } from 'vue';
import { isFunction } from '@common/utils/common/is';

export function useModalDragMove(context, callback) {
  const getStyle = (dom, attr) => {
    return getComputedStyle(dom)[attr];
  };

  const drag = wrap => {
    if (!wrap) return;
    const dialogHeaderEl = wrap.querySelector('.n-modal .n-card-header');
    const dragDom = wrap.querySelector('.n-modal');

    if (!dialogHeaderEl || !dragDom || !context.draggable) return;

    dialogHeaderEl.style.cursor = 'move';

    dialogHeaderEl.onmousedown = e => {
      if (!e) return;
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX;
      const disY = e.clientY;
      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const minDragDomTop = dragDom.offsetTop;

      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;

      const domLeft = getStyle(dragDom, 'left');
      const domTop = getStyle(dragDom, 'top');

      let styL = +domLeft.replace(/px/g, '');
      let styT = +domTop.replace(/px/g, '');

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };

  isFunction(callback) && callback();

  const handleDrag = () => {
    const dragWraps = document.querySelectorAll('.n-modal-container');
    for (const wrap of Array.from(dragWraps)) {
      if (!wrap) continue;
      const display = getStyle(wrap, 'display');
      if (display !== 'none') {
        drag(wrap);
      }
    }
  };

  watchEffect(async () => {
    if (!unref(context.visible) || !context.draggable) {
      return;
    }
    await nextTick();
    handleDrag();
  });
}
