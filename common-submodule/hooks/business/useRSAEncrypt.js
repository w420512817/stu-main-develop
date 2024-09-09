import { RSAencrypt } from '@common/utils/common/cipher';
import { getPublicKey } from '@common/api/system/user';

let publicKey = null;

export default function useEncrypt() {
  const getEncrypt = async val => {
    if (!publicKey) {
      publicKey = await getPublicKey();
    }
    const value = RSAencrypt(val, publicKey);
    return value;
  };

  return {
    getEncrypt
  };
}
