import { resultError, resultSuccess, getRequestToken } from '../utils';

const basic = process.env.NODE_ENV === 'development' ? 'student-qyx' : 'student';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      account: 'gov',
      password: 'gov123456',
      token: 'fakeToken1',
      ...{
        areaId: '610000',
        avatar: null,
        birth: '2000-07-28',
        govLevel: 1,
        id: '1280675499532032',
        idCard: 'MzEwMTEyMjAwMDA3MjgwMzA5',
        loginTimes: 0,
        manageAreaId: '610000',
        manageAreaName: '陕西省',
        orgId: '1280674354847488',
        orgName: '陕西教育局',
        orgProperty: 8,
        orgType: 30,
        phone: 'MTU4OTY4NTU5OTQ=',
        realName: '陕西教育局',
        regionList: [],
        roleName: null,
        sex: '女'
      }
    },
    {
      userId: '2',
      account: 'school',
      password: 'school123456',
      token: 'fakeToken2',
      ...{
        areaId: null,
        avatar: null,
        birth: '1978-05-27',
        govLevel: null,
        id: '1376962735136512',
        idCard: 'MzMwMTA0MTk3ODA1MjczOTEx',
        loginTimes: 0,
        manageAreaId: null,
        manageAreaName: null,
        orgId: '1280739653607168',
        orgName: '西安实验小学',
        orgProperty: 1,
        orgType: 10,
        phone: 'MTMzMDAwMDAwMDA=',
        realName: '测试',
        regionList: [],
        roleName: null,
        sex: '男'
      }
    }
  ];
}

const fakeCodeList = {
  1: [
    9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012, 9013, 9014, 9015, 9016, 9017, 9018, 9031,
    9032, 9033, 9034, 9035, 9036, 9037, 9038, 9039, 9040, 9047, 9048, 9049, 9050, 9051, 9052, 9053, 9054, 9055, 9056,
    9057, 9058, 9059, 9060, 9061, 9062, 9063, 9064, 9065, 9066, 9079, 9080, 9081, 9082, 9083, 9084, 9085, 9086, 9087,
    9088, 9095, 9096, 9097, 9098, 9099, 9100, 9101, 9102, 9103, 9104, 9105, 9106, 9107, 9108, 9109, 9110, 9111, 9112,
    9113, 9114, 9127, 9128, 9129, 9130, 9131, 9132, 9133, 9134, 9135, 9136, 9143, 9144, 9145, 9146, 9147, 9148, 9149,
    9150, 9151, 9152, 9153, 9154, 9155, 9156, 9157, 9158, 9159, 9160, 9161, 9162, 9175, 9176, 9177, 9178, 9179, 9180,
    9181, 9182, 9183, 9184, 9191, 9192, 9193, 9194, 9195, 9196, 9197, 9198, 9199, 9200, 9201, 9213, 9214, 9215, 9216,
    9217, 9218, 9219, 9220, 9221, 9222, 9229, 9230, 9231, 9232, 9233, 9234, 9235, 9236, 9237, 9238, 9239, 9240, 9241,
    9242, 9243, 9244, 9245, 9246, 9247, 9248, 9249, 9250, 9251, 9252, 9253, 9254, 9255, 9256, 9257, 9258, 9259, 9260,
    9261, 9262, 9263, 9264, 9265, 9266, 9267, 9268, 9269, 9270, 9271, 9272, 9273, 9274, 9275, 9276, 9277, 9278, 9301,
    9302, 9304, 9305, 9306, 9343, 9344, 9346, 9363, 9364, 9365, 9366, 9367, 9368, 9369, 9370, 9371, 9372, 9373, 9374,
    9375, 9376, 9377, 9378, 9379, 9380, 9381, 9382, 9383, 9384, 9385, 9386, 9387, 9388, 9389, 9397, 9398, 9399, 9400,
    9401, 9410, 9411, 9412, 9413, 9414
  ],
  2: [
    2600, 2601, 2602, 2603, 2604, 2605, 2606, 2607, 2608, 2609, 2610, 9001, 9002, 9003, 9004, 9005, 9007, 9015, 9017,
    9019, 9020, 9021, 9022, 9023, 9024, 9025, 9026, 9027, 9028, 9029, 9030, 9031, 9038, 9039, 9040, 9041, 9042, 9043,
    9044, 9045, 9046, 9051, 9052, 9053, 9055, 9063, 9065, 9067, 9068, 9070, 9071, 9072, 9073, 9074, 9075, 9076, 9077,
    9078, 9079, 9086, 9087, 9088, 9089, 9090, 9091, 9092, 9093, 9094, 9099, 9100, 9101, 9103, 9111, 9113, 9115, 9116,
    9118, 9119, 9120, 9121, 9122, 9123, 9124, 9125, 9126, 9127, 9134, 9135, 9136, 9137, 9138, 9139, 9140, 9141, 9142,
    9147, 9148, 9149, 9151, 9159, 9161, 9163, 9164, 9166, 9167, 9168, 9169, 9170, 9171, 9172, 9173, 9174, 9175, 9182,
    9183, 9184, 9185, 9186, 9187, 9188, 9189, 9190, 9195, 9196, 9197, 9202, 9203, 9204, 9206, 9207, 9208, 9209, 9210,
    9211, 9212, 9213, 9220, 9221, 9222, 9223, 9224, 9225, 9226, 9227, 9228, 9233, 9279, 9280, 9281, 9282, 9283, 9284,
    9285, 9286, 9287, 9288, 9289, 9290, 9291, 9292, 9293, 9294, 9295, 9296, 9297, 9298, 9299, 9300, 9303, 9306, 9307,
    9308, 9309, 9310, 9311, 9312, 9313, 9314, 9315, 9316, 9317, 9318, 9319, 9320, 9321, 9322, 9323, 9324, 9325, 9326,
    9327, 9328, 9329, 9330, 9331, 9332, 9333, 9334, 9335, 9336, 9337, 9338, 9339, 9340, 9341, 9342, 9343, 9344, 9345,
    9346, 9347, 9348, 9349, 9350, 9351, 9352, 9353, 9354, 9363, 9364, 9365, 9366, 9367, 9368, 9369, 9370, 9371, 9372,
    9373, 9374, 9375, 9376, 9377, 9378, 9379, 9380, 9381, 9382, 9383, 9384, 9385, 9386, 9387, 9388, 9389, 9390, 9391,
    9392, 9393, 9394, 9395, 9396, 9402, 9403, 9404, 9405, 9406, 9415, 9416, 9417, 9418, 9419, 9420, 9421, 9422, 9423,
    9424, 9425, 9426
  ]
};

export default [
  // mock user login
  {
    url: '/basic-api/auth/biz/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { account, password } = body;
      const checkUser = createFakeUserList().find(item => item.account === account && password === item.password);
      if (!checkUser) {
        return resultError('账户名或密码错误！');
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
    url: '/basic-api/auth/biz/getUserInfo',
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
    url: '/basic-api/auth/permission/getPermissionArray',
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
    url: '/basic-api/auth/login/logout',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(true, { message: 'Token has been destroyed' });
    }
  },
  {
    url: `/basic-api/${basic}/import/student/getTaskProgress`,
    timeout: 200,
    method: 'get',
    response: () => resultSuccess({ state: 3 })
  }
];
