import { resultError, resultSuccess, getRequestToken } from '../utils';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      account: 'admin',
      realName: 'admin',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super'
        }
      ]
    },
    {
      userId: '2',
      account: 'test',
      password: '123456',
      realName: 'test user',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test'
        }
      ]
    }
  ];
}

const fakeCodeList = {
  1: [1000, 3000, 5000],
  2: [2000, 4000, 6000]
};

export default [
  // mock user login
  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { account, password } = body;
      const checkUser = createFakeUserList().find(item => item.account === account && password === item.password);
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const { userId, account: _account, token, realName, desc, roles } = checkUser;
      return resultSuccess({
        roles,
        userId,
        account: _account,
        token,
        realName,
        desc
      });
    }
  },
  {
    url: '/basic-api/getUserInfo',
    method: 'get',
    response: request => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    }
  },
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: request => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    }
  },
  {
    url: '/basic-api/logout',
    timeout: 200,
    method: 'get',
    response: request => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed' });
    }
  }
];
