/**
 * @description 左侧可收缩面板
 */
import React from 'react';
import { AutoComplete, Input, Icon, Button, Modal, Popover } from 'antd';
import './index.less';
const confirm = Modal.confirm;
export default class LeftSidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultAllActive: true,   // 默认选中全部
            addOpponentDialog: false, // 添加竞争对手弹窗
            addGroupDialog: false, //添加分组弹窗
            dataSource: [],
            companyList: [
                {
                    name: '小米',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'Huang Jian',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                },
                {
                    name: '京东集团',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'jhuang',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                },
                {
                    name: '阿博茨科技',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'jhuang',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                },
                {
                    name: '阿里巴巴',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'jhuang',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                },
                {
                    name: '美团',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'jhuang',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                },
                {
                    name: '百度',
                    country: 'US',
                    abbreviation: 'BABA',
                    expanded: false,
                    opponents: [
                        {
                            name: '四象智能',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        },
                        {
                            name: 'jhuang',
                            country: 'US',
                            abbreviation: 'RYB',
                            type: '竞争对手'
                        }
                    ]
                }
            ],
            groupList: [
                {
                    fileName: '教育',
                    fileExpanded: false,
                    list: [
                        {
                            name: '集团',
                            country: 'US',
                            abbreviation: 'BABA',
                            id: '33',
                            expanded: false,
                            opponents: [
                                {
                                    name: '四象智能',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                },
                                {
                                    name: 'jhuang',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                }
                            ]
                        },
                        {
                            name: '哈哈哈',
                            country: 'UK',
                            abbreviation: 'alibab',
                            id: '44',
                            expanded: false,
                            opponents: [
                                {
                                    name: '四象智能',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                },
                                {
                                    name: 'jhuang',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                }
                            ]
                        }
                    ]
                },
                {
                    fileName: '新东方',
                    fileExpanded: false,
                    list: [
                        {
                            name: '哈哈哈',
                            country: 'UK',
                            abbreviation: 'alibab',
                            id: '44',
                            expanded: false,
                            opponents: [
                                {
                                    name: '四象智能',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                },
                                {
                                    name: 'jhuang',
                                    country: 'US',
                                    abbreviation: 'RYB',
                                    type: '竞争对手'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    // 切换Tab
    switchTab(status) {
        this.setState({
            defaultAllActive: status
        })
    }

    //公司展开或收缩 
    expandOrShrink(index) {
        const companyItem = this.state.companyList[index];
        companyItem.expanded = !companyItem.expanded;
        this.setState({
            companyList: this.state.companyList
        })
    }
    //分组文件夹的公司展开或收缩 
    expandGroupOrShrink = (index, listItemIndex) => {
        const groupItem = this.state.groupList[index].list[listItemIndex];
        groupItem.expanded = !groupItem.expanded;
        this.setState({
            groupList: this.state.groupList
        })
    }
    showAddOpponentDialog = (e) => {
        e.stopPropagation();
        this.setState({
            addOpponentDialog: true
        })
    }
    showAddGroupDialog = () => {
        this.setState({
            addGroupDialog: true
        })
    }
    chooseCompanyItem = (e, name) => {
        e.preventDefault();
        console.log('name:', name)
    }
    chooseGroupItem = (e, name) => {
        e.preventDefault();
        console.log('name:', name)
    }
    handleEnterCompany = (e) => {
        e.stopPropagation();
        window.event.cancelBubble = true;//IE
    }
    handleEnterGroup = (e) => {
        e.stopPropagation();
        window.event.cancelBubble = true;//IE
    }
    //文件夹的展开和收缩
    handleFolderStatus = (index) => {
        const groupItem = this.state.groupList[index];
        groupItem.fileExpanded = !groupItem.fileExpanded;
        const groupItemList = groupItem.list;
        for (let i = 0; i < groupItemList.length; i++) {
            //该文件夹下的公司的竞争对手关闭
            groupItemList[i].expanded = false;
        }
        this.setState({
            groupList: this.state.groupList
        })
    }

    showMore = (e) => {
        e.stopPropagation();
    }
    // handleCompanyMouseOver = (e) => {
    //     if (e.target.className === 'company-item-content') {
    //         const DOM = e.target.lastChild;
    //         DOM.style.display = 'block';
    //     }
    // }
    // handleCompanyMouseOut = (e) => {
    //     window.clearTimeout();
    //     if (e.target.className === 'company-item-content') {
    //         const DOM = e.target.lastChild;
    //         setTimeout(() => {
    //             DOM.style.display = 'none';
    //         }, 1000)
    //     }
    // }
    //添加对手Modal
    handleOk = (e) => {
        this.setState({
            addOpponentDialog: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            addOpponentDialog: false,
        });
    }
    //添加分组Modal
    handleAddGroupOk = (e) => {
        this.setState({
            addGroupDialog: false,
        });
    }
    handleAddGroupCancel = (e) => {
        this.setState({
            addGroupDialog: false,
        });
    }
    //AutoComplete
    handleSelect = (value) => {
        console.log('Select', value);
    }
    handleSearch = (value) => {
        if (value && value.trim() !== '') {
            this.setState({
                dataSource: []
            })
        }
    }
    render() {
        const { companyList, groupList, defaultAllActive, dataSource } = this.state;
        const content = (
            <div className="action-container">
                <p>复制</p>
                <p>删除</p>
                <p>编辑</p>
            </div>
        )
        return <div className="left-sider-panel">
            <AutoComplete
                placeholder={defaultAllActive ? '请输入公司名称' : '请输入分组名称'}
                backfill={true}
                optionLabelProp="text"
                defaultActiveFirstOption={false}
                dataSource={dataSource}
                onSelect={this.handleSelect}
                onSearch={this.handleSearch}
            >
                <Input suffix={<Icon type="search" className="search-icon" />} size="small" />
            </AutoComplete>
            <div className="company-container">
                <h2>公司</h2>
                <ul className="company-tabs">
                    <li className={defaultAllActive ? 'active' : ''}><a onClick={this.switchTab.bind(this, true)}>全部</a></li>
                    <li className={defaultAllActive ? '' : 'active'}><a onClick={this.switchTab.bind(this, false)}>分组</a></li>
                </ul>
                <div className="tab-panel-box">
                    <div className="company-list" style={{ 'display': defaultAllActive ? 'block' : 'none' }}>
                        {
                            (companyList && companyList.length > 0) && companyList.map((company, index) => {
                                return <div className="company-item" key={index}>
                                    <div className={`company-item-content${company.expanded ? ' active' : ''}`} style={{ cursor: 'pointer' }}>
                                        <Icon type={`${company.expanded ? 'minus' : 'plus'}-square`} theme="filled" style={{ color: '#ADB8C7' }} onClick={() => this.expandOrShrink(index)} />
                                        <div className="company-info">
                                            <p className="company-name">{company.name}</p>
                                            <span className="company-country">{company.country}</span>
                                            <span>{company.abbreviation}</span>
                                        </div>
                                        <a href="javascript:void(0);" style={{ 'display': company.expanded ? 'block' : 'none' }} onClick={e => this.handleEnterCompany(e)} className="enter-company"><Icon type="switcher" />进入公司<Icon type="ellipsis" theme="filled" style={{ 'transform': 'rotateZ(90deg)' }} /></a>
                                    </div>
                                    {
                                        company.expanded && <div className="opponent-company-list">
                                            {
                                                (company.opponents && company.opponents.length > 0) && company.opponents.map((opponent, index) => {
                                                    return (<div className="company-item-content" style={{ cursor: 'pointer' }} key={index} onClick={(e) => { this.chooseCompanyItem(e, opponent.name) }}>
                                                        <div className="company-info">
                                                            <p>{opponent.name}</p>
                                                            <span className="company-country">{opponent.country}</span>
                                                            <span className="company-code">{opponent.abbreviation}</span>
                                                            <span className="company-type">{opponent.type}</span>
                                                        </div>
                                                    </div>);
                                                })
                                            }
                                            <Button className="add-opponent-btn" icon="plus" onClick={this.showAddOpponentDialog}>添加竞争对手</Button>
                                        </div>
                                    }
                                </div>
                            })
                        }
                    </div>
                    <div className="group-list" style={{ 'display': defaultAllActive ? 'none' : 'block' }}>
                        {(groupList && groupList.length) ?
                            groupList.map((group, index) => {
                                return <div className="group-item" key={index}>
                                    {/* 文件夹 */}
                                    <div className="file-container">
                                        <Icon type="folder-open" theme="filled" onClick={() => { this.handleFolderStatus(index) }} />
                                        <span className="file-name" onClick={() => { this.handleFolderStatus(index) }}>{group.fileName}</span>
                                        <Popover
                                            content={content}
                                            placement="right"
                                            trigger="click"
                                        >
                                            <Icon type="ellipsis" theme="filled" onClick={(e) => { this.showMore }} />
                                        </Popover>
                                    </div>
                                    {
                                        group.list.length > 0 && group.list.map((listItem, listItemIndex) => {
                                            return (
                                                <div key={listItemIndex} style={{ 'display': group.fileExpanded ? 'block' : 'none' }} className="group-item-content">
                                                    <div className={`group-item-content-company${listItem.expanded ? ' active' : ''}`}>
                                                        <Icon type={`${listItem.expanded ? 'minus' : 'plus'}-square`} theme="filled" style={{ color: '#ADB8C7' }} onClick={() => this.expandGroupOrShrink(index, listItemIndex)} />
                                                        <div className="group-info">
                                                            <p>{listItem.name}</p>
                                                            <span className="group-country">{listItem.country}</span>
                                                            <span>{listItem.abbreviation}</span>
                                                        </div>
                                                        <a href="javascript:void(0);" style={{ 'display': listItem.expanded ? 'block' : 'none' }} onClick={e => this.handleEnterGroup(e)} className="enter-group"><Icon type="switcher" />进入公司<Icon type="ellipsis" theme="filled" style={{ 'transform': 'rotateZ(90deg)' }} /></a>
                                                    </div>
                                                    {/* 竞争对手 */}
                                                    {listItem.expanded && <div className="opponent-group-list">
                                                        {listItem.opponents.length > 0 &&
                                                            listItem.opponents.map((opponent, opponentIndex) => {
                                                                return (
                                                                    <div className="group-item-content" style={{ cursor: 'pointer' }} key={opponentIndex} onClick={(e) => { this.chooseGroupItem(e, opponent.name) }}>
                                                                        <div className="group-info">
                                                                            <p>{opponent.name}</p>
                                                                            <span className="group-country">{opponent.country}</span>
                                                                            <span className="group-code">{opponent.abbreviation}</span>
                                                                            <span className="group-type">{opponent.type}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        <Button className="add-opponent-btn" icon="plus" onClick={this.showAddOpponentDialog}> 添加竞争对手</Button>
                                                    </div>}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            })
                            : <div className="no-group-container">
                                <img src={require('../../../images/null-status.png')} />
                                <div className="no-group-title">暂无分组，您可以添加分组</div>
                                <Button type="primary" icon="plus" className="create-group-btn" onClick={this.showAddGroupDialog}>添加分组</Button>
                            </div>}
                    </div>
                </div>
            </div>

            <div className="panel-toggle-minimize">
                <Icon type="caret-left" theme="outlined" />
            </div>
            <Modal
                className="addCompetitor"
                title="添加竞争对手"
                visible={this.state.addOpponentDialog}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="添加"
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
            <Modal
                className="addGroup"
                title="我的分组"
                visible={this.state.addGroupDialog}
                onOk={this.handleAddGroupOk}
                onCancel={this.handleAddGroupCancel}
                okText="添加"
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    }
}