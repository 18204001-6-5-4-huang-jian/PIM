import React from 'react'
import { Popover, message } from 'antd'
import '../css/header.css'
import bell from '../images/bell.png'
import search from '../images/search-active.png'
import Cookies from 'js-cookie';
import { getUserInfo } from '../api/user'
import classNames from 'classnames'
import { inject } from 'mobx-react';
import Avatar from '../images/user-avatar.png'
@inject('userStore')
export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            keywords: '',
            showInputTip: false,
            dropdownVisible: false,
            userInfo: props.userStore.userInfo ? props.userStore.userInfo : {}
        }
    }
    async componentDidMount() {
        // document.addEventListener('keyup', this.handleKeyup)
        const { userStore } = this.props;
        if (JSON.stringify(userStore.userInfo) === '{}') {
            //请求用户信息
            try {
                const token = Cookies.get('token');
                const userId = Cookies.get('userId');
                const res = await getUserInfo(token, userId);
                this.props.userStore.getUserInfo(res);
                this.setState({
                    userInfo: res
                })
            } catch (err) {
                message.error('请求用户信息错误');
            }
        }
    }
    componentDidUpdate() {

    }
    componentWillUnmount() {
        // document.removeEventListener('keyup', this.handleKeyup)
        //组件卸载不可以setState
        this.setState = (state, callback) => {
            return;
        }
    }
    keywordChange = (e) => {
        const value = e.target.value;
        this.setState({
            keywords: value
        })
    }
    handleKeyup = (e) => {
        if (e.keyCode === 13) {
            this.handleSelect();
        }
    }
    handleSelect = () => {
        //搜索
        if (!this.state.keywords.trim().length) {
            message.info('请输入关键词');
            return false;
        } else {
            message.success('请求数据');
        }
    }
    selectTab = (name) => {
        if (name === 'viewMessage') {
            //跳转舆情
            const ticket = localStorage.getItem('ticket');
            const userId = localStorage.getItem('userId');
            window.location.href = 'https://bond.analyst.ai?ticket=' + ticket + '&userId=' + userId;
        } else {
            this.props.history.push({
                pathname: name
            })
        }
    }
    logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push({
            pathname: '/'
        })
        window.sso_logout();
    }
    handleShowTip = (bool) => {
        setTimeout(() => {
            this.setState({
                showInputTip: bool
            })
        }, 300)
    }
    selectLi(route, query, keyword) {
        // console.log(this.props.location.pathname.substring(1));
        if (this.props.location.pathname.substring(1) == route) {
            //当前路由下搜索只是请求数据
        } else {
            this.props.history.push({
                pathname: route,
                search: '?keyword=' + query + '-' + keyword
            })
            this.refs.input.value = '';
        }

    }
    handleVisibleChange = (visible) => {
        this.setState({ dropdownVisible: visible });
    }
    render() {
        const { userInfo, dropdownVisible } = this.state;
        const className = classNames({
            ' home-header-popver': true,
            ' home-header-popver-active': this.state.dropdownVisible
        })
        const content = (
            <div>
                <p className="head-img">
                    {JSON.stringify(userInfo) === '{}' || userInfo.avatar === '' ? <img src={Avatar} alt="" /> : <img src={userInfo.avatar} alt="" />}
                </p>
                <p className="name">{JSON.stringify(userInfo) === '{}' ? '加载中...' : userInfo.xingming}</p>
                <p className="email">{JSON.stringify(userInfo) === '{}' ? '加载中...' : userInfo.email}</p>
                <p className="logout" onClick={this.logout}>退出登录</p>
            </div>
        )
        return (
            <div className='home-header'>
                <div className="logo"></div>
                <div className={className}>
                    <Popover
                        placement="bottomRight"
                        content={content}
                        title="用 户 详 情 信 息"
                        trigger='click'
                        visible={dropdownVisible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <div className='home-header-popver-headimg'>
                            {JSON.stringify(userInfo) === '{}' || userInfo.avatar === '' ? <img src={Avatar} alt="" /> : <img src={userInfo.avatar} alt="" />}
                        </div>
                        <div className='home-header-popver-email'>{JSON.stringify(userInfo) === '{}' ? '加载中...' : userInfo.email}</div>
                    </Popover>
                </div>
                <div className="bell-message">
                    <img src={bell} alt="" />
                </div>
                <div className="select-box">
                    <input
                        ref="input"
                        type="text"
                        placeholder="请输入关键词搜索"
                        onChange={this.keywordChange}
                        className="text"
                        onKeyUp={this.handleKeyup}
                        onFocus={() => { this.handleShowTip(true) }}
                        onBlur={() => { this.handleShowTip(false) }}
                    />
                    <img src={search} className="select-img" alt="" onClick={this.handleSelect} />
                    {/* input提示框 */}
                    {this.state.showInputTip && <div className="inputTip">
                        <ul>
                            <li>大家都在搜:</li>
                            <li onClick={() => { this.selectLi('allocation', '资产配置', this.state.keywords) }}>{`资产配置-${this.state.keywords}`}</li>
                            <li onClick={() => { this.selectLi('informationDaily', '信息日报', this.state.keywords) }}>{`信息日报-${this.state.keywords}`}</li>
                            <li onClick={() => { this.selectLi('analyst', '运营分析', this.state.keywords) }}>{`运营分析-${this.state.keywords}`}</li>
                            <li onClick={() => { this.selectLi('industryData', '工商数据', this.state.keywords) }}>{`工商数据-${this.state.keywords}`}</li>
                            <li onClick={() => { this.selectLi('viewMessage', '舆情信息', this.state.keywords) }}>{`舆情信息-${this.state.keywords}`}</li>
                        </ul>
                    </div>}
                </div>
                <div className="tabs">
                    <div className={`${this.props.location.pathname === '/allocation' || this.props.location.pathname === '/' ? 'tabs_item_active' : 'tabs_item'}`} onClick={() => { this.selectTab('allocation') }}>
                        <span className="icon-tab"></span>
                        <span className="text-tab">资产配置</span>
                    </div>
                    <div className={`${this.props.location.pathname === '/informationDaily' ? 'tabs_item_active' : 'tabs_item'}`} onClick={() => { this.selectTab('informationDaily') }}>
                        <span className="icon-tab"></span>
                        <span className="text-tab">信息日报</span>
                    </div>
                    <div className={`${this.props.location.pathname === '/analyst' ? 'tabs_item_active' : 'tabs_item'}`} onClick={() => { this.selectTab('analyst') }}>
                        <span className="icon-tab"></span>
                        <span className="text-tab">运营分析</span>
                    </div>
                    <div className={`${this.props.location.pathname === '/industryData' ? 'tabs_item_active' : 'tabs_item'}`} onClick={() => { this.selectTab('industryData') }}>
                        <span className="icon-tab"></span>
                        <span className="text-tab">工商数据</span>
                    </div>
                    <div className={`${this.props.location.pathname === '/viewMessage' ? 'tabs_item_active' : 'tabs_item'}`} onClick={() => { this.selectTab('viewMessage') }}>
                        <span className="icon-tab"></span>
                        <span className="text-tab">舆情信息</span>
                    </div>
                </div>
            </div>
        )
    }
}