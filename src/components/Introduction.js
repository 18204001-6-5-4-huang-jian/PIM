import React from 'react';
import md5 from 'md5'
import { message } from 'antd'
import '../css/introduction.css'
// import '../less/introduction.less'
import { observer, inject } from 'mobx-react'
import classNames from 'classnames'
import PropTypes from 'prop-types';
import { userLogin } from '../api/user'
import goNext from '../images/gonext.png'
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
@inject('IntroductionStore')
@observer
export default class Introduction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            introduction: 'EVERSIGHT.BI'
        }
        this.enterKey = this.enterKey.bind(this)
        this.goNext = this.goNext.bind(this)
    }
    componentDidMount() {
        // console.log(this.props.IntroductionStore.lang);
        window.addEventListener('keyup', this.enterKey)
        this.mySwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            mousewheel: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        })
    }
    componentWillUnmount() {
        window.removeEventListener('keyup', this.enterKey)
    }
    goNext(e) {
        // console.log(e);
        e.nativeEvent.stopImmediatePropagation();
        this.mySwiper.slideNext();
    }
    enterKey(e) {
        if (e.keyCode === 13) {
            this.candleLogin();
        }
    }
    candleLogin = () => {

    }
    // candleLogin = async () => {
    //     const res = await userLogin({
    //         email: 'jhuang@abcft.com',
    //         password: md5(123456)
    //     })
    //     if (!res) {
    //         message.info('请求失败')
    //     } else if (res.data.success) {
    //         this.props.history.push({
    //             pathname: '/intelligence',
    //             search: '?name=jhuang&age=18'
    //         });
    //     } else if (!res.data.success) {
    //         message.info(`对不起,${res.data.message}`);
    //     }
    // }
    renderHtml() {
        const { introduction } = this.state;
        if (introduction === 'EVERSIGHT.BI') {
            return (
                <h1 style={{ color: '#ffffff', textAlign: 'center' }}>jhuang</h1>
            )
        }
    }
    render() {
        const { introduction } = this.state;
        const { IntroductionStore } = this.props;
        let view = this.renderHtml();
        return (
            <div className="abc-container swiper-container">
                <div className="abc-introduction swiper-wrapper">
                    <div className="abcIntroductionItem login swiper-slide">
                        <div className="abc-introduction-logo">{introduction}</div>
                        <div className="abc-introduction-text">
                            <h2>{IntroductionStore.lang === 'zh_CN' ? '欢迎您！' : 'WELCOME!'}</h2>
                            <h4>{IntroductionStore.lang === 'zh_CN' ? '即刻进入市场上最犀利的工具之一' : 'ONE OF THE SHARPEST TOOLS ON THE MARKET'}</h4>
                            <h4>{IntroductionStore.lang === 'zh_CN' ? '掌握企业关键运营数据的市场洞察力' : 'OBTAIN AHEAD OF MARKET INSIGHT OF COMPANIES CRITICAL OPERATIONAL DATA'}</h4>
                        </div>
                        {/* login */}
                        <div className="login-container">
                            <div className="title">{IntroductionStore.lang === 'zh_CN' ? '登录' : 'Login'}</div>
                        </div>
                        <div className="login-footer">
                            <div className="goNext" onClick={this.goNext}>
                                <img src={goNext} alt="" />
                            </div>
                        </div>
                    </div>
                    {/* 关于我们 */}
                    <div className="abcIntroductionItem aboutUs swiper-slide">
                        <div className="title">{IntroductionStore.lang === 'zh_CN' ? '- 关于我们 -' : '- About Us -'}</div>
                        <div className="description-text">
                            <div className="description-text-img">
                                <h3>Eversight.BI</h3>
                                <h4>{IntroductionStore.lang === 'zh_CN' ? '人工智能股权研究公司' : 'Artificial intelligence equity research company'}</h4>
                            </div>
                            <div className="text">
                                <div className={classNames({ containerFirst: true, containerFirst_: IntroductionStore.lang === '' })}>{IntroductionStore.lang === 'zh_CN' ? 'Eversight.BI是一家人工智能股权研究公司，将公共数据转化为领先于市场的商业智能。' : 'Eversight.AI is an artificial intelligence equity research company that transforms public data into market business intelligence that is ahead of the curve.'}
                                </div>
                                <div className={classNames({ containerSecond: true, containerSecond_: IntroductionStore.lang === '' })}>{IntroductionStore.lang === 'zh_CN' ? '我们主要涵盖在许多其他全球公司中在美国和香港公开交易的中国公司。 凭借尖端的人工智能技术，我们为客户提供商业智能，处于市场的最前沿。 我们提供的关键信息非常宝贵，可以明智地做出您的投资决策。' : 'We primarily cover Chinese companies that publicly trade in the United States and Hong Kong among many other global companies. With cutting-edge Artificial Intelligence technologies, we deliver our clients business intelligence at the forefront of the market. The crucial information we provide is invaluable and for making your investment decisions wisely.'}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 我们预测的股票 */}
                    <div className="abcIntroductionItem abcStocks swiper-slide">
                        <div className="title">{IntroductionStore.lang === 'zh_CN' ? '- 我们覆盖的股票 -' : '- Stocks We Cover -'}</div>
                        <ul className="introduction-products">
                            <li className="introduction-products-item">
                                <i className="abcdata-icon tencent"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon htht"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon momo"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon east_money"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon xdf"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon rcl"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon tal"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon club"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon ccl"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon tuhuashun"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon vip"></i>
                            </li>
                            <li className="introduction-products-item">
                                <i className="abcdata-icon cheetah"></i>
                            </li>
                        </ul>
                    </div>
                    {/* 我们的预测 */}
                    <div className="abcIntroductionItem abcPrediction swiper-slide">
                        <div className="title">{IntroductionStore.lang === 'zh_CN' ? '- 我们的预测 -' : '- Our predictions -'}</div>
                        {view}
                    </div>
                    {/* 联系我们 */}
                    <div className="abcIntroductionItem abcContact swiper-slide">
                        <div className="title">{IntroductionStore.lang === 'zh_CN' ? '- 联系我们 -' : '- Contact Us -'}</div>
                        <ul className="contact-warp">
                            <li className="contact-warp-item">
                                <div className="email-img"></div>
                                <div className="email-title">{IntroductionStore.lang === 'zh_CN' ? '官方邮箱' : 'Email Us'}</div>
                                <div className="email-title-item">service@Eversight.bi</div>
                            </li>
                            <li className="contact-warp-item">
                                <div className="demo-img"></div>
                                <div className="demo-title">{IntroductionStore.lang === 'zh_CN' ? '演示申请' : 'Request a Demo'}</div>
                                <div className="demo-title-item">{IntroductionStore.lang === 'zh_CN' ? '欢迎发送邮件预约' : 'Send us email to arrange a demo'}</div>
                            </li>
                            <li className="contact-warp-item">
                                <div className="location-img"></div>
                                <div className="location-title">{IntroductionStore.lang === 'zh_CN' ? '公司地址' : 'Company address'}</div>
                                <div className="location-title-item">{IntroductionStore.lang === 'zh_CN' ? '我们的办公地点位于中国北京' : 'We are based in Beijing'}</div>
                            </li>
                        </ul>
                        <div className="abc-footer">Copyroght@2016-2017 Eversight.BI. AII Rights Reserved.</div>
                    </div>
                </div>
                {/* 分页器 */}
                <div className="swiper-pagination"></div>
            </div>
        )
    }
}
// 默认props值
Introduction.defaultProps = {

}
// props 类型
Introduction.propTypes = {
    // id: PropTypes.string
}
