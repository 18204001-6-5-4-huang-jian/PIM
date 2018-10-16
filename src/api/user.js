import Ajax from './baseApi';
/**
  * @description 获取uesrInfo
 * @param {String} token userId
 * @return { Promise }
*/

export const getUserInfo = function (token, userId) {
  return Ajax({
    url: `/user/info?token=${token}&userId=${userId}`
  })
}