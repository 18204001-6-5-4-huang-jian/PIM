import React from 'react';
import { message, Drawer, DatePicker, Button, Upload, Icon } from 'antd'
import { getworkGroup, getIndustryList, getkeyIndustryList, getkeyCompanyNameList, addIndustry, addFundName, selectFundName, saveInformation, getAddNewInvestmentInfo } from '@/api/allocation';
import icon from '../../../images/icon-xiala.png'
import star from '../../../images/star.png'
import errorStar from '../../../images/error-star.png'
import precent from '../../../images/precent.png'
import moment from 'moment'
import { inject } from 'mobx-react';
import ReactDOM from 'react-dom';
import eventEmitter from '@/event';
/**
 * @description 右侧弹出的投资信息(添加或编辑)
 */
@inject('allocationStore')
export default class PopRightInvestInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invest: props.status,
            workgrouplist: [],//工作小组list
            companyList: [],//公司行业list
            companyNameList: [],//公司名称list
            investroundList: ['Pre-A', 'A', 'B', 'C', 'D', 'E', ' Pre - IPO'],//投资轮次list
            isShowGroupdrapdownList: false,//工作小组
            isShowCompanydrapdownList: false,//公司行业
            isShowCompanyNameList: false,//公司名称
            isShowinvestRound: false,//投资轮次
            isShowCreatDiv: true,
            isShowCreatFundDiv: true,
            MoneyUnitArray: ['元', '千', '万', '百万', '千万', '亿'],
            isShowMoneyUnil: false,
            MoneyTypeArray: ['人民币', '美金'],
            isShowMoneyType: false,
            isShowFundInput: false,
            isShowInput: false,
            loading: false,
            selectDate: '',//公司时间
            imgUrl: '',//logo的url
            imageUrl: '',
            fundName: '',
            companyName: '',
            isEdit: false,
            isEditImg: false,
            showErrorText: false,
            isEditGroup: false,
            isEditCompanyBusniss: false,
            isEditRound: false,
            isEditMoneyType: false
        }
    }

    async componentDidMount() {
        // console.log(this.props.location.search);
        //暂无登录，故拿特定的user_id请求
        //获取工作小组信息list和默认公司行业
        const [groupData, companyData] = await Promise.all([getworkGroup('u123'), getIndustryList('u123')])
        this.setState({
            workgrouplist: groupData,
            companyList: companyData
        })
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    componentDidUpdate() {
        if (this.props.allocationStore.isEdit) {
            // console.log(this.props.allocationStore.userInfo);
            this.setState({
                isEdit: true
            })
            this.props.allocationStore.isEdit = false;
            //从store中取出公司信息进行赋值
            this.refs.group.value = this.props.allocationStore.userInfo.fundName;
            this.refs.companyName.value = this.props.allocationStore.userInfo.companyFullName;
            this.refs.fund.value = this.props.allocationStore.userInfo.subFundName;
            this.refs.business.value = this.props.allocationStore.userInfo.business;
            this.refs.investround.value = this.props.allocationStore.userInfo.investmentRotation;
            this.refs.itemMoney.value = this.props.allocationStore.userInfo.investmentAmount;
            this.refs.moneyUnit.value = this.props.allocationStore.userInfo.moneyUnit;
            this.refs.moneyType.value = this.props.allocationStore.userInfo.moneyType;
            this.refs.precent.value = this.props.allocationStore.userInfo.investmentPercent;
            this.refs.companyTextarea.value = this.props.allocationStore.userInfo.companyMark;
            this.setState({
                imageUrl: this.props.allocationStore.userInfo.companyLogo
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.status !== this.props.status) {
            this.setState({
                invest: nextProps.status
            }, () => {
                // this.props.recoverDefault()
            })
        }
    }
    componentWillUnmount() {
        this.props.allocationStore.isEdit = false;
    }
    toggleGroupgrapdown = (bool) => {
        window.clearTimeout();
        setTimeout(async () => {
            if (bool && this.refs.group.value.trim() !== '') {
                //当聚焦时输入框有值时候，用输入框的value请求数据代表输入的值
                var inputValue = this.refs.group.value;
                var res = await selectFundName('u123', inputValue);
                var itemList = res;
                var selectArray = new Array();
                itemList.filter((value) => {
                    var reg = new RegExp(inputValue, "g"); //定义正则
                    value = value.replace(reg, `<span style="color:#DB3640;">${inputValue}</span>`); //替换
                    selectArray.push(value);
                })
                this.setState({
                    isShowGroupdrapdownList: true,
                    isShowCreatFundDiv: true,
                    workgrouplist: selectArray
                })
            } else if ((bool === false && localStorage.getItem('blurFundStatus'))) {
                //点击添加基金按钮提示框不消失
                localStorage.removeItem('blurFundStatus');
                this.setState({ isShowGroupdrapdownList: true })
            } else {
                this.setState({ isShowGroupdrapdownList: bool })
            }
        }, 200)
    }
    toggleCompanygrapdown = (bool) => {
        window.clearTimeout();
        setTimeout(async () => {
            if (bool && this.refs.business.value.trim() !== '') {
                //当聚焦时输入框有值时候，用输入框的value请求数据代表输入的值
                var inputValue = this.refs.business.value;
                var res = await getkeyIndustryList('u123', inputValue);
                var itemList = res;
                var selectArray = new Array();
                itemList.filter((value) => {
                    var reg = new RegExp(inputValue, "g"); //定义正则
                    value = value.replace(reg, `<span style="color:#DB3640;">${inputValue}</span>`); //替换
                    selectArray.push(value);
                })
                this.setState({
                    isShowCompanydrapdownList: true,
                    isShowCreatDiv: true,
                    companyList: selectArray
                })
            } else if (bool === false && localStorage.getItem('blurStatus')) {
                localStorage.removeItem('blurStatus')
                //点击添加按钮提示框不消失
                this.setState({ isShowCompanydrapdownList: true })
            } else {
                this.setState({ isShowCompanydrapdownList: bool })
            }
        }, 200)
    }
    toggleInvestrounddown = (bool) => {
        window.clearTimeout();
        setTimeout(() => {
            this.setState({ isShowinvestRound: bool })
        }, 200)
    }

    toggleGroupStatus = () => {
        this.setState({
            isShowGroupdrapdownList: !this.state.isShowGroupdrapdownList
        })
    }
    toggleCompanyStatus = () => {
        this.setState({
            isShowCompanydrapdownList: !this.state.isShowCompanydrapdownList
        })
    }
    toggleisInvestRoundStatus = () => {
        this.setState({
            isShowinvestRound: !this.state.isShowinvestRound
        })
    }
    handleGroupNameChange = async (e) => {
        var inputValue = e.target.value;
        this.setState({
            fundName: e.target.name
        })
        if (e.target.value.trim() !== '') {
            var group = document.getElementById('group');
            group.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(group).style.color = '#EEEEEE';
        }
        var res = await selectFundName('u123', inputValue);
        var itemList = res;
        var selectArray = new Array();
        itemList.filter((value) => {
            var reg = new RegExp(inputValue, "g"); //定义正则
            value = value.replace(reg, `<span style="color:#DB3640;">${inputValue}</span>`); //替换
            selectArray.push(value);
        })
        this.setState({
            workgrouplist: selectArray
        })
        //判断是否编辑工作小组
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.fundName !== e.target.name) {
                this.setState({
                    isEditGroup: true
                })
            }
        }
    }
    filterHTMLTag = (msg) => {
        var msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML
        msg = msg.replace(/[|]*\n/, '') //去除行尾空格
        msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
        return msg;
    }
    selectGroupDropdownItem = (fundName) => {
        //去除高亮添加的标签
        const selectName = this.filterHTMLTag(fundName);
        this.refs.group.value = selectName;
        var group = document.getElementById('group');
        group.getElementsByTagName("img")[0].src = star;
        ReactDOM.findDOMNode(group).style.color = '#EEEEEE';
        this.setState({
            fundName: fundName
        })
        if (this.state.isShowGroupdrapdownList) {
            this.setState({
                isShowGroupdrapdownList: false
            })
        }
        //判断是否编辑工作小组
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.fundName !== fundName) {
                this.setState({
                    isEditGroup: true
                })
            }
        }
    }
    selectCompanyDropdownItem = (name) => {
        //去除高亮添加的标签
        const selectName = this.filterHTMLTag(name);
        this.refs.business.value = selectName;
        var business = document.getElementById('business');
        business.getElementsByTagName("img")[0].src = star;
        ReactDOM.findDOMNode(business).style.color = '#EEEEEE';
        if (this.state.isShowCompanydrapdownList) {
            this.setState({
                isShowCompanydrapdownList: false
            })
        }
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.business !== name) {
                this.setState({
                    isEditCompanyBusniss: true
                })
            }
        }
    }
    selectIteminvestroundItem = (name) => {
        this.refs.investround.value = name;
        var investround = document.getElementById('investround');
        investround.getElementsByTagName("img")[0].src = star;
        ReactDOM.findDOMNode(investround).style.color = '#EEEEEE';
        if (this.state.isShowinvestRound) {
            this.setState({
                isShowinvestRound: false
            })
        }
        if (this.isEdit) {
            if (this.props.allocationStore.userInfo.investmentRotation !== name) {
                this.setState({
                    isEditRound: true
                })
            }
        }
    }
    handleCompanyChange = async (e) => {
        var inputValue = e.target.value;
        if (e.target.value.trim() !== '') {
            var business = document.getElementById('business');
            business.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(business).style.color = '#EEEEEE';
        }
        var res = await getkeyIndustryList('u123', inputValue);
        var itemList = res;
        var selectArray = new Array();
        itemList.filter((value) => {
            var reg = new RegExp(inputValue, "g"); //定义正则
            value = value.replace(reg, `<span style="color:#DB3640;">${inputValue}</span>`); //替换
            selectArray.push(value);
        })
        this.setState({
            companyList: selectArray
        })
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.business !== inputValue) {
                this.setState({
                    isEditCompanyBusniss: true
                })
            }
        }
    }
    closeInvest = () => {
        this.setState({
            isEdit: false,//恢复默认状态
            imageUrl: '',
            showErrorText: false,
            selectDate: '',
            isEditGroup: false,
            isEditCompanyBusniss: false,
            isEditRound: false,
            isEditMoneyType: false,
            invest: false
        }, () => {
            var imgs = document.getElementsByClassName('star');
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].src = star;
            }
            var divs = document.getElementsByClassName('invest-item-left');
            for (let i = 0; i < divs.length; i++) {
                divs[i].style.color = '#EEEEEE';
            }
            // 清空input表单
            this.refs.group.value = '';
            this.refs.companyName.value = '';
            this.refs.fund.value = '';
            this.refs.business.value = '';
            this.refs.investround.value = '';
            this.refs.itemMoney.value = '';
            this.refs.moneyUnit.value = '';
            this.refs.moneyType.value = '';
            this.refs.precent.value = '';
            this.refs.companyTextarea.value = '';
            this.props.recoverDefault();
        })
    }
    addCompanygrapd = () => {
        //添加行业
        localStorage.setItem("blurStatus", true);
        this.setState({
            isShowInput: true
        }, () => {
            //向下滚动到底
            var scrollDom = document.getElementById('dropDownList');
            scrollDom.scrollTop = scrollDom.scrollHeight;
        })
    }
    addFundName = () => {
        //添加基金/工作小组
        localStorage.setItem("blurFundStatus", true);
        this.setState({
            isShowFundInput: true
        }, () => {
            //向下滚动到底
            var scrollDom = document.getElementById('funddropDownList');
            scrollDom.scrollTop = scrollDom.scrollHeight;
        })

    }
    //获取基金
    investmentChange = (e) => {
        // console.log(e.target.value);
        if (e.target.value.trim() !== '') {
            var fund = document.getElementById('fund')
            fund.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(fund).style.color = '#EEEEEE';
        }
    }
    confirmaddFundNameEnter = (e) => {
        if (e.keyCode === 13) {
            this.confirmaddFundName();
        }
    }
    confirmaddFundName = async () => {
        if (this.refs.FundNameInput.value.trim() === '') {
            message.info('添加工作小组不可以为空，请重新输入');
        } else {
            //添加工作小组
            try {
                const res = await addFundName('u123', this.refs.FundNameInput.value);
                this.setState({
                    isShowFundInput: false
                }, async () => {
                    var scrollDom = document.getElementById('funddropDownList');
                    scrollDom.scrollTop = 0;
                    //重新刷新工作小组
                    const groupData = await getworkGroup('u123');
                    this.setState({
                        workgrouplist: groupData
                    })
                })
            } catch (err) {
                message.error('工作小组已经存在');
                this.setState({
                    isShowFundInput: true
                }, () => {
                    //向下滚动到底
                    var scrollDom = document.getElementById('funddropDownList');
                    scrollDom.scrollTop = scrollDom.scrollHeight;
                })
            }
        }
    }
    confirmaddCompanyEnter = (e) => {
        if (e.keyCode === 13) {
            this.confirmaddCompanygrapd();
        }
    }
    confirmaddCompanygrapd = async () => {
        if (this.refs.businessInput.value.trim() === '') {
            message.info('添加行业不可以为空，请重新输入');
        } else {
            //添加行业
            try {
                const res = await addIndustry('u123', this.refs.businessInput.value);
                this.setState({
                    isShowInput: false
                }, async () => {
                    var scrollDom = document.getElementById('dropDownList');
                    scrollDom.scrollTop = 0;
                    //重新刷新公司行业数据
                    const companyData = await getIndustryList('u123');
                    this.setState({
                        companyList: companyData
                    })
                })
            } catch (err) {
                message.error('行业已经存在');
                this.setState({
                    isShowInput: true
                }, () => {
                    //向下滚动到底
                    var scrollDom = document.getElementById('dropDownList');
                    scrollDom.scrollTop = scrollDom.scrollHeight;
                })
            }
        }
    }
    // 选择单位
    toggleMoneyUnit = (bool) => {
        window.clearTimeout();
        setTimeout(() => {
            this.setState({
                isShowMoneyUnil: bool
            })
        }, 200)
    }
    toggleMoneyUnitStatus = () => {
        this.setState({
            isShowMoneyUnil: !this.state.isShowMoneyUnil
        })
    }
    selectMoneyUnitItem = (name) => {
        this.refs.moneyUnit.value = name;
        var span = document.getElementById('item-money-span-unit');
        ReactDOM.findDOMNode(span).style.color = '#EEEEEE'
        this.setState({
            isShowMoneyUnil: false
        })
    }
    // 选择币种
    toggleMoneyType = (bool) => {
        window.clearTimeout();
        setTimeout(() => {
            this.setState({
                isShowMoneyType: bool
            })
        }, 200)

    }
    toggleMoneyTypeStatus = () => {
        this.setState({
            isShowMoneyType: !this.state.isShowMoneyType
        })
    }
    selectMoneyTypeItem = (name) => {
        this.refs.moneyType.value = name;
        var span = document.getElementById('item-money-span-type');
        ReactDOM.findDOMNode(span).style.color = '#EEEEEE'
        this.setState({
            isShowMoneyType: false
        })
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.moneyType !== name) {
                this.setState({
                    isEditMoneyType: true
                })
            }
        }
    }
    onChangeTimePicker = (date, dateString) => {
        //拿到投资时间
        // console.log(dateString);
        this.setState({
            selectDate: dateString
        }, () => {
            var selectDate = document.getElementById('selectDate');
            selectDate.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(selectDate).style.color = '#EEEEEE'
        })
    }
    changeCompanyName = async (e) => {
        const value = e.target.value;
        this.setState({
            companyName: e.target.value
        })
        if (value.trim() === '') {
            this.setState({
                isShowCompanyNameList: false,
                companyNameList: []
            })
        } else {
            var companyName = document.getElementById('companyName')
            companyName.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(companyName).style.color = '#EEEEEE';
            const res = await getkeyCompanyNameList('u123', value);
            if (res.length > 0) {
                this.setState({
                    isShowCompanyNameList: true,
                    companyNameList: res
                })
            } else {
                this.setState({
                    isShowCompanyNameList: false,
                    companyNameList: []
                })
            }
        }
    }
    focusCompanyName = async (e) => {
        const value = e.target.value;
        if (value.trim() !== '') {
            const res = await getkeyCompanyNameList('u123', value);
            this.setState({
                isShowCompanyNameList: true,
                companyNameList: res
            })
        }
    }
    selectCompanyNameListItem = (name) => {
        this.refs.companyName.value = name;
        this.setState({
            companyName: name,
            isShowCompanyNameList: false
        })
    }
    investroundChange = (e) => {
        var value = e.target.value;
        if (value) {
            var investround = document.getElementById('investround');
            investround.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(investround).style.color = '#EEEEEE';
        }
        if (this.isEdit) {
            if (this.props.allocationStore.userInfo.investmentRotation !== value) {
                this.setState({
                    isEditRound: true
                })
            }
        }
    }
    investmentMoneyChange = (e) => {
        if (e.target.value !== '' && (/^\d+\.?\d{0,2}$/.test(e.target.value))) {
            var itemMoney = document.getElementById('itemMoney');
            itemMoney.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(itemMoney).style.color = '#EEEEEE'
        }
    }
    investmentUnitChange = (e) => {
        if (e.target.value.trim() !== '') {
            var span = document.getElementById('item-money-span-unit');
            ReactDOM.findDOMNode(span).style.color = '#EEEEEE'
        }
    }
    investmentTypeChange = (e) => {
        if (e.target.value.trim() !== '') {
            var span = document.getElementById('item-money-span-type');
            ReactDOM.findDOMNode(span).style.color = '#EEEEEE'
        }
        if (this.state.isEdit) {
            if (this.props.allocationStore.userInfo.moneyType !== e.target.value) {
                this.setState({
                    isEditMoneyType: true
                })
            }
        }
    }
    precentChange = (e) => {
        if (e.target.value !== '' && (/^\d+\.?\d{0,2}$/.test(e.target.value))) {
            var precent = document.getElementById('precent');
            precent.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(precent).style.color = '#EEEEEE'
        }
    }
    // 上传图片
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    //上传前的钩子
    beforeUpload = (file) => {
        const isImgRequest = file.type === 'image/jpeg' || 'image/png';
        if (!isImgRequest) {
            message.error('您只能上传jpg或者png格式的图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片必须小于2MB');
        }
        return isImgRequest && isLt2M;
    }
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code !== 0) {
                message.error(info.file.response.msg)
            } else {
                console.log(info.file.response.data);//返回的图片的url
                var companyLogo = document.getElementById('companyLogo');
                companyLogo.getElementsByTagName("img")[0].src = star;
                ReactDOM.findDOMNode(companyLogo).style.color = '#EEEEEE'
                if (this.state.isEdit) {
                    //编辑图片
                    this.setState({
                        isEditImg: true
                    })
                }
                this.setState({
                    imageUrl: info.file.response.data//用于上传整体资料
                })
                //获取URl
                this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                    // imageUrl,
                    loading: false,
                }));
            }
        }
    }
    investmentRemark = (e) => {
        // console.log(e.target.value);
        if (e.target.value.trim() !== '') {
            var companyTextarea = document.getElementById('companyTextarea');
            companyTextarea.getElementsByTagName("img")[0].src = star;
            ReactDOM.findDOMNode(companyTextarea).style.color = '#EEEEEE'
        }
    }
    // 回车验证
    onKeyup = (e) => {
        if (e.keyCode === 13) {
            this.verify();
        }
    }
    submitForm = async () => {
        if (this.state.isEdit === false) {
            //添加资产配置
            if (this.refs.addBtn.innerHTML === '添加') {
                //首次添加校验表单
                // this.verify();
                if (this.verify()) {
                    //请求添加数据
                    try {
                        const [fundName, businessName] = [this.refs.group.value, this.refs.business.value];
                        //公司备注和企业logo可以不填写
                        const res = saveInformation({
                            id: -1,
                            userId: 'u123',
                            fundName: this.refs.group.value,
                            companyFullName: this.refs.companyName.value,
                            subFundName: this.refs.fund.value,
                            business: this.refs.business.value,
                            investmentRotation: this.refs.investround.value,
                            investmentAmount: Math.round(this.refs.itemMoney.value * 100) / 100,
                            moneyUnit: this.refs.moneyUnit.value,
                            moneyType: this.refs.moneyType.value,
                            investmentPercent: Math.round(this.refs.precent.value * 100) / 100,
                            investmentTime: this.state.selectDate,
                            companyMark: this.refs.companyTextarea.value,
                            companyLogo: this.state.imageUrl
                        }).then(() => {
                            getAddNewInvestmentInfo({
                                userId: 'u123',
                                data: {
                                    fundName,
                                    businessName
                                }
                            }).then(data => {
                                if (data) {
                                    const { businessList, CompanyList, investmentInfo: { business: businessName } } = data;
                                    let [rootNodes, childNodes] = [[], []];

                                    if (businessList && businessList.length) {
                                        rootNodes = businessList.map(business => {
                                            return {
                                                ...business,
                                                isExpand: business.name === businessName
                                            }
                                        });

                                        childNodes = CompanyList.map(company => {
                                            const { investmentInfo } = company;

                                            investmentInfo.relationName = investmentInfo.business;
                                            return company;
                                        });
                                    }

                                    eventEmitter.emit('SHOW_ADD_SUCCESS_MAP', {
                                        rootNodes,
                                        childNodes
                                    });
                                }
                            });
                            message.success('添加资产配置成功')
                        })

                    } catch (error) {
                        message.error('添加资产配置失败');
                    } finally {
                        var imgs = document.getElementsByClassName('star');
                        for (let i = 0; i < imgs.length; i++) {
                            imgs[i].src = star;
                        }
                        var divs = document.getElementsByClassName('invest-item-left');
                        for (let i = 0; i < divs.length; i++) {
                            divs[i].style.color = '#EEEEEE';
                        }
                        //添加之后关闭抽屉
                        this.setState({
                            invest: false,
                            imageUrl: '',
                            showErrorText: false,
                            selectDate: '',
                            isEdit: false,
                            isEditGroup: false,
                            isEditCompanyBusniss: false,
                            isEditRound: false,
                            isEditMoneyType: false
                        }, () => {
                            //清空input表单
                            this.refs.group.value = '';
                            this.refs.companyName.value = '';
                            this.refs.fund.value = '';
                            this.refs.business.value = '';
                            this.refs.investround.value = '';
                            this.refs.itemMoney.value = '';
                            this.refs.moneyUnit.value = '';
                            this.refs.moneyType.value = '';
                            this.refs.precent.value = '';
                            this.refs.companyTextarea.value = '';
                            this.props.recoverDefault();
                        })
                    }
                }
            } else if (this.refs.addBtn.innerHTML === '确认添加') {
                if (this.sureVerify()) {
                    try {
                        const [fundName, businessName] = [this.refs.group.value, this.refs.business.value];
                        //公司备注和企业logo可以不填写
                        const res = saveInformation({
                            id: -1,
                            userId: 'u123',
                            fundName: this.refs.group.value,
                            companyFullName: this.refs.companyName.value,
                            subFundName: this.refs.fund.value,
                            business: this.refs.business.value,
                            investmentRotation: this.refs.investround.value,
                            investmentAmount: Math.round(this.refs.itemMoney.value * 100) / 100,
                            moneyUnit: this.refs.moneyUnit.value,
                            moneyType: this.refs.moneyType.value,
                            investmentPercent: Math.round(this.refs.precent.value * 100) / 100,
                            investmentTime: this.state.selectDate,
                            companyMark: this.refs.companyTextarea.value,
                            companyLogo: this.state.imageUrl
                        }).then(() => {
                            getAddNewInvestmentInfo({
                                userId: 'u123',
                                data: {
                                    fundName,
                                    businessName
                                }
                            }).then(data => {
                                if (data) {
                                    const { businessList, CompanyList, investmentInfo: { business: businessName } } = data;
                                    let [rootNodes, childNodes] = [[], []];

                                    if (businessList && businessList.length) {
                                        rootNodes = businessList.map(business => {
                                            return {
                                                ...business,
                                                isExpand: business.name === businessName
                                            }
                                        });

                                        childNodes = CompanyList.map(company => {
                                            const { investmentInfo } = company;

                                            investmentInfo.relationName = investmentInfo.business;
                                            return company;
                                        });
                                    }

                                    eventEmitter.emit('SHOW_ADD_SUCCESS_MAP', {
                                        rootNodes,
                                        childNodes
                                    });
                                }
                            });
                            message.success('添加资产配置成功')
                        })

                    } catch (error) {
                        message.error('添加资产配置失败');
                    } finally {
                        var imgs = document.getElementsByClassName('star');
                        for (let i = 0; i < imgs.length; i++) {
                            imgs[i].src = star;
                        }
                        var divs = document.getElementsByClassName('invest-item-left');
                        for (let i = 0; i < divs.length; i++) {
                            divs[i].style.color = '#EEEEEE';
                        }
                        //添加之后关闭抽屉
                        this.setState({
                            invest: false,
                            imageUrl: '',
                            showErrorText: false,
                            selectDate: '',
                            isEdit: false,
                            isEditGroup: false,
                            isEditCompanyBusniss: false,
                            isEditRound: false,
                            isEditMoneyType: false
                        }, () => {
                            //清空input表单
                            this.refs.group.value = '';
                            this.refs.companyName.value = '';
                            this.refs.fund.value = '';
                            this.refs.business.value = '';
                            this.refs.investround.value = '';
                            this.refs.itemMoney.value = '';
                            this.refs.moneyUnit.value = '';
                            this.refs.moneyType.value = '';
                            this.refs.precent.value = '';
                            this.refs.companyTextarea.value = '';
                            this.props.recoverDefault()
                        })
                    }
                }
            }
        } else if (this.state.isEdit === true) {
            //编辑状态
            if (this.refs.addBtn.innerHTML === '编辑') {
                if (this.verify()) {
                    //请求数据
                    try {
                        //公司备注和企业logo可以不填写
                        const res = saveInformation({
                            id: this.props.allocationStore.userInfo.id,//编辑公司的id
                            userId: 'u123',
                            fundName: this.refs.group.value,
                            companyFullName: this.refs.companyName.value,
                            subFundName: this.refs.fund.value,
                            business: this.refs.business.value,
                            investmentRotation: this.refs.investround.value,
                            investmentAmount: Math.round(this.refs.itemMoney.value * 100) / 100,
                            moneyUnit: this.refs.moneyUnit.value,
                            moneyType: this.refs.moneyType.value,
                            investmentPercent: Math.round(this.refs.precent.value * 100) / 100,
                            investmentTime: this.props.allocationStore.userInfo.investmentTime ? this.props.allocationStore.userInfo.investmentTime : this.state.selectDate,
                            companyMark: this.refs.companyTextarea.value,
                            companyLogo: this.state.isEdit && this.state.isEditImg ? this.state.imageUrl : this.state.isEdit && !this.state.isEditImg ? this.props.allocationStore.userInfo.companyLogo : this.state.imageUrl
                        }).then(() => {
                            message.success('编辑资产配置成功')
                            eventEmitter.emit('UPDATE_RELATION_MAP');
                        })
                    } catch (error) {
                        message.error('编辑资产配置失败');
                    } finally {
                        var imgs = document.getElementsByClassName('star');
                        for (let i = 0; i < imgs.length; i++) {
                            imgs[i].src = star;
                        }
                        var divs = document.getElementsByClassName('invest-item-left');
                        for (let i = 0; i < divs.length; i++) {
                            divs[i].style.color = '#EEEEEE';
                        }
                        //编辑之后关闭抽屉
                        this.setState({
                            isEdit: false,//恢复默认状态
                            imageUrl: '',
                            showErrorText: false,
                            selectDate: '',
                            isEditGroup: false,
                            isEditCompanyBusniss: false,
                            isEditRound: false,
                            isEditMoneyType: false,
                            invest: false
                        }, () => {
                            //清空input表单
                            this.refs.group.value = '';
                            this.refs.companyName.value = '';
                            this.refs.fund.value = '';
                            this.refs.business.value = '';
                            this.refs.investround.value = '';
                            this.refs.itemMoney.value = '';
                            this.refs.moneyUnit.value = '';
                            this.refs.moneyType.value = '';
                            this.refs.precent.value = '';
                            this.refs.companyTextarea.value = '';
                            this.props.recoverDefault();
                            eventEmitter.emit('UPDATE_RELATION_MAP');
                        })
                    }
                }
            } else if (this.refs.addBtn.innerHTML === '确认编辑') {
                if (this.sureVerify()) {
                    try {
                        //公司备注和企业logo可以不填写
                        const res = saveInformation({
                            id: this.props.allocationStore.userInfo.id,//编辑公司的id
                            userId: 'u123',
                            fundName: this.refs.group.value,
                            companyFullName: this.refs.companyName.value,
                            subFundName: this.refs.fund.value,
                            business: this.refs.business.value,
                            investmentRotation: this.refs.investround.value,
                            investmentAmount: Math.round(this.refs.itemMoney.value * 100) / 100,
                            moneyUnit: this.refs.moneyUnit.value,
                            moneyType: this.refs.moneyType.value,
                            investmentPercent: Math.round(this.refs.precent.value * 100) / 100,
                            investmentTime: this.props.allocationStore.userInfo.investmentTime ? this.props.allocationStore.userInfo.investmentTime : this.state.selectDate,
                            companyMark: this.refs.companyTextarea.value,
                            companyLogo: this.state.isEdit && this.state.isEditImg ? this.state.imageUrl : this.state.isEdit && !this.state.isEditImg ? this.props.allocationStore.userInfo.companyLogo : this.state.imageUrl
                        }).then(() => {
                            message.success('编辑资产配置成功')
                            eventEmitter.emit('UPDATE_RELATION_MAP');
                        })
                    } catch (error) {
                        message.error('编辑资产配置失败');
                    } finally {
                        var imgs = document.getElementsByClassName('star');
                        for (let i = 0; i < imgs.length; i++) {
                            imgs[i].src = star;
                        }
                        var divs = document.getElementsByClassName('invest-item-left');
                        for (let i = 0; i < divs.length; i++) {
                            divs[i].style.color = '#EEEEEE';
                        }
                        //编辑之后关闭抽屉
                        this.setState({
                            isEdit: false,//恢复默认状态
                            imageUrl: '',
                            showErrorText: false,
                            selectDate: '',
                            isEditGroup: false,
                            isEditCompanyBusniss: false,
                            isEditRound: false,
                            isEditMoneyType: false,
                            invest: false
                        }, () => {
                            //清空input表单
                            this.refs.group.value = '';
                            this.refs.companyName.value = '';
                            this.refs.fund.value = '';
                            this.refs.business.value = '';
                            this.refs.investround.value = '';
                            this.refs.itemMoney.value = '';
                            this.refs.moneyUnit.value = '';
                            this.refs.moneyType.value = '';
                            this.refs.precent.value = '';
                            this.refs.companyTextarea.value = '';
                            this.props.recoverDefault();
                        })
                    }
                }
            }
        }
    }
    verify = () => {
        if (!this.refs.group.value.trim()) {
            message.error('工作小组不可以为空');
            var group = document.getElementById('group')
            group.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(group).style.color = '#E35857'
            return false;
        }
        if (!this.refs.companyName.value.trim()) {
            message.error('公司名称不可以为空');
            var companyName = document.getElementById('companyName')
            companyName.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(companyName).style.color = '#E35857'
            return false;
        }
        if (!this.refs.fund.value.trim()) {
            message.error('投资基金不可以为空');
            var fund = document.getElementById('fund')
            fund.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(fund).style.color = '#E35857'
            return false;
        }
        if (!this.refs.business.value.trim()) {
            message.error('公司行业不可以为空');
            var business = document.getElementById('business');
            business.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(business).style.color = '#E35857'
            return false;
        }
        if (!this.refs.investround.value.trim()) {
            message.error('投资轮次不可以为空');
            var investround = document.getElementById('investround');
            investround.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(investround).style.color = '#E35857'
            return false;
        }
        if (!this.refs.itemMoney.value.trim()) {
            message.error('投资金额不可以为空');
            var itemMoney = document.getElementById('itemMoney');
            itemMoney.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(itemMoney).style.color = '#E35857'
            return false;
        }
        if (!/^\d+\.?\d{0,2}$/.test(this.refs.itemMoney.value.trim())) {
            message.error('投资金额必须是数字类型且最多俩位小数');
            var itemMoney = document.getElementById('itemMoney');
            itemMoney.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(itemMoney).style.color = '#E35857'
            return false;
        }
        if (!this.refs.moneyUnit.value.trim()) {
            message.error('投资单位不可以为空');
            var span = document.getElementById('item-money-span-unit');
            ReactDOM.findDOMNode(span).style.color = '#E35857'
            return false;
        }
        if (!this.refs.moneyType.value.trim()) {
            message.error('投资币种不可以为空');
            var span = document.getElementById('item-money-span-type');
            ReactDOM.findDOMNode(span).style.color = '#E35857'
            return false;
        }
        if (!this.refs.precent.value.trim()) {
            message.error('投资占比不可以为空');
            var precent = document.getElementById('precent');
            precent.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(precent).style.color = '#E35857'
            return false;
        }
        if (!/^\d+\.?\d{0,2}$/.test(this.refs.precent.value.trim())) {
            message.error('投资占比必须为数字类型且最多俩位小数');
            var precent = document.getElementById('precent');
            precent.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(precent).style.color = '#E35857'
            return false;
        }
        if (this.refs.addBtn.innerHTML === '编辑') {
            if (this.props.allocationStore.userInfo.investmentTime === '') {
                //编辑 验证store的时间
                message.error('投资时间不可以为空');
                var selectDate = document.getElementById('selectDate');
                selectDate.getElementsByTagName("img")[0].src = errorStar;
                ReactDOM.findDOMNode(selectDate).style.color = '#E35857'
                return false;
            }
        } else {
            //添加<正常验证>
            if (this.state.selectDate === '') {
                message.error('投资时间不可以为空');
                var selectDate = document.getElementById('selectDate');
                selectDate.getElementsByTagName("img")[0].src = errorStar;
                ReactDOM.findDOMNode(selectDate).style.color = '#E35857'
                return false;
            }
        }

        if (!this.refs.companyTextarea.value.trim()) {
            var companyTextarea = document.getElementById('companyTextarea');
            companyTextarea.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(companyTextarea).style.color = '#E35857'
            if (this.state.isEdit) {
                this.refs.addBtn.innerHTML = '确认编辑'
            } else {
                this.refs.addBtn.innerHTML = '确认添加'
            }
            this.setState({
                showErrorText: true
            })
            return false;
        }
        if (this.state.imageUrl === '') {
            var companyLogo = document.getElementById('companyLogo');
            companyLogo.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(companyLogo).style.color = '#E35857'
            if (this.state.isEdit) {
                this.refs.addBtn.innerHTML = '确认编辑'
            } else {
                this.refs.addBtn.innerHTML = '确认添加'
            }
            this.setState({
                showErrorText: true
            })
            return false;
        }
        return true;

    }
    sureVerify = () => {
        if (!this.refs.group.value.trim()) {
            message.error('工作小组不可以为空');
            var group = document.getElementById('group')
            group.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(group).style.color = '#E35857'
            return false;
        }
        if (!this.refs.companyName.value.trim()) {
            message.error('公司名称不可以为空');
            var companyName = document.getElementById('companyName')
            companyName.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(companyName).style.color = '#E35857'
            return false;
        }
        if (!this.refs.fund.value.trim()) {
            message.error('投资基金不可以为空');
            var fund = document.getElementById('fund')
            fund.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(fund).style.color = '#E35857'
            return false;
        }
        if (!this.refs.business.value.trim()) {
            message.error('公司行业不可以为空');
            var business = document.getElementById('business');
            business.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(business).style.color = '#E35857'
            return false;
        }
        if (!this.refs.investround.value.trim()) {
            message.error('投资轮次不可以为空');
            var investround = document.getElementById('investround');
            investround.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(investround).style.color = '#E35857'
            return false;
        }
        if (!this.refs.itemMoney.value.trim()) {
            message.error('投资金额不可以为空');
            var itemMoney = document.getElementById('itemMoney');
            itemMoney.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(itemMoney).style.color = '#E35857'
            return false;
        }
        if (!/^\d+\.?\d{0,2}$/.test(this.refs.itemMoney.value.trim())) {
            message.error('投资金额必须是数字类型且最多俩位小数');
            var itemMoney = document.getElementById('itemMoney');
            itemMoney.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(itemMoney).style.color = '#E35857'
            return false;
        }
        if (!this.refs.moneyUnit.value.trim()) {
            message.error('投资单位不可以为空');
            var span = document.getElementById('item-money-span-unit');
            ReactDOM.findDOMNode(span).style.color = '#E35857'
            return false;
        }
        if (!this.refs.moneyType.value.trim()) {
            message.error('投资币种不可以为空');
            var span = document.getElementById('item-money-span-type');
            ReactDOM.findDOMNode(span).style.color = '#E35857'
            return false;
        }
        if (!this.refs.precent.value.trim()) {
            message.error('投资占比不可以为空');
            var precent = document.getElementById('precent');
            precent.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(precent).style.color = '#E35857'
            return false;
        }
        if (!/^\d+\.?\d{0,2}$/.test(this.refs.precent.value.trim())) {
            message.error('投资占比必须为数字类型且最多俩位小数');
            var precent = document.getElementById('precent');
            precent.getElementsByTagName("img")[0].src = errorStar;
            ReactDOM.findDOMNode(precent).style.color = '#E35857'
            return false;
        }
        if (this.refs.addBtn.innerHTML === '确认编辑') {
            //确认编辑 验证store的时间
            if (this.props.allocationStore.userInfo.investmentTime === '') {
                message.error('投资时间不可以为空');
                var selectDate = document.getElementById('selectDate');
                selectDate.getElementsByTagName("img")[0].src = errorStar;
                ReactDOM.findDOMNode(selectDate).style.color = '#E35857'
                return false;
            }
        } else {
            //确认添加<正常验证>
            if (this.state.selectDate === '') {
                message.error('投资时间不可以为空');
                var selectDate = document.getElementById('selectDate');
                selectDate.getElementsByTagName("img")[0].src = errorStar;
                ReactDOM.findDOMNode(selectDate).style.color = '#E35857'
                return false;
            }
        }

        return true;
    }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        //工作小组
        const groupItem = this.state.workgrouplist.map((item, index) => {
            return <div
                className="drop-down-list-item"
                key={index}
                onClick={() => {
                    this.selectGroupDropdownItem(item)
                }}
                dangerouslySetInnerHTML={{
                    __html: item
                }}></div>
        })
        //公司名称
        const companyNameListItem = this.state.companyNameList.map((item, index) => {
            return <div className="drop-down-list-item" key={index} onClick={() => { this.selectCompanyNameListItem(item) }}>{item}</div>
        })
        //公司行业
        const companyItem = this.state.companyList.map((item, index) => {
            return <div
                className="drop-down-list-item"
                key={index}
                onClick={() => {
                    this.selectCompanyDropdownItem(item)
                }}
                dangerouslySetInnerHTML={{
                    __html: item
                }}></div>
        })
        //投资轮次
        const investroundItem = this.state.investroundList.map((item, index) => {
            return <div
                className="drop-down-list-item"
                key={index}
                onClick={() => {
                    this.selectIteminvestroundItem(item)
                }}>{item}</div>
        })
        const moneyUnitItem = this.state.MoneyUnitArray.map((item, index) => {
            return <div className="money-unit-drop-item" key={index} onClick={() => { this.selectMoneyUnitItem(item) }}>{item}</div>
        })
        const moneyTypeitem = this.state.MoneyTypeArray.map((item, index) => {
            return <div className="money-type-drop-item" key={index} onClick={() => { this.selectMoneyTypeItem(item) }}>{item}</div>
        })
        //用于上传图片拼接api
        const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/asset' : 'https://pim-pre.analyst.ai/asset';
        return <div className="pop-right-invest-info">
            <Drawer
                width={400}
                title={this.state.isEdit ? '编辑投资信息' : '添加投资信息'}
                placement="right"
                maskClosable={false}
                closable={true}
                onClose={this.closeInvest}
                style={{
                    padding: '0px'
                }}
                visible={this.state.invest}
                className="invest">
                <hr
                    style={{
                        backgroundColor: '#666666',
                        height: '1px',
                        border: 'none'
                    }} />
                <div className="invest-items">
                    <div className="invest-item">
                        <div className="invest-item-left" id="group">
                            <img src={star} alt="" className="star" />工作小组
                        </div>
                        <div className="invest-item-right">
                            <input
                                type="text"
                                className="item-group"
                                ref="group"
                                onKeyUp={this.onKeyup}
                                onChange={this.handleGroupNameChange}
                                onFocus={() => {
                                    this.toggleGroupgrapdown(true)
                                }}
                                onBlur={() => {
                                    this.toggleGroupgrapdown(false)
                                }} /> {this.state.workgrouplist.length && <img src={icon} alt="" className="icon" onClick={this.toggleGroupStatus} />}
                            {/* 工作小组下拉菜单提示 */}
                            {this.state.isShowGroupdrapdownList && <div className="drop-down-list" id="funddropDownList">
                                {groupItem}
                                {this.state.isShowFundInput && <div className="fundName-input-container">
                                    <input type="text" placeholder="输入工作小组名称" ref="FundNameInput" onKeyDown={this.confirmaddFundNameEnter} onFocus={() => { this.setState({ isShowGroupdrapdownList: true }) }} />
                                    <button onClick={this.confirmaddFundName}>确定</button>
                                </div>}
                                {/* 工作小组添加 */}
                                {this.state.isShowCreatFundDiv && <div className="creat-div">
                                    <Button type="primary" icon="plus" size='small' className="btn" onClick={this.addFundName}>添加工作小组</Button>
                                </div>}
                            </div>}
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="companyName">
                            <img src={star} alt="" className="star" />公司名称
                        </div>
                        <div className="invest-item-right">
                            <input
                                type="text"
                                className="item-company-name"
                                ref="companyName"
                                onChange={this.changeCompanyName}
                                onKeyUp={this.onKeyup}
                                onBlur={() => {
                                    setTimeout(() => {
                                        this.setState({ isShowCompanyNameList: false })
                                    }, 200)
                                }}
                                onFocus={this.focusCompanyName}
                            />
                            {/* 公司名称下拉提示 */}
                            {this.state.isShowCompanyNameList && <div className="drop-down-list">{companyNameListItem}</div>}
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="fund">
                            <img src={star} alt="" className="star" />投资基金
                        </div>
                        <div className="invest-item-right">
                            <input
                                type="text"
                                className="item-fund-name"
                                ref="fund"
                                onChange={this.investmentChange}
                                onKeyUp={this.onKeyup} />
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="business">
                            <img src={star} alt="" className="star" />公司行业
                        </div>
                        <div className="invest-item-right">
                            <input
                                type="text"
                                className="item-company-business"
                                ref="business"
                                onChange={this.handleCompanyChange}
                                onKeyUp={this.onKeyup}
                                onFocus={() => {
                                    this.toggleCompanygrapdown(true)
                                }}
                                onBlur={() => {
                                    this.toggleCompanygrapdown(false)
                                }} />
                            {this.state.companyList.length && <img src={icon} alt="" className="icon" onClick={this.toggleCompanyStatus} />}
                            {/* 公司行业下拉菜单提示 */}
                            {this.state.isShowCompanydrapdownList &&
                                <div className="drop-down-list" id="dropDownList">
                                    {/* 下拉提示列表 */}
                                    {companyItem}
                                    {/* 添加行业输入框 */}
                                    {this.state.isShowInput && <div className="business-input-container">
                                        <input type="text" placeholder="输入行业名称" ref="businessInput" onKeyDown={this.confirmaddCompanyEnter} onFocus={() => { this.setState({ isShowCompanydrapdownList: true }) }} />
                                        <button onClick={this.confirmaddCompanygrapd}>确定</button>
                                    </div>}
                                    {/* 添加行业容器 */}
                                    {this.state.isShowCreatDiv && <div className="creat-div">
                                        <Button type="primary" icon="plus" size='small' className="btn" onClick={this.addCompanygrapd}>添加行业</Button>
                                    </div>}
                                </div>}
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="investround">
                            <img src={star} alt="" className="star" />投资轮次
                        </div>
                        <div className="invest-item-right">
                            <input
                                type="text"
                                className="item-invest-round"
                                ref="investround"
                                onKeyUp={this.onKeyup}
                                onChange={this.investroundChange}
                                onFocus={() => {
                                    this.toggleInvestrounddown(true)
                                }}
                                onBlur={() => {
                                    this.toggleInvestrounddown(false)
                                }} />
                            <img
                                src={icon}
                                alt=""
                                className="icon"
                                onClick={this.toggleisInvestRoundStatus} /> {this.state.isShowinvestRound && <div className="drop-down-list">{investroundItem}</div>}
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="itemMoney">
                            <img src={star} alt="" className="star" />投资金额
                        </div>
                        <div className="invest-item-right">
                            <input type="text" className="item-money" ref="itemMoney" onKeyUp={this.onKeyup} onChange={this.investmentMoneyChange} /><span className="item-money-span-unit" id="item-money-span-unit">单位</span>
                            <input type="text" className="item-money-unit" ref="moneyUnit" onKeyUp={this.onKeyup} onChange={this.investmentUnitChange} onFocus={() => { this.toggleMoneyUnit(true) }} onBlur={() => { this.toggleMoneyUnit(false) }} /><img src={icon} alt="" className="icon-unit" onClick={this.toggleMoneyUnitStatus} /><span className="item-money-span-type" id="item-money-span-type">币种</span>
                            <input type="text" className="item-money-type" ref="moneyType" onKeyUp={this.onKeyup} onChange={this.investmentTypeChange} onFocus={() => { this.toggleMoneyType(true) }} onBlur={() => { this.toggleMoneyType(false) }} /><img src={icon} alt="" className="icon-type" onClick={this.toggleMoneyTypeStatus} />
                            {/* 下拉菜单提示 */}
                            {this.state.isShowMoneyUnil && <div className="money-unit-drop">{moneyUnitItem}</div>}
                            {this.state.isShowMoneyType && <div className="money-type-drop">{moneyTypeitem}</div>}
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="precent">
                            <img src={star} alt="" className="star" />投资占比
                        </div>
                        <div className="invest-item-right">
                            <input type="text" className="item-proportion" ref="precent" onChange={this.precentChange} onKeyUp={this.onKeyup} />
                            <img src={precent} className="icon-precent" />
                        </div>
                    </div>
                    <div className="invest-item">
                        <div className="invest-item-left" id="selectDate">
                            <img src={star} alt="" className="star" />投资时间
                        </div>
                        <div className="invest-item-right">
                            <DatePicker
                                onChange={this.onChangeTimePicker}
                                allowClear={false}
                                className='datepicker-time'
                                placeholder={moment(new Date()).format("YYYY-MM-DD")}
                                size='large'
                                style={{
                                    width: "260px",
                                    height: "40px"
                                }}
                            />
                        </div>
                    </div>
                    <div className="invest-item-large">
                        <div className="invest-item-left" id="companyTextarea">
                            <img src={star} alt="" className="star" />公司备注
                        </div>
                        <div className="invest-item-right-company">
                            <textarea className="textarea" placeholder="请输入公司备注" ref="companyTextarea" onChange={this.investmentRemark}></textarea>
                        </div>
                    </div>
                    <div className="invest-item-large">
                        <div className="invest-item-left" id="companyLogo">
                            <img src={star} alt="" className="star" />企业logo
                        </div>
                        <div className="invest-item-right-logo">
                            <Upload
                                name="file"
                                listType="picture-card"
                                className="avatar-uploader"
                                multiple={false}
                                showUploadList={false}
                                action={`${baseURL}/picture/upload/u123?fundName=${this.state.isEdit ? this.refs.group.value : this.state.fundName}&companyName=${this.state.isEdit ? this.refs.companyName.value : this.state.companyName}`}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.isEdit && !this.state.isEditImg ? <img src={this.props.allocationStore.userInfo.companyLogo} alt="logo" /> : imageUrl ? <img src={imageUrl} alt="logo" /> : uploadButton}
                                {/* {imageUrl ? <img src={imageUrl} alt="logo" /> : uploadButton} */}
                            </Upload>
                        </div>
                    </div>
                    {/* error文字提示 */}
                    {this.state.showErrorText && <div className="error-text">您还有信息未填写(建议填写完整信息)  如果您已经确定填写内容，
再次点击下方添加按钮即可完成添加！</div>}
                    {/* btn */}
                    <div className="sureBtn">
                        <button className="btn" ref="addBtn" onClick={this.submitForm}>{this.state.isEdit ? '编辑' : '添加'}</button>
                    </div>
                </div>
            </Drawer>
        </div>
    }
}