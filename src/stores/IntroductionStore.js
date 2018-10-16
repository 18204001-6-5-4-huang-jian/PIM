/*
  IntroductionStore 
*/
import { observable, action } from 'mobx'
export default class IntroductionStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @observable lang = 'zh_CN';//lang
  @action
  changeLang(lang) {
    this.lang = lang;
  }
}