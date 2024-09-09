import { warn } from './log';

export function getStorageShortName() {
  const { VITE_APP_NAME } = getAppEnv();
  const mode = import.meta.env.MODE;
  return `${VITE_APP_NAME}__${mode}__`.toUpperCase();
}

export function getAppEnv() {
  const { VITE_APP_TITLE, VITE_APP_NAME, VITE_API_URL, VITE_UPLOAD_URL, VITE_APP_KEY } = import.meta.env;
  // console.log(import.meta)

  if (!/^[a-zA-Z_]*$/.test(VITE_APP_NAME)) {
    warn(
      `VITE_APP_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  return {
    VITE_APP_TITLE,
    VITE_APP_NAME,
    VITE_API_URL,
    VITE_UPLOAD_URL,
    VITE_APP_KEY
  };
}

export function getEnvMode() {
  return import.meta.env.MODE;
}
// 是否模拟启动测试环境
export function isDevMode() {
  const { VITE_ENV } = import.meta.env;
  return VITE_ENV === 'DEV';
}
// 是否本地开发
export function isLocalMode() {
  return import.meta.env.DEV;
}

export function isProdMode() {
  return import.meta.env.PROD;
}

// 获取当前应用类型
export function getAPPType() {
  return import.meta.env.VITE_APP_KEY;
}
