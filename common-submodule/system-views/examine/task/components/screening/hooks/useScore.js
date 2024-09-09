import { ref } from 'vue';
import { getPhysicalScore } from '@common/api/examine/task';

import { useDebounceFn } from '@vueuse/core';

export default function useScore() {
  const score = ref(null);

  const getScore = useDebounceFn(async (type, value, stuInfo) => {
    const { taskId, studentId } = stuInfo ?? {};
    const data = await getPhysicalScore({ taskId, studentId, [type]: value });
    score.value = data[`${type}Score`];
  }, 500);
  return { score, getScore };
}
