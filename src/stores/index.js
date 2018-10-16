/*
  @description Store
  @author jhuang
  @date 2018-5-28
*/
import IntroductionStore from './IntroductionStore';
import AllocationStore from './allocation';
import userStore from './userStore';

class Store {
  constructor() {
    this.IntroductionStore = new IntroductionStore(this)
    this.allocationStore = new AllocationStore(this);
    this.userStore = new userStore(this);
  }
}

export default Store