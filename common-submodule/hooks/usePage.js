import { useRouter } from 'vue-router';
import { PageEnum } from '@common/enum/pageEnum';
import { isString, isUrl } from '@common/utils/common/is';

function handleError(e) {
  console.error(e);
}

// 当在setup外调用时须传入router实例
export function useGo(_router) {
  const route = _router || useRouter();
  const { push, replace } = route;
  function go(opt = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      if (isUrl(opt)) {
        window.open(opt, '_blank');
      } else {
        isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
      }
    } else {
      const o = opt;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return { go, route };
}
