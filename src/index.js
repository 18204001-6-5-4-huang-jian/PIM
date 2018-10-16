import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//应用Mobx
import { Provider } from 'mobx-react'
import abcStore from './stores'
// import { HashRouter } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';

const Wrap = (
  <Provider {...new abcStore()}>
    <Router basename="/">
      <App />
    </Router>
  </Provider>
)

ReactDOM.render(
  Wrap,
  document.getElementById('root')
)
registerServiceWorker();
