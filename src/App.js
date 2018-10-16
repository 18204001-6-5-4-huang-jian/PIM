import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import DevTools from 'mobx-react-devtools'

//国际化
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
//引入相应组件
// import Introduction from './components/Introduction'
import Allocation from './container/Allocation'
import InformationDaily from './container/InformationDaily'
import Analyst from './container/Analyst'
import IndustryData from './components/IndustryData'
import ViewMessage from './components/ViewMessage'
import Detail from './components/Detail'
import './App.less'

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <div className="App">
                    <Switch>
                        {/* <Route exact path="/" component={Introduction} /> */}
                        {/* <Route path="/introduction" component={Introduction} /> */}
                        <Route exact path="/" component={Allocation} />
                        <Route path="/allocation" component={Allocation} />
                        <Route path="/informationDaily" component={InformationDaily} />
                        <Route path="/analyst" component={Analyst} />
                        <Route path="/industryData" component={IndustryData} />
                        <Route path="/viewMessage" component={ViewMessage} />
                        <Route path="/detail/:id" component={Detail} />
                    </Switch>
                    {process.env.NODE_ENV === 'development' && <DevTools />}
                </div>
            </LocaleProvider >
        );
    }
}
export default App;
