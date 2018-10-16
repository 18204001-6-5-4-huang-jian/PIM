import React from 'react'
import { Row, Col, Icon, Button } from 'antd';
import Header from '../../common/header';
import Highcharts from 'highcharts';
import LeftSidePanel from '@/components/common/LeftSidePanel';
import './index.less';
// const { Content } = Layout

export default class Analyst extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartConfig: {
                chart: {
                    backgroundColor: '#191F28',
                    height: '315px'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: null
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        style: {
                            color: '#A6A6A6'
                        }
                    }
                },
                xAxis: {
                    labels: {
                        style: {
                            color: '#999999'
                        }
                    }
                },
                legend: {
                    align: "center",
                    verticalAlign: "bottom",
                    itemStyle: {
                        "color": "#A6A6A6"
                    },
                    itemMarginBottom: -13
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 2010
                    }
                },
                series: [
                    {
                        name: "实施人员",
                        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                    },
                    {
                        name: "工人",
                        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                    },
                    {
                        name: "销售",
                        data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
                    },
                    {
                        name: "项目开发",
                        data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                    },
                    {
                        name: "其他",
                        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
                    }
                ],
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: "horizontal",
                                    align: "center",
                                    verticalAlign: "bottom"
                                }
                            }
                        }
                    ]
                }
            },
            chartData: [{
                type: 'line',
                id: 1,
                name: 'GMV'
            }, {
                type: 'line',
                id: 2,
                name: 'GMV'
            }]

        }
        this.chartContainer = [];
    }

    componentDidMount() {
        const { chartConfig } = this.state;
        this.chartContainer.forEach((item) => {
            Highcharts.chart(item,
                chartConfig
            )
        })
    }
    addCharts = () => {

    }
    render() {
        const { chartData } = this.state;
        const chartGridNode = chartData.map((item, index) => {
            let style = {}
            if (index % 2 === 0) {
                style.marginRight = '10px';
            }
            return <Col span={12} className="analyst-chart" style={style} key={item.id}>
                <Row>
                    <Col span={12} className="analyst-chart-title">GMV</Col>
                    <Col span={12} className="analyst-chart-opt">
                        <Icon type="sync" theme="outlined" />
                        <Icon type="fullscreen" theme="outlined" />
                        <Icon type="ellipsis" theme="outlined" />
                    </Col>
                </Row>
                <Row>
                    <Col span={12} className="analyst-chart-time">2018.05.05 更新</Col>
                </Row>
                <div ref={(el) => this.chartContainer[index] = el} className="analyst-highcharts">

                </div>
                <p className="analyst-chart-source">数据来自：内部数据</p>
            </Col>
        });
        return (
            <div className="analyst-container">
                <Header {...this.props} />
                <div className="analyst-content">
                    <LeftSidePanel></LeftSidePanel>
                    <div className="analyst-content-right">
                        <div className="analyst-content-addcharts">
                            <Button onClick={this.addCharts}><Icon type="plus" theme="outlined" />添加图表</Button>
                        </div>
                        {chartGridNode}
                    </div>

                </div>
            </div>
        )
    }
}