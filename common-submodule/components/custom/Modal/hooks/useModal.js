import { ref, unref, toRaw, nextTick, watchEffect, getCurrentInstance, onUnmounted, reactive } from 'vue';
import { isFunction } from '@common/utils/common/is';
import { tryOnUnmounted } from '@vueuse/core';

const dataTransfer = reactive({});

export function useModal() {
  const modal = ref(null);
  const loaded = ref(false);
  const uid = ref('');

  const register = (modalMethod, uuid) => {
    if (!getCurrentInstance()) {
      throw new Error('useModal() can only be used inside setup() or functional components!');
    }

    uid.value = uuid;
    onUnmounted(() => {
      modal.value = null;
      loaded.value = false;
      dataTransfer[unref(uid)] = null;
    });
    if (unref(loaded) && modalMethod === unref(modal)) return;

    modal.value = modalMethod;
    loaded.value = true;
  };

  const getInstance = () => {
    const instance = unref(modal);
    if (!instance) {
      console.error('useModal instance is undefined!');
    }
    return instance;
  };

  const methods = {
    setProps: props => {
      getInstance()?.setProps(props);
    },

    openModal: (visible = true, data) => {
      getInstance()?.setProps({ visible });

      if (!data) return;
      dataTransfer[unref(uid)] = null;
      dataTransfer[unref(uid)] = toRaw(data);
    },
    closeModal: () => {
      getInstance()?.setProps({ visible: false });
    }
  };

  return [register, methods];
}

export const useModalInner = callbackFn => {
  const modalInstanceRef = ref(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref('');

  const getInstance = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      console.error('useModalInner instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance, uuid) => {
    tryOnUnmounted(() => {
      modalInstanceRef.value = null;
    });
    uidRef.value = uuid;
    modalInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setProps({ loading });
      },
      changeOkLoading: (loading = true) => {
        getInstance()?.setProps({ confirmLoading: loading });
      },
      closeModal: () => {
        getInstance()?.setProps({ visible: false });
      },
      setProps: props => {
        getInstance()?.setProps(props);
      }
    }
  ];
};
