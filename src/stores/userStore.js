/**
  @description userStore
*/
import { observable, action } from 'mobx'
export default class userStore {
    constructor(rootStore) {
        this.rootStore = rootStore
    }
    @observable userInfo = {};//userInfo
    @action
    getUserInfo(userInfo) {
        this.userInfo = userInfo;
    }
}