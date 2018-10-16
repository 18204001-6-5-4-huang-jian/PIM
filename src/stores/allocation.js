import { observable, action, flow, bound, autorun } from 'mobx';
import { getFirstLevelInfo, getCompanyMapFromTopSearch } from '@/api/allocation'
import { message } from 'antd'

export default class AllocationStore {
    @observable status = 'active';//控制状态
    @observable topLevelInfos = [];    // 顶级的数据信息
    @observable fundName = '';  // 工作小组
    @observable tabType = '1';         // 1:行业，2:融资阶段，3:币种
    @observable firstLevels = [];      // 第一级数据
    @observable isEdit = false;  //是否是编辑
    @observable userInfo = {};//点击编辑保存公司信息
    @observable companyMapData = [];        // 用户搜索公司或刚添加投资信息的关系图数据
    @observable topNodeNames = [];           // 顶级节点名称

    @action.bound
    saveUserinfo(userInfo) {
        this.userInfo = userInfo;
    }
    @action.bound
    setFundName(fundName) {
        this.fundName = fundName;
    }

    @action.bound
    setTabType(tabType) {
        this.tabType = tabType;
    }

    @action.bound
    clearFirstLevels() {
        this.firstLevels = [];
    }


    fetchFirstLevelInfo = flow(function* (params) {
        try {
            const data = yield getFirstLevelInfo(params);

            if (data) {
                const VariableNames = ['businessList', 'investmentRotatioList', 'moneyTypeList'];
                this.firstLevels = data[VariableNames[this.tabType - 1]] || [].map(item => ({
                    ...item,
                    isExpand: false
                }));
            }

        } catch (err) {
            console.log('err: ', err);
            message.error('获取Tab中的信息失败！');
        }
    })


    // 获取搜索公司的关系
    fetchCompanyMapFromTopSearch = flow(function* (params) {
        try {
            const data = yield getCompanyMapFromTopSearch(params);

            if (data) {
                const { CompanyList: companyList, label } = data;
                const topNodeNames = [];

                if (companyList && companyList.length) {
                    companyList.forEach(company => {
                        const { investmentInfo } = company;

                        investmentInfo.relationName = investmentInfo[{
                            '行业': 'business',
                            '融资阶段': 'investmentRotation',
                            '币种': 'moneyType'
                        }[label]];

                        topNodeNames.push(investmentInfo.relationName);
                    });

                    this.companyMapData = companyList;
                    this.topNodeNames = topNodeNames;
                } else {
                    this.companyMapData = [];
                }

            }
        } catch (err) {
            console.log('err: ', err);
            message.error('获取搜索公司数据失败！');
        }
    })
}