import Ajax from './baseApi';
import { promises } from 'fs';

/**
 * @description 获取行业列表
 * @param {String} user_id
 * @return { Promise }
*/
export const getIndustryList = function (user_id) {
  return Ajax({
    url: `/business/list/${user_id}`
  })
}

/**
 * @description 根据搜索条件获取行业列表
 * @param {String} user_id keyword 
 * @return { Promise }
*/
export const getkeyIndustryList = function (user_id, keyword) {
  return Ajax({
    url: `/search/business/${user_id}`,
    data: {
      key: keyword
    }
  })
}

/**
 * @description 根据搜索条件获取公司名称
 * @param {String} user_id keyword 
 * @return { Promise }
*/
export const getkeyCompanyNameList = function (user_id, keyword) {
  return Ajax({
    url: `/search/company/${user_id}`,
    data: {
      key: keyword
    }
  })
}

/**
 * @description 添加一个新行业
 * @param {String} user_id businessName
 * @return { Promise }
*/
export const addIndustry = function (user_id, businessName) {
  return Ajax({
    url: `/add/business/${user_id}`,
    data: {
      businessName
    }
  })
}

/**
 * @description 添加一个母基金
 * @param {String} user_id fundName
 * @return {Promise}
*/
export const addFundName = function (user_id, fundName) {
  return Ajax({
    url: `/add/fund/${user_id}`,
    data: {
      fundName
    }
  })
}

/**
 * @description 母基金/工作小组搜索
 * @param {String} user_id keyword
 * @return {Promise}
*/
export const selectFundName = function (user_id, key) {
  return Ajax({
    url: `/search/fund/${user_id}`,
    data: {
      key
    }
  })
}

/**
 * @description 获取母基金(工作小组)列表
 * @param {String} user_id
 * @return { Promise }
*/
export const getworkGroup = function (user_id) {
  return Ajax({
    url: `/fund/list/${user_id}`
  })
}

/**
 * @description 获取tab中的第一级数据
 * @param userId 用户ID
 * @param data 传递的数据
 * @return { Promise }
 */
export function getFirstLevelInfo({ userId, data }) {
  return Ajax({
    url: `/get/defaultDisplay/${userId}`,
    data
  })
}

/**
 * @description 获取相应行业页签下的公司列表
 * @param {*} param0 
 */
export function getCompanyList({ userId, data }) {
  return Ajax({
    url: `/get/investmentInfo/byBusinessName/${userId}`,
    data
  })
}

/**
 * @description 获取融资页签下的公司列表 
 * @param {} param0 
 */
export function getFinancingList({ userId, data }) {
  return Ajax({
    url: `/get/investmentInfo/byRotation/${userId}`,
    data
  })
}

/**
 * @description 获取币种页签下的公司列表
 * @param {} param0 
 */
export function getCurrencyCompanyList({ userId, data }) {
  return Ajax({
    url: `/get/investmentInfo/byMoneyType/${userId}`,
    data
  })
}

/**
 * @description 删除投资信息
 * @param {*} userId 
 * @param {*} data 
 */
export function removeInvestmentInfo({ userId, data }) {
  return Ajax({
    url: `/delete/investment/info/${userId}`,
    data
  })
}


/* description 保存投资信息(新增和修改)
 * return {promise} information
 * psrams
    "id":"3",
    "userId":"1235687",
    "fundName":"中国银行",
    "companyFullName":"济宁中小公司",
    "subFundName":"山东基金",
    "business":"金融",
    "investmentRotation":"A轮",
    "investmentAmount":"100",
    "moneyUnit":"亿",
    "moneyType":"人民币",
    "investmentPercent":20,
    "companyMark":"为了济宁中小公司贷款",
    "companyLogo": "http://........./济宁"
*/

export function saveInformation(data) {
  return Ajax({
    method: 'post',
    url: '/save/investment/info',
    data: data
  })
}



/*
  *description 导出Excel
  * params fundName classify
  * return {promise}
*/

export function exportData(fundName, classify) {
  return Ajax({
    url: `/export/data/u123?fundname=${fundName}&classify=${classify}`
  })
}

/*
  *description 获取资产变动信息
  * type	String	查看类型	default： “0” 0："全部" 1："投资" 2："退出"
  * page	Integer	分页	default：1 format：从 1 开始 每页展示100条
  * fromDate	String	开始时间	format：“yyyy-MM-dd”
  * toDate	String	结束时间	format：“yyyy-MM-dd”
  * return {promise}
*/

export function getAssetChange({ userId, data }) {
  return Ajax({
    url: `/change/info/${userId}`,
    data
  })
}

/**
 * @description 按关键字搜索公司列表
 * @param {*} param0 
 */
export function searchCompanyListByKeyword({ userId, data }) {
  return Ajax({
    url: `/topSearch/company/${userId}`,
    data
  })
}

/**
 * @description 资产配置上部根据搜索条件获取公司
 * @param {*} param0 
 */
export function getCompanyMapFromTopSearch({ userId, data }) {
  return Ajax({
    url: `/get/investmentInfo/fromTopSearch/${userId}`,
    data
  })
}

/**
 * @description 获取新添加的资产信息
 */
export function getAddNewInvestmentInfo({ userId, data }) {
  return Ajax({
    url: `/getNew/investment/info/${userId}`,
    data
  })
}