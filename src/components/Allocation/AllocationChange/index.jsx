import React from 'react';
import { message, Drawer, DatePicker, Timeline, Icon, Button, Radio } from 'antd'
import { getAssetChange } from '@/api/allocation';
import moment from 'moment';
import './index.less';
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';

export default class AllocationChange extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.showAllocation,
			types: [
				{
					name: '全部',
					value: '0'
				},
				{
					name: '投资',
					value: '1'
				},
				{
					name: '退出',
					value: '2'
				}
			],
			filterParams: {
				type: '0',
				page: 1,
				dateRange: ''
			},
			informationList: [],
			isLastPage: false		// 默认不是最后一页
		}

		this.once = true;
	}

	pickerChange = (date, dateString) => {
		this.setState({
			filterParams: Object.assign({}, this.state.filterParams, { dateRange: dateString })
		}, () => {
			this.fetchAllocationChangeData();
		});
	}


	onClose = () => {
		this.setState({
			visible: false,
			filterParams: {
				type: '0',
				page: 1,
				dateRange: ''
			}
		}, () => {
			this.props.recoverDefault()
		});
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.showAllocation !== this.props.showAllocation) {
			this.setState({
				visible: nextProps.showAllocation
			})
		}
	}

	componentDidMount() {
		this.fetchAllocationChangeData();
	}

	componentDidUpdate() {
		this.changeListContainer = document.querySelector('#informationContent');

		if (this.once && this.changeListContainer) {
			let closeFlag = false;		// 关门的标志

			this.changeListContainer.addEventListener('scroll', (e) => {
				const target = e.target;
				// 当容器高度 + 滚动条滚动高度 >= 页面高度 - 30px
				const scrollHeight = target.scrollHeight;		// 页面整体高度
				const offsetHeight = target.offsetHeight;		// 容器可见高度
				const scrollTop = target.scrollTop;				// 滚动条滚动高度
				const { isLastPage, filterParams } = this.state;

				if (offsetHeight + scrollTop >= scrollHeight - 10 && !closeFlag) {
					if (!isLastPage) {
						closeFlag = true;
						Object.assign(filterParams, { page: ++filterParams.page });

						this.fetchAllocationChangeData().then(() => {
							closeFlag = false;
						})
					}
				}
			});
			this.once = false;
		}
	}
	componentWillUnmount = () => {
		this.setState = (state, callback) => {
			return;
		};
	}
	// 获取资产变动数据
	fetchAllocationChangeData() {
		const { filterParams, informationList = [] } = this.state;
		const { dateRange: { 0: fromDate = '', 1: toDate = '' }, ...queryParams } = filterParams;

		return getAssetChange({
			userId: 'u123',
			data: {
				...queryParams,
				fromDate,
				toDate
			}
		}).then(data => {
			this.setState({
				informationList: informationList.concat(data.assetChangeInfoList || []),
				isLastPage: data.isLastPage
			});
		})
	}

	// 单选组改变
	radioChange = (e) => {
		let { filterParams } = this.state;
		this.setState({
			filterParams: Object.assign({}, filterParams, { type: e.target.value, page: 1 }),
			informationList: []
		}, () => {
			this.fetchAllocationChangeData();
			this.changeListContainer.scrollTop = 0;
		})
	}

	render() {
		const { filterParams, types, informationList, isLastPage } = this.state;

		return <div className="allocation-change">
			<Drawer
				width={400}
				title="资产变动"
				placement="right"
				closable={true}
				onClose={this.onClose}
				style={{
					padding: '24px 24px'
				}}
				visible={this.state.visible}
				className="allocation">
				<Radio.Group value={filterParams.type} buttonStyle="solid" className="change-type-group" onChange={this.radioChange}>
					{
						(types && types.length > 0) && (types.map((type, index) => {
							return <Radio.Button value={type.value} key={index}>{type.name}</Radio.Button>
						}))
					}
				</Radio.Group>

				<RangePicker
					format={dateFormat}
					onChange={this.pickerChange}
					className="allocation-calendar"
				/>
				<div className='information-flow'>
					<div className="information-content" id="informationContent">
						<Timeline mode="left">
							{
								(informationList && informationList.length > 0) && informationList.map((item, index) => {
									return <Timeline.Item key={index} dot={index === 0 && <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">
										<div className={moment(item.createTime).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'information-time' : 'no-today-time'}>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</div>
										<div className="information-time-content">
											{item.companyFullName + '，' + item.trendDetail}
										</div>
									</Timeline.Item>
								})
							}
						</Timeline>

						{
							(informationList.length > 0) && (isLastPage ? <p className="pull-no-more">没有更多了</p> : <p className="pull-more">下拉加载更多...</p>)
						}
					</div>
				</div>
			</Drawer>
		</div>
	}
}