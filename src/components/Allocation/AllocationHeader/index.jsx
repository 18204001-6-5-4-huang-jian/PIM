import React from 'react';
import { Select, Input, Button, AutoComplete, Icon } from 'antd';
import { searchCompanyListByKeyword } from '@/api/allocation';
import { baseURL } from '@/api/baseApi';
import { inject, observer } from 'mobx-react';
import eventEmitter from '@/event';
import './index.less';

const AutoOption = AutoComplete.Option;
const Option = Select.Option;

@inject('allocationStore')
@observer
export default class AllocationHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }

    handleSearch = (value) => {
        if (value && value.trim() !== '') {
            const { fundName, tabType } = this.props.allocationStore;

            const TabName = ['行业', '融资阶段', '币种'];
            searchCompanyListByKeyword({
                userId: 'u123',
                data: {
                    key: value,
                    fundName,
                    tab: TabName[tabType - 1]
                }
            }).then(data => {
                this.setState({
                    dataSource: data || []
                });
            })
        }

        this.setState({
            keyword: value
        });
    }

    // 导出数据
    downloadExcel = () => {
        const { fundName, tabType } = this.props.allocationStore;
        let eleLink = document.createElement('a');

        eleLink.setAttribute('download', '导出文件');
        eleLink.style.display = 'none';

        eleLink.href = `${baseURL}/export/data/u123?fundName=${fundName}&classify=${tabType}`;
        document.body.appendChild(eleLink);
        eleLink.click();

        // 移除节点
        document.body.removeChild(eleLink);
    }

    renderOption = (item) => {
        const { keyword } = this.state;
        const content = <div>
            {item.slice(0, item.indexOf(keyword))}
            <span className="search-keyword">{keyword}</span>
            {item.slice(item.indexOf(keyword) + keyword.length)}
        </div>

        return <AutoOption key={item} text={item} className="autocomplete-option">
            {content}
        </AutoOption>
    }

    handleSelect = async (value) => {
        const { fundName, tabType } = this.props.allocationStore;

        await this.props.allocationStore.fetchCompanyMapFromTopSearch({
            userId: 'u123',
            data: {
                company: value,
                fundName,
                tab: ['行业', '融资阶段', '币种'][tabType - 1]
            }
        });

        eventEmitter.emit('SHOW_COMPANY_EXPANDED');

    }

    render() {
        const { dataSource } = this.state;
        const { setFundName, workGroups } = this.props;
        const prefixClassName = 'allocation-header';

        return <div className="allocation-header">
            <Select value={this.props.allocationStore.fundName} style={{ width: 120 }} onChange={setFundName}>
                {
                    (workGroups && workGroups.length > 0) && workGroups.map((workGroup, index) => {
                        return <Option value={workGroup} key={index}>{workGroup}</Option>
                    })
                }
            </Select>

            <div className={`${prefixClassName}-right`}>
                <AutoComplete
                    placeholder="请输入公司名称搜索"
                    backfill={true}
                    onSearch={this.handleSearch}
                    onSelect={this.handleSelect}
                    dataSource={dataSource.map(this.renderOption)}
                    optionLabelProp="text"
                    defaultActiveFirstOption={false}>
                    <Input suffix={<Icon type="search" />} />
                </AutoComplete>

                <Button className="add-company-btn btn" onClick={() => { this.props.addCompany() }}>
                    添加公司
                </Button>
                <Button className="export-btn btn" onClick={this.downloadExcel}>
                    导出
                </Button>
                <Button className="change-btn btn" onClick={() => { this.props.changeAllocation() }}>
                    资产变动
                </Button>
            </div>
        </div >
    }
}