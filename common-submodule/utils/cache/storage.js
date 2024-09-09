import { cacheCipher } from '@common/settings/encryption';
import { AesEncryption } from '../common/cipher';
import { isNullOrUnDef } from '../common/is';

export const createStorage = ({ prefixKey = '', storage = sessionStorage, timeout = null, hasEncrypt = true } = {}) => {
  const encryption = new AesEncryption({ ...cacheCipher });

  const WebStorage = class WebStorage {
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = encryption;
      this.hasEncrypt = hasEncrypt;
    }

    _getKey(key) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * Set cache
     * @param {string} key
     * @param {*} value
     * @param {*} expire Expiration time in seconds
     * @memberof Cache
     */
    set(key, value, expire = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
      });
      const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
      this.storage.setItem(this._getKey(key), stringifyValue);
    }

    /**
     * Read cache
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get(key, def = null) {
      const val = this.storage.getItem(this._getKey(key));
      if (!val) return def;

      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key) {
      this.storage.removeItem(this._getKey(key));
    }

    /**
     * Delete all caches of this instance
     */
    clear() {
      this.storage.clear();
    }
  };

  return new WebStorage();
};
