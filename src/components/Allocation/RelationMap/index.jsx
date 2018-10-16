import React from 'react';
import echarts from 'echarts';
import * as allocationApi from '@/api/allocation';
import { inject, observer } from 'mobx-react';
import { removeInvestmentInfo } from '@/api/allocation';
import eventEmitter from '@/event';
import { Modal, message } from 'antd';
import moment from 'moment';
import './index.less';

const confirm = Modal.confirm;
@inject('allocationStore')
@observer
export default class RelationMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investmentInfo: null,    // 投资信息
            companyInfo: null        // 公司信息
        }

        this.activeName = '';          // 激活的节点名称
        this.rootNodes = [];           // ROOT节点(原始数据)

        this.renderRootNodes = [];     // 渲染ROOT节点 (render为转换过的数据)
        this.renderNodes = [];         // echarts渲染的节点列表
        this.childNodes = [];          // 二级节点
        this.renderLinks = [];         // echarts渲染的关联边

        this.width = 0;             // 生成的容器宽度
        this.height = 0;            // 生成的容器高度
        this.nodeHeight = 80;        // 节点的高度
        this.nodeWidth = 80;        // 节点的宽度
        this.textHeight = 14;       // 文字的高度
        this.rowMaxLen = 10;        // 每行最多排10个节点
        this.hGap = 100;            // 水平间距
        this.vGap = 100;            // 垂直间距
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    // 计算节点的位置
    // index: 节点下标
    // isRoot: 是否是根节点
    calculatePosition(index, isRoot) {
        const { rowMaxLen, nodeHeight, textHeight, hGap, vGap } = this;

        if (isRoot) {
            return {
                x: -(this.width / 2) + hGap * (index - 1),
                y: -(this.height / 2)
            }
        } else {
            return {
                x: -(this.width / 2) + hGap * (index % rowMaxLen - 1),
                y: -(this.height / 2) + vGap * (Math.ceil((index + 1) / rowMaxLen))
            }
        }
    }

    // 转换数据
    convertData(rootNodes, childNodes) {
        return new Promise((resolve) => {
            let convertedData = [];

            // 是ROOT节点
            if (rootNodes && rootNodes.length) {
                for (let [index, value] of rootNodes.entries()) {
                    convertedData.push({
                        id: value.name,
                        name: value.name,
                        isRoot: true,
                        isExpand: value.isExpand,
                        symbol: `image://${value.imageUrl}`,
                        symbolSize: [80, 80],
                        fixed: true,
                        index,
                        label: {
                            show: true,
                            color: value.isExpand ? '#417CD5' : '#d7d7d7'
                        },
                        ...this.calculatePosition(index, true),
                    });
                }
                this.renderRootNodes = convertedData;

                if (convertedData.length && arguments.length === 1) {
                    this.renderNodes = [...convertedData];
                }
            }

            if (arguments.length === 2) {
                // 不是ROOT节点
                if (childNodes && childNodes.length) {
                    this.childNodes = childNodes;
                    this.rowMaxLen = Math.max(rootNodes.length, this.rowMaxLen);

                    return Promise.all(childNodes.map((value, index) => {
                        return this.getCanvasBase64Image(value.investmentInfo.companyLogo).then(base64Img => {
                            convertedData.push({
                                id: value.investmentInfo.companyFullName,
                                name: value.investmentInfo.companyFullName,
                                item: value,
                                index,
                                fixed: true,
                                symbol: `image://${base64Img}`,
                                symbolSize: [80, 80],
                                itemStyle: {
                                    borderWidth: 3,
                                    borderColor: '#2f7adc'
                                },
                                ...this.calculatePosition(index)
                            });
                        })
                    })).then(() => {
                        if (convertedData.length) {
                            this.renderNodes = [...convertedData];
                        }
                        resolve();
                    })
                } else {
                    if (convertedData.length) {
                        this.renderNodes = [...convertedData];
                    }
                    resolve();
                }
            }
        })
    }

    getCanvasBase64Image(imgUrl) {
        return new Promise(resolve => {
            let canvas = document.querySelector('#canvas');
            let context = canvas.getContext('2d');

            let image = new Image();
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = imgUrl;

            image.onload = function () {
                context.save();
                context.arc(40, 40, 40, 0, 2 * Math.PI);
                context.clip();

                context.drawImage(image, 0, 0, 80, 80);
                resolve(canvas.toDataURL('image/png'));
            }
        });
    }

    // 生成links
    generateLinks(data) {
        if (data && data.length) {
            this.renderLinks = data.map((item) => ({
                source: this.activeName === '' ? item.investmentInfo.relationName : this.activeName,
                target: item.investmentInfo.companyFullName,
                lineStyle: {
                    normal: {
                        width: 2,
                        curveness: 0.15,
                        color: '#674534'
                    }
                }
            }));
        }
    }

    getOption() {
        const _this = this;
        const { childNodes, rootNodes, nodeWidth, rowMaxLen } = this;
        let width = 0;
        const hGap = 70;

        if (childNodes.length > rootNodes.length) {
            width = Math.min(childNodes.length, rowMaxLen) * (hGap + nodeWidth)
        } else {
            width = rootNodes.length * (hGap + nodeWidth);
        }

        return {
            tooltip: {
                enterable: true,
                position: 'right',
                confine: true,
                padding: 0,
                formatter: function (params) {
                    if (params.data.isRoot || params.dataType === 'edge') return null;
                    const { investmentInfo, companyInfo } = params.data.item;
                    _this.setState({
                        investmentInfo,
                        companyInfo
                    });

                    return `
                    <div class="company-info-layer" id="companyInfoLayer">
                        <i class="arrow-left"></i>
                        <div class="company-info-title">
                            <img src=${ investmentInfo.companyLogo.replace(/\s/g, '%20')} alt="公司logo" />
                            <h2>${ investmentInfo.companyFullName || '--'}</h2>
                            <span>企业法人: ${ companyInfo.legalPerson || '--'}</span>
                        </div>
                        <dl class="company-info-list">
                            <dt>注册资本:</dt>
                            <dd>${ companyInfo.registeredCapital || '--'}</dd>
                            <dt>注册时间:</dt>
                            <dd>${ companyInfo.registeredTime ? moment(companyInfo.registeredTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</dd>
                            <dt>所在地:</dt>
                            <dd>${ companyInfo.location || '--'}</dd>
                            <dt>关系信息:</dt>
                            <dd>${ companyInfo.investmentRelationship || '--'}</dd>
                        </dl>
                        <div class="button-group">
                            <button id="editBtn">编辑</button>
                            <button id="removeInvestBtn">删除</button>
                            <button>查看更多</button>
                        </div>
                    </div`
                }
            },
            series: [
                {
                    type: 'graph',
                    symbolSize: 80,
                    draggable: false,
                    layout: 'none',
                    label: {
                        normal: {
                            show: true,
                            position: 'bottom',
                            color: '#fff',
                            formatter: function (params) {
                                if (typeof params.data.isExpand === 'undefined') {
                                    return params.data.name;
                                }
                                return params.data.name + (params.data.isExpand ? ' {arrowUp|}' : ' {arrowDown|}')
                            },
                            rich: {
                                arrowDown: {
                                    width: 10,
                                    backgroundColor: {
                                        image: require('../../../images/icon_arrow_down.png')
                                    }
                                },
                                arrowUp: {
                                    width: 10,
                                    backgroundColor: {
                                        image: require('../../../images/icon_arrow_up.png')
                                    }
                                }
                            }
                        }
                    },
                    roam: 'move',
                    edgeSymbol: ['none', 'none'],
                    edgeSymbolSize: 5,
                    left: 'center',
                    top: 60,
                    width,
                    nodes: this.renderNodes,
                    edges: this.renderLinks
                }
            ]
        };
    }

    componentDidMount() {
        // 1.生成第一层级的节点
        let container = document.getElementById('relationMapContainer' + this.props.allocationStore.tabType);
        this.relationMap = echarts.init(container);

        this.width = this.relationMap.getWidth();
        this.height = this.relationMap.getHeight();

        this.rootNodes = this.props.firstLevels.toJS().copyWithin() || [];

        if (this.rootNodes && this.rootNodes.length) {
            this.convertData(this.rootNodes);
        }

        this.relationMap.setOption(this.getOption());

        // 2.监听ROOT节点，展开或收缩子节点
        this.relationMap.on('click', { dataType: 'node' }, (params) => {
            // 子节点无需监听此事件
            if (!params.data.isRoot) return;

            const rootNode = this.rootNodes[params.dataIndex];

            // 是收缩
            if (rootNode.isExpand) {
                this.rootNodes.splice(params.dataIndex, 1, {
                    ...rootNode,
                    isExpand: !rootNode.isExpand
                });

                this.convertData(this.rootNodes);
                this.relationMap.clear();
                this.relationMap.setOption(this.getOption());

                return;
            }

            // 只展开选中的
            this.rootNodes.forEach(item => {
                item.isExpand = item.name === params.data.id;
            });

            // 设置激活节点名称
            this.activeName = params.data.id;

            // 画展开二级的所有节点
            this.drawExpandedNodes(params.data.id);
        });

        // 3.给弹窗中的按钮绑定处理事件
        document.addEventListener('click', this.clickEventHandler);

        // 4.绑定Event事件
        eventEmitter.on('SHOW_COMPANY_EXPANDED', this.showExpandedCompanys);

        // 4.绑定删除或编辑成功后的更新事件
        this.updateCallback = () => this.drawExpandedNodes(this.activeName);
        eventEmitter.on('UPDATE_RELATION_MAP', this.updateCallback);

        // 5.绑定添加成功后的显示事件
        eventEmitter.on('SHOW_ADD_SUCCESS_MAP', ({ rootNodes, childNodes }) => {
            this.rootNodes = rootNodes;
            this.activeName = '';

            this.convertData(this.rootNodes, childNodes).then(() => {
                if (childNodes && childNodes.length) {
                    this.generateLinks(childNodes);
                }
                this.relationMap.setOption(this.getOption());
            });
        });

        // 6.绑定echarts-Resize事件
        this.resizeCallback = () => this.relationMap.resize()
        window.addEventListener('resize', this.resizeCallback);
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.firstLevels) !== JSON.stringify(this.props.firstLevels)) {
            // 重新生成第一层级的节点
            this.rootNodes = this.props.firstLevels.toJS().copyWithin() || [];

            if (this.rootNodes && this.rootNodes.length) {
                this.convertData(this.rootNodes);
            }

            this.relationMap.clear();
            this.relationMap.setOption(this.getOption());
        }
    }

    // 画展开二级的所有节点和一级节点
    drawExpandedNodes(activeName) {
        this.relationMap.showLoading({
            text: '加载中...',
            color: '#c23531',
            textColor: '#f00',
            maskColor: 'rgba(0, 0, 0, 0.2)',
            zlevel: 0
        });

        const apiInvokeMethods = ['getCompanyList', 'getFinancingList', 'getCurrencyCompanyList'];
        const apiRequestParamNames = ['businessName', 'rotation', 'moneyType'];

        const { tabType, fundName } = this.props.allocationStore;
        (allocationApi[apiInvokeMethods[tabType - 1]])({
            userId: 'u123',
            data: {
                fundName,
                [apiRequestParamNames[tabType - 1]]: activeName
            }
        }).then(data => {
            this.convertData(this.rootNodes, data).then(() => {
                if (data && data.length) {
                    this.generateLinks(data);
                }

                // 移出移出改变箭头的bug
                this.relationMap.clear();
                this.relationMap.setOption(this.getOption());
                this.relationMap.hideLoading();
            });
        })
    }

    clickEventHandler = (e) => {
        let companyInfoLayer = document.getElementById('companyInfoLayer');

        if (companyInfoLayer) {
            companyInfoLayer.parentNode.removeChild(companyInfoLayer);
        }

        if (e.target.id === 'removeInvestBtn') {
            const { investmentInfo } = this.state;

            if (investmentInfo && investmentInfo.id) {
                this.deleteClick(investmentInfo);
            }
        } else if (e.target.id === 'editBtn') {
            //点击编辑获取该公司的信息
            const { investmentInfo } = this.state;

            this.props.allocationStore.saveUserinfo(investmentInfo);
            this.activeName = investmentInfo[['business', 'investmentRotation', 'moneyType'][this.props.allocationStore.tabType - 1]];
            //编辑
            this.props.allocationStore.isEdit = true;//编辑状态
            this.props.editMessage();
        }
    }

    // 显示搜索或添加的公司信息(展开的)
    showExpandedCompanys = () => {
        const { companyMapData, topNodeNames } = this.props.allocationStore;

        this.activeName = '';

        this.rootNodes.forEach(node => {
            if (topNodeNames.includes(node.name)) {
                node.isExpand = true;
            } else {
                node.isExpand = false;
            }
        });

        this.convertData(this.rootNodes, companyMapData).then(() => {
            this.generateLinks(companyMapData);
            this.relationMap.setOption(this.getOption());
        });
    }

    componentWillUnmount() {
        this.relationMap.off('click');
        this.relationMap = null;

        document.removeEventListener('click', this.clickEventHandler);
        eventEmitter.removeListener('SHOW_COMPANY_EXPANDED', this.showExpandedCompanys);
        eventEmitter.removeListener('UPDATE_RELATION_MAP', this.updateCallback);
        window.removeEventListener('resize', this.resizeCallback);
    }

    // 删除投资信息
    deleteClick = (investmentInfo) => {
        const _this = this;
        const { id, companyFullName } = investmentInfo;
        this.activeName = investmentInfo[['business', 'investmentRotation', 'moneyType'][_this.props.allocationStore.tabType - 1]];

        confirm({
            title: `确定删除"${companyFullName}"?`,
            content: '删除后， 您将无法恢复此投资信息！',
            className: 'delete-invest',
            iconType: 'question-circle',
            centered: true,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                removeInvestmentInfo({
                    userId: 'u123',
                    data: {
                        id
                    }
                }).then(() => {
                    message.success('投资信息删除成功！');
                    _this.updateCallback();
                }).catch(() => {
                    message.error('投资信息删除失败！');
                })
            }
        })
    }

    render() {
        return <div className="relation-map">
            <div className="relation-map-container" id={`relationMapContainer${this.props.index}`} style={{ width: '100%', overflow: 'auto' }}></div>
            <canvas id="canvas" width={80} height={80} hidden></canvas>
        </div>;
    }
}