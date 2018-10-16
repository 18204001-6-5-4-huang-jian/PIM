import React from 'react';
import { Tabs } from 'antd';
import RelationMap from '../RelationMap';
import { inject, observer } from 'mobx-react';
import './index.less';

const TabPane = Tabs.TabPane;

@inject('allocationStore')
@observer
export default class AllocationTabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { setTabType } = this.props;
        const { firstLevels, tabType } = this.props.allocationStore;

        return <div className="allocation-tabs">
            <Tabs defaultActiveKey="1" onChange={setTabType}>
                <TabPane tab="行业" key="1">
                    {
                        (firstLevels && firstLevels.length > 0 && tabType === '1') && <RelationMap firstLevels={firstLevels} index={1} editMessage={this.props.showeditMessage}></RelationMap>
                    }
                </TabPane>
                <TabPane tab="融资阶段" key="2">
                    {
                        (firstLevels && firstLevels.length > 0 && tabType === '2') && <RelationMap firstLevels={firstLevels} index={2} editMessage={this.props.showeditMessage}></RelationMap>
                    }
                </TabPane>
                <TabPane tab="币种" key="3">
                    {
                        (firstLevels && firstLevels.length > 0 && tabType === '3') && <RelationMap firstLevels={firstLevels} index={3} editMessage={this.props.showeditMessage}></RelationMap>
                    }
                </TabPane>
            </Tabs>
        </div>
    }
}