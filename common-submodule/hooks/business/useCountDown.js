import { ref, computed } from 'vue';
import useBoolean from '../useBoolean';

/**
 * 倒计时
 * @param second - 倒计时的时间(s)
 */
export default function useCountDown(second) {
  if (second <= 0 && second % 1 !== 0) {
    throw Error('倒计时的时间应该为一个正整数！');
  }
  const { bool: isComplete, setTrue, setFalse } = useBoolean(false);

  const counts = ref(0);
  const isCounting = computed(() => Boolean(counts.value));

  let intervalId;

  /**
   * 开始计时
   * @param updateSecond - 更改初时传入的倒计时时间
   */
  function start(updateSecond = second) {
    if (!counts.value) {
      setFalse();
      counts.value = updateSecond;
      intervalId = setInterval(() => {
        counts.value -= 1;
        if (counts.value <= 0) {
          clearInterval(intervalId);
          setTrue();
        }
      }, 1000);
    }
  }

  /**
   * 停止计时
   */
  function stop() {
    intervalId = clearInterval(intervalId);
    counts.value = 0;
  }

  return {
    counts,
    isCounting,
    start,
    stop,
    isComplete
  };
}
