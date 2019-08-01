import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'


ReactDOM.render(

<Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>

, document.getElementById('root'));


