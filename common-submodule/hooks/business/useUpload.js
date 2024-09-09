import { toRaw } from 'vue';
import { uploadFile } from '@/api/common';

export default function useUpload() {
  const handleUpload = async (fileList, params = {}) => {
    const fns = [];

    fileList = toRaw(fileList);
    fileList = fileList.filter(i => !i.url); // 回显的文件跳过

    if (!fileList.length) return Promise.resolve([]);

    fileList.forEach(file => {
      const filename = `${Date.now()}.${file?.type.split('/')[1]}`;
      Object.assign(file, { name: 'file', filename, data: params });

      const createAsyncIterable = () => {
        return new Promise((resolve, reject) => {
          uploadFile(file)
            .then(({ data: { data } }) => {
              resolve(data);
            })
            .catch(error => reject(error));
        });
      };

      fns.push(createAsyncIterable());
    });

    try {
      const result = await Promise.all(fns);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // async function handleUpload(fileList) {
  //   const createAsyncIterable = list => {
  //     list = list.filter(i => !i.url); // 回显的文件跳过

  //     if (!list.length) return () => Promise.resolve();

  //     return list.map(file => {
  //       return new Promise((resolve, reject) => {
  //         file.name = 'file';
  //         const fileType = file?.type.split('/')[1];
  //         file.filename = Date.now() + '.' + fileType;
  //         file.data = data;

  //         uploadFile(file)
  //           .then(({ data: { data } }) => {
  //             resolve(data);
  //             urls.push({ url: data.accessPath });
  //           })
  //           .catch(error => reject(error));
  //       });
  //     });
  //   };

  //   try {
  //     for await (let _ of createAsyncIterable(fileList)) {
  //       // ...
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  return {
    handleUpload
  };
}
