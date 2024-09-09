/** 用来批量校验form表单 */
export const validateRef = async (...rest) => {
  const promiseList = rest.map(item => {
    const promise = new Promise(resolve => {
      item.value.validate(err => {
        resolve(err);
      });
    });
    return promise;
  });

  const data = await Promise.all(promiseList);
  console.log(data);
  const resData = data
    ?.filter(item => item)
    ?.reduce((pre, next) => {
      if (!next) return pre;
      return [...pre, ...next];
    }, []);
  return resData.length ? resData : null;
};
