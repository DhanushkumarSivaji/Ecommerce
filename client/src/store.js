import { createStore, applyMiddleware } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import rootReducer from './redux/reducer/reducer'
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';
const createHistory = require("history").createBrowserHistory;
export const history = createHistory()



const middleware = routerMiddleware(history);

const reducers = combineReducers({ datas: rootReducer, router: connectRouter(history) });



export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(middleware, thunk))
)