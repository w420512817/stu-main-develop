import { getStorageShortName } from '../common/env';
import { createStorage } from './storage';
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '@common/settings/encryption';

const createOptions = (storage, options = {}) => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption,
    storage,
    prefixKey: getStorageShortName(),
    timeout: DEFAULT_CACHE_TIME,
    ...options
  };
};

export const ss = createStorage(createOptions(sessionStorage));
export const ls = createStorage(createOptions(localStorage));
