import { defHttp } from '@common/utils/http';
import { isDevMode } from '@common/utils/common/env';

const basic = isDevMode() ? '/auth' : '/auth';

const Api = {
  Login: `${basic}/biz/login`,
  Logout: `${basic}/login/logout`,
  Register: `${basic}/biz/register`,
  GetPublicKey: `${basic}/biz/login/getPublicKey`,
  GetUserInfo: `${basic}/biz/getUserInfo`,
  GetPermCode: `${basic}/permission/getPermissionArray`,
  GetCaptchaCode: `${basic}/biz/login/captcha`,
  ForgetPassword: `${basic}/biz/forgetPassword`,
  UpdateAccountPassword: `${basic}/backstage/resetPassword` // 重置密码
};

export function login(params) {
  return defHttp.post(
    {
      url: Api.Login,
      params
    }
    // { errorMessageMode: 'modal' }
  );
}

export function getUserInfo() {
  return defHttp.get({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPublicKey() {
  return defHttp.get({ url: Api.GetPublicKey });
}

export function getPermCode() {
  return defHttp.get({ url: Api.GetPermCode });
}

export function getCaptchaCode() {
  return defHttp.get({ url: Api.GetCaptchaCode }, { withToken: false });
}

export function logout() {
  return defHttp.get({ url: Api.Logout, headers: { ignoreCancelToken: false } });
}

export function forgetPwd(params) {
  return defHttp.post({
    url: Api.ForgetPassword,
    params
  });
}

export function userRegist(params) {
  return defHttp.post(
    {
      url: Api.Register,
      params
    },
    { errorMessageMode: 'modal' }
  );
}

export function UpdateAccountPassword(params) {
  return defHttp.post({
    url: Api.UpdateAccountPassword,
    params
  });
}
