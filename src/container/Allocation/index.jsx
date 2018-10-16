import React from 'react'
import { Button } from 'antd'
import classNames from 'classnames'
import Header from '../../common/header'
import AllocationChange from '@/components/Allocation/AllocationChange';
import AllocationHeader from '@/components/Allocation/AllocationHeader';
import PopRightInvestInfo from '@/components/Allocation/PopRightInvestInfo';
import AllocationTabs from '@/components/Allocation/AllocationTabs';
import { inject, observer } from 'mobx-react';
import { getworkGroup } from '@/api/allocation';
import './index.less'
const dateFormat = 'YYYY/MM/DD';
@inject('allocationStore')
@observer
class Allocation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: props.allocationStore.status,//控制显示home-content-header
			changeInvest: false,//控制添加投资信息
			showAllocation: false, //控制资产时间轴
			workGroups: []	// 工作小组列表
		}
	}
	componentDidMount() {
		var url_ = window.location.href;
		//首次 获取ticket和userId 用于跳转舆情作为参数
		if (url_.indexOf('ticket') !== -1 && url_.indexOf('userId') !== -1) {
			var ticket = url_.substring(url_.indexOf('ticket=') + 7);
			var _ticket = ticket.substring(0, 18);
			var userId = url_.substring(url_.indexOf('userId=') + 7);
			var _userId = userId.substring(0, 36);
			localStorage.setItem('ticket', _ticket);
			localStorage.setItem('userId', _userId)
		}

		getworkGroup('u123').then(data => {
			if (data && data.length > 0) {
				this.props.allocationStore.status = 'active';
			}
			this.setState({
				workGroups: data
			}, () => {
				if (data && data.length) {
					this.setFundName(data[0]);
					// 第一级节点列表
					this.findFirstLevelByNameAndType();
				}
			})
		})
	}
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}
	// 改变激活的Tab
	setTabType = async (activeTab) => {
		await this.props.allocationStore.setTabType(activeTab);
		this.props.allocationStore.clearFirstLevels();
		this.findFirstLevelByNameAndType();
	}

	// 改变工作小组
	setFundName = (fundName) => {
		this.props.allocationStore.setFundName(fundName);
		this.findFirstLevelByNameAndType();
	}

	addMessage = () => {
		this.setState({
			changeInvest: true,
		});
	}

	findFirstLevelByNameAndType() {
		// 根据工作小组和类型获取数据
		this.props.allocationStore.fetchFirstLevelInfo({
			userId: 'u123',
			data: {
				fundName: this.props.allocationStore.fundName,
				type: this.props.allocationStore.tabType
			}
		});
	}

	addCompany = () => {
		this.props.allocationStore.isEdit = false;
		this.setState({
			changeInvest: true
		})
	}

	componentWillUnmount() {
		this.props.allocationStore.setTabType('1');
	}

	render() {
		const { workGroups } = this.state;
		const { allocationStore } = this.props;
		return (
			<div className='home-container'>
				<Header {...this.props} />
				{/* 内容 */}
				<div className="home-content">
					{
						allocationStore.status === 'active' ? (
							<div className="allocation-content-body">
								{ /* 资产配置信息头部 */}
								<AllocationHeader
									setFundName={this.setFundName}
									addCompany={this.addCompany}
									changeAllocation={() => { this.setState({ showAllocation: true }) }}
									workGroups={workGroups} />

								{ /* Tab切换 */}
								<AllocationTabs setTabType={this.setTabType} showeditMessage={this.addMessage} />
							</div>
						) : (
								<div className="default-no-data">
									<img src={require('../../images/null-status.png')} alt='' onClick={this.addMessage} />
									<div className='title'>暂无投资信息，您可以添加信息</div>
									<Button type="primary" icon="plus" size='large' onClick={this.addMessage}>添加信息</Button>
								</div>
							)
					}
					{ /* 右侧弹窗投资信息填写 */}
					<PopRightInvestInfo status={this.state.changeInvest} recoverDefault={() => { this.setState({ changeInvest: false }) }} />
					{ /* 右侧弹窗资产变动消息提示 */}
					{<AllocationChange showAllocation={this.state.showAllocation} recoverDefault={() => { this.setState({ showAllocation: false }) }} />}
				</div>
			</div>
		)
	}
}

export default Allocation