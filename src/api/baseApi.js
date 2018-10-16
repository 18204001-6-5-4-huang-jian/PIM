/*
  @description api接口
  @author jhuang
  @date 2018-5-28
*/
import axios from 'axios'
import qs from 'querystring';
import Cookies from 'js-cookie';
// 生产环境和开发环境作区分
export const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/asset' : 'https://pim-pre.analyst.ai/asset';

// 移除post或get请求参数中的值为空字符的，key-value
function removeEmpty(params) {
    if (params && Object.prototype.toString.call(params) === '[object Object]') {
        for (let [key, value] of Object.entries(params)) {
            if (value === '') {
                delete params[key];
            }
        }
    }
}
export default function Ajax(opt = {}) {
    //取传进来的用户信息
    let {
        headers,
        data,
        method = 'get',
        url,
        responseType
    } = opt;
    let instance = axios.create({
        baseURL,
        // `withCredentials` 表示跨域请求时是否需要使用凭证
        withCredentials: false
    })
    // 响应中间处理层
    instance.interceptors.response.use(function (response) {
        // 请求成功后 处理在此
        let responseData = response && response.data;

        if (responseData && responseData.code === 0) {
            return responseData.data;
        } else {
            return Promise.reject(responseData.msg);
        }
    }, function (error) {
        if (error && error.code === 401) {
            //token失效但是用户并没有刷新页面,自行调用跳转登录页面
            window.sso_tologin();
        }
        // 请求失败 错误在此
        return Promise.reject(error);
    });

    // 处理表单编码请求
    if (headers && headers['Content-Type'] && method === 'post') {
        if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            //格式化字符串
            data = qs.stringify(data);
        }
    }

    // 加token和userId头部

    const token = Cookies.get('token');
    const userId = Cookies.get('userId');

    if (token && userId) {
        headers = headers || {};
        axios.defaults.headers.common['token'] = token;
        axios.defaults.headers.common['userId'] = userId;
    }

    let getData = method === 'get' ? data : null;
    let postData = method !== 'get' ? data : null;
    let promise = instance.request({
        responseType,
        url,
        method,
        headers,
        params: getData,
        data: postData
    })

    return promise
}