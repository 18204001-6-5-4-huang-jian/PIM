import React from 'react'
import Header from '../../common/header';
import LeftSidePanel from '@/components/common/LeftSidePanel';
import { Tabs, DatePicker } from 'antd';
import './index.less';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
export default class InformationDaily extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }
    handleTabChange = (activeKey) => {
        console.log(activeKey)
    }
    RangePickerChange = (date, dateString) => {
        console.log(date, dateString);
    }
    render() {
        return (
            <div className="informationDaily-container">
                <Header {...this.props} />
                <div className="informationDaily-content">
                    <LeftSidePanel></LeftSidePanel>
                    <div className="informatinoDaily-content-text">
                        {/* 日历 */}
                        <RangePicker onChange={this.RangePickerChange} />
                        <Tabs
                            size="small"
                            defaultActiveKey="1"
                            onChange={this.handleTabChange}>
                            <TabPane tab="全部" key="1">全部</TabPane>
                            <TabPane tab="运营分析" key="2">运营分析</TabPane>
                            <TabPane tab="工商数据" key="3">工商数据</TabPane>
                            <TabPane tab="舆情信息" key="4">舆情信息</TabPane>
                            <TabPane tab="竞争对手" key="5">竞争对手</TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}